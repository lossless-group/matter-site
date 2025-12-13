/**
 * GitHub Content Fetcher
 *
 * Fetches markdown content from a private GitHub repository at runtime.
 * This keeps confidential content out of the deployed static assets.
 *
 * Required environment variables:
 * - GITHUB_CONTENT_PAT: Fine-grained personal access token with read-only Contents access
 * - GITHUB_CONTENT_OWNER: Repository owner (e.g., "lossless-group")
 * - GITHUB_CONTENT_REPO: Repository name (e.g., "dark-matter-secure-data")
 * - GITHUB_CONTENT_BRANCH: Branch to fetch from (defaults to "main")
 *
 * LOCAL DEMO MODE:
 * When GITHUB_CONTENT_PAT is not set, the library falls back to reading from
 * local files in src/content/markdown-memos/ for testing purposes.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join, basename } from 'node:path';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';
const GITHUB_API_BASE = 'https://api.github.com';

// Local fallback directory (relative to project root)
const LOCAL_MEMOS_DIR = 'src/content/markdown-memos';

export interface GitHubContentOptions {
  owner?: string;
  repo?: string;
  branch?: string;
  path: string;
}

export interface GitHubContentResult {
  content: string;
  sha: string;
  lastModified?: string;
}

export interface GitHubFileEntry {
  name: string;
  path: string;
  sha: string;
  type: 'file' | 'dir';
  size: number;
}

// Simple in-memory cache to reduce API calls
const contentCache = new Map<string, { data: GitHubContentResult; expires: number }>();
const listCache = new Map<string, { data: GitHubFileEntry[]; expires: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getConfig() {
  const pat = import.meta.env.GITHUB_CONTENT_PAT;
  return {
    pat,
    owner: import.meta.env.GITHUB_CONTENT_OWNER || 'lossless-group',
    repo: import.meta.env.GITHUB_CONTENT_REPO || 'dark-matter-secure-data',
    branch: import.meta.env.GITHUB_CONTENT_BRANCH || 'main',
    // Use local fallback when PAT is not configured
    useLocalFallback: !pat || pat === '',
  };
}

/**
 * Check if we're in local demo mode (no PAT configured)
 */
export function isLocalDemoMode(): boolean {
  return getConfig().useLocalFallback;
}

/**
 * Normalize a slug for comparison (lowercase, remove dots).
 */
export function normalizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/\./g, '');
}

/**
 * Fetch content from local filesystem (fallback for demo/testing)
 */
async function fetchLocalContent(slug: string): Promise<GitHubContentResult | null> {
  try {
    // Try to find a matching file in the local memos directory
    const files = await readdir(LOCAL_MEMOS_DIR);
    const normalizedSlug = normalizeSlug(slug);

    const matchingFile = files.find((f) => {
      if (!f.endsWith('.md')) return false;
      const fileSlug = f.replace('.md', '');
      return fileSlug === slug || normalizeSlug(fileSlug) === normalizedSlug;
    });

    if (!matchingFile) {
      console.warn(`[github-content:local] No matching file for slug: ${slug}`);
      return null;
    }

    const filePath = join(LOCAL_MEMOS_DIR, matchingFile);
    const content = await readFile(filePath, 'utf-8');

    return {
      content,
      sha: 'local',
      lastModified: undefined,
    };
  } catch (error) {
    console.error(`[github-content:local] Failed to read local file for ${slug}:`, error);
    return null;
  }
}

/**
 * List files from local filesystem (fallback for demo/testing)
 */
async function listLocalDirectory(): Promise<GitHubFileEntry[]> {
  try {
    const files = await readdir(LOCAL_MEMOS_DIR);
    return files
      .filter((f) => f.endsWith('.md'))
      .map((f) => ({
        name: f,
        path: join(LOCAL_MEMOS_DIR, f),
        sha: 'local',
        type: 'file' as const,
        size: 0,
      }));
  } catch (error) {
    console.error('[github-content:local] Failed to list local directory:', error);
    return [];
  }
}

/**
 * Fetch raw content from a file in the private GitHub repo.
 * Uses the raw.githubusercontent.com endpoint for simplicity.
 *
 * In local demo mode (no PAT), falls back to local files.
 */
export async function fetchGitHubContent(
  options: GitHubContentOptions
): Promise<GitHubContentResult | null> {
  const config = getConfig();
  const {
    owner = config.owner,
    repo = config.repo,
    branch = config.branch,
    path,
  } = options;

  // Local fallback mode - extract slug from path and read local file
  if (config.useLocalFallback) {
    console.log('[github-content] Using local fallback mode (no PAT configured)');
    // Extract the filename/slug from the path
    const slug = basename(path).replace('.md', '');
    return fetchLocalContent(slug);
  }

  // Check cache first
  const cacheKey = `${owner}/${repo}/${branch}/${path}`;
  const cached = contentCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  const rawUrl = `${GITHUB_RAW_BASE}/${owner}/${repo}/${branch}/${path}`;

  try {
    const response = await fetch(rawUrl, {
      headers: {
        Authorization: `token ${config.pat}`,
        Accept: 'application/vnd.github.raw',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`[github-content] Not found: ${path}`);
        return null;
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const content = await response.text();

    const result: GitHubContentResult = {
      content,
      sha: response.headers.get('etag')?.replace(/"/g, '') || '',
      lastModified: response.headers.get('last-modified') || undefined,
    };

    // Cache the result
    contentCache.set(cacheKey, {
      data: result,
      expires: Date.now() + CACHE_TTL_MS,
    });

    return result;
  } catch (error) {
    console.error(`[github-content] Failed to fetch ${path}:`, error);
    return null;
  }
}

/**
 * List files in a directory of the private GitHub repo.
 * Returns only markdown files by default.
 *
 * In local demo mode (no PAT), falls back to local files.
 */
export async function listGitHubDirectory(
  dirPath: string,
  options?: { includeNonMarkdown?: boolean }
): Promise<GitHubFileEntry[]> {
  const config = getConfig();

  // Local fallback mode
  if (config.useLocalFallback) {
    console.log('[github-content] Using local fallback mode for directory listing');
    return listLocalDirectory();
  }

  // Check cache first
  const cacheKey = `list:${config.owner}/${config.repo}/${config.branch}/${dirPath}`;
  const cached = listCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  const apiUrl = `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}/contents/${dirPath}?ref=${config.branch}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${config.pat}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`[github-content] Directory not found: ${dirPath}`);
        return [];
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn(`[github-content] Expected array for directory listing: ${dirPath}`);
      return [];
    }

    let entries: GitHubFileEntry[] = data
      .filter((item: any) => item.type === 'file')
      .map((item: any) => ({
        name: item.name,
        path: item.path,
        sha: item.sha,
        type: item.type,
        size: item.size,
      }));

    // Filter to markdown files unless includeNonMarkdown is true
    if (!options?.includeNonMarkdown) {
      entries = entries.filter((e) => e.name.endsWith('.md'));
    }

    // Cache the result
    listCache.set(cacheKey, {
      data: entries,
      expires: Date.now() + CACHE_TTL_MS,
    });

    return entries;
  } catch (error) {
    console.error(`[github-content] Failed to list ${dirPath}:`, error);
    return [];
  }
}

/**
 * Parse frontmatter from markdown content.
 * Returns the frontmatter as an object and the body separately.
 */
export function parseFrontmatter(content: string): {
  frontmatter: Record<string, any>;
  body: string;
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const fmBlock = match[1];
  const body = match[2];

  // Simple YAML-like parsing (handles basic key: value pairs)
  const frontmatter: Record<string, any> = {};
  const lines = fmBlock.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value: any = line.slice(colonIndex + 1).trim();

    // Handle quoted strings
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Handle booleans
    else if (value === 'true') value = true;
    else if (value === 'false') value = false;
    // Handle numbers
    else if (/^-?\d+(\.\d+)?$/.test(value)) {
      value = parseFloat(value);
    }

    if (key) {
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body };
}

/**
 * Get a slug from a filename (removes .md extension and normalizes).
 */
export function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}

/**
 * Clear all caches (useful for development/testing).
 */
export function clearContentCache(): void {
  contentCache.clear();
  listCache.clear();
}

/**
 * Convert a URL-safe version (v002) to dotted version (v0.0.2)
 * Handles: v002 -> v0.0.2, v013 -> v0.1.3, v123 -> v1.2.3
 */
function urlVersionToDotted(urlVersion: string): string {
  // Extract digits after 'v'
  const digits = urlVersion.slice(1); // "002", "013", "123"
  if (digits.length === 3) {
    return `v${digits[0]}.${digits[1]}.${digits[2]}`;
  }
  // If already dotted or different format, return as-is
  return urlVersion;
}

/**
 * Derive the GitHub path from a memo slug.
 *
 * Structure: {CompanyName}/outputs/{CompanyName}-{version}/{slug}.md
 *
 * Handles two slug formats:
 * - URL-safe: Aito-v002-draft -> deals/Aito/outputs/Aito-v0.0.2/Aito-v0.0.2-draft.md
 * - Dotted: Class5-Global-v0.0.2-draft -> deals/Class5-Global/outputs/Class5-Global-v0.0.2/Class5-Global-v0.0.2-draft.md
 */
export function deriveGitHubPathFromSlug(slug: string, baseDir: string = 'deals'): string {
  // Pattern 1: URL-safe version without dots (e.g., Aito-v002-draft)
  const urlVersionMatch = slug.match(/^(.+?)-(v\d{3})(-.*)?$/);
  if (urlVersionMatch) {
    const companyName = urlVersionMatch[1]; // e.g., "Aito"
    const urlVersion = urlVersionMatch[2]; // e.g., "v002"
    const suffix = urlVersionMatch[3] || ''; // e.g., "-draft"

    // Convert to dotted version for GitHub path
    const dottedVersion = urlVersionToDotted(urlVersion); // "v0.0.2"
    const githubSlug = `${companyName}-${dottedVersion}${suffix}`; // "Aito-v0.0.2-draft"
    const versionDir = `${companyName}-${dottedVersion}`; // "Aito-v0.0.2"

    return `${baseDir}/${companyName}/outputs/${versionDir}/${githubSlug}.md`;
  }

  // Pattern 2: Dotted version (e.g., Class5-Global-v0.0.2-draft)
  const dottedVersionMatch = slug.match(/^(.+?)-(v\d+\.\d+\.\d+)(-.*)?$/);
  if (dottedVersionMatch) {
    const companyName = dottedVersionMatch[1]; // e.g., "Class5-Global"
    const version = dottedVersionMatch[2]; // e.g., "v0.0.2"
    const suffix = dottedVersionMatch[3] || ''; // e.g., "-draft"

    const versionDir = `${companyName}-${version}`;
    return `${baseDir}/${companyName}/outputs/${versionDir}/${slug}.md`;
  }

  // Fallback: just use the slug directly in baseDir
  return `${baseDir}/${slug}.md`;
}

/**
 * Fetch a memo by its slug.
 *
 * This is a convenience function that:
 * 1. In local mode: searches src/content/markdown-memos/ for matching file
 * 2. In GitHub mode: derives path from slug structure or uses explicit path
 *
 * GitHub repo structure:
 *   deals/{CompanyName}/outputs/{CompanyName}-{version}/{slug}.md
 *
 * @param slug - The memo slug (e.g., "Class5-Global-v0.0.2-draft")
 * @param options - Optional: specify a custom GitHub path or directory
 */
export async function fetchMemoBySlug(
  slug: string,
  options?: {
    /** Full path in GitHub repo (overrides automatic derivation) */
    githubPath?: string;
    /** Base directory for deals (default: "deals") */
    baseDir?: string;
  }
): Promise<{ content: GitHubContentResult; frontmatter: Record<string, any>; body: string } | null> {
  const config = getConfig();
  const { githubPath, baseDir = 'deals' } = options || {};

  let result: GitHubContentResult | null = null;

  if (config.useLocalFallback) {
    // Local mode: search by slug in local files
    result = await fetchLocalContent(slug);
  } else {
    // GitHub mode: derive path from slug or use explicit path
    const path = githubPath || deriveGitHubPathFromSlug(slug, baseDir);
    console.log(`[github-content] Fetching from derived path: ${path}`);
    result = await fetchGitHubContent({ path });
  }

  if (!result) {
    return null;
  }

  const { frontmatter, body } = parseFrontmatter(result.content);

  return {
    content: result,
    frontmatter,
    body,
  };
}
