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
    // Use local fallback for content fetching when PAT is not configured
    useLocalFallback: !pat || pat === '',
    // Force local discovery for memo version detection (useful for development)
    // Set MEMO_DISCOVERY_LOCAL=true in .env to use local orchestrator paths
    forceLocalDiscovery: import.meta.env.MEMO_DISCOVERY_LOCAL === 'true',
  };
}

/**
 * Check if we're in local mode (no PAT configured, or MEMO_DISCOVERY_LOCAL=true)
 */
export function isLocalDemoMode(): boolean {
  const config = getConfig();
  return config.useLocalFallback || config.forceLocalDiscovery;
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

// ============================================================================
// LATEST VERSION DISCOVERY
// ============================================================================

/**
 * Parse a semver-style version string (e.g., "v0.0.2" or "0.0.2")
 * Returns [major, minor, patch] as numbers, or null if invalid
 */
export function parseVersion(version: string): [number, number, number] | null {
  const match = version.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
}

/**
 * Compare two version tuples. Returns:
 *  -1 if a < b
 *   0 if a === b
 *   1 if a > b
 */
export function compareVersions(
  a: [number, number, number],
  b: [number, number, number]
): -1 | 0 | 1 {
  for (let i = 0; i < 3; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return 0;
}

/**
 * Extract company name and version from a directory/file name
 * E.g., "MitrixBio-v0.0.2" -> { company: "MitrixBio", version: "v0.0.2" }
 */
function parseVersionedName(name: string): { company: string; version: string } | null {
  const match = name.match(/^(.+?)-(v\d+\.\d+\.\d+)(?:-.*)?$/);
  if (!match) return null;
  return { company: match[1], version: match[2] };
}

/**
 * List version directories in a company's outputs folder (GitHub mode)
 */
async function listCompanyVersionsGitHub(
  companyName: string,
  baseDir: string = 'deals'
): Promise<Array<{ version: string; path: string }>> {
  const config = getConfig();
  const outputsPath = `${baseDir}/${companyName}/outputs`;

  const apiUrl = `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}/contents/${outputsPath}?ref=${config.branch}`;

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
        console.warn(`[github-content] No outputs directory for: ${companyName}`);
        return [];
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    // Filter to directories that match the versioned pattern
    const versions: Array<{ version: string; path: string }> = [];

    for (const item of data) {
      if (item.type !== 'dir') continue;

      const parsed = parseVersionedName(item.name);
      if (parsed && parsed.company === companyName) {
        versions.push({
          version: parsed.version,
          path: item.path,
        });
      }
    }

    return versions;
  } catch (error) {
    console.error(`[github-content] Failed to list versions for ${companyName}:`, error);
    return [];
  }
}

/**
 * List version directories from local orchestrator deals folder
 */
async function listCompanyVersionsLocal(
  companyName: string
): Promise<Array<{ version: string; path: string }>> {
  const { readdir, stat } = await import('node:fs/promises');
  const { join } = await import('node:path');

  // Path to the orchestrator deals directory
  const orchestratorDealsPath = '/Users/mpstaton/code/lossless-monorepo/ai-labs/investment-memo-orchestrator/io/dark-matter/deals';
  const outputsPath = join(orchestratorDealsPath, companyName, 'outputs');

  try {
    const entries = await readdir(outputsPath);
    const versions: Array<{ version: string; path: string }> = [];

    for (const entry of entries) {
      const entryPath = join(outputsPath, entry);
      const entryStat = await stat(entryPath);

      if (!entryStat.isDirectory()) continue;

      const parsed = parseVersionedName(entry);
      if (parsed && parsed.company === companyName) {
        versions.push({
          version: parsed.version,
          path: entryPath,
        });
      }
    }

    return versions;
  } catch (error) {
    // Directory doesn't exist or can't be read
    console.warn(`[github-content:local] No outputs directory for: ${companyName}`);
    return [];
  }
}

/**
 * Find the draft memo file in a version directory (GitHub mode)
 *
 * Handles multiple naming conventions:
 * 1. {CompanyName}-{version}-draft.md (standard)
 * 2. 6-{CompanyName}-{version}.md (newer pipeline format)
 */
async function findDraftMemoGitHub(
  versionDirPath: string,
  companyName: string,
  version: string
): Promise<string | null> {
  const config = getConfig();
  const apiUrl = `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}/contents/${versionDirPath}?ref=${config.branch}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${config.pat}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return null;
    }

    const files = data.filter((item: any) => item.type === 'file' && item.name.endsWith('.md'));

    // Pattern 1: {Company}-{version}-draft.md (highest priority)
    const draftPattern = new RegExp(`^${companyName}-${version}-draft\\.md$`, 'i');
    for (const item of files) {
      if (draftPattern.test(item.name)) {
        return item.name.replace('.md', '');
      }
    }

    // Pattern 2: 6-{Company}-{version}.md or similar numbered prefix
    const numberedPattern = new RegExp(`^\\d+-${companyName}-${version}\\.md$`, 'i');
    for (const item of files) {
      if (numberedPattern.test(item.name)) {
        return item.name.replace('.md', '');
      }
    }

    // Pattern 3: {Company}-{version}.md (without -draft suffix)
    const plainPattern = new RegExp(`^${companyName}-${version}\\.md$`, 'i');
    for (const item of files) {
      if (plainPattern.test(item.name)) {
        return item.name.replace('.md', '');
      }
    }

    // Fallback: any .md file that contains the company name and version
    const loosePattern = new RegExp(`${companyName}.*${version}`, 'i');
    for (const item of files) {
      if (loosePattern.test(item.name)) {
        return item.name.replace('.md', '');
      }
    }

    return null;
  } catch (error) {
    console.error(`[github-content] Failed to find draft in ${versionDirPath}:`, error);
    return null;
  }
}

/**
 * Find the draft memo file in a local version directory
 *
 * Handles multiple naming conventions:
 * 1. {CompanyName}-{version}-draft.md (standard)
 * 2. 6-{CompanyName}-{version}.md (newer pipeline format)
 */
async function findDraftMemoLocal(
  versionDirPath: string,
  companyName: string,
  version: string
): Promise<string | null> {
  const { readdir } = await import('node:fs/promises');

  try {
    const files = await readdir(versionDirPath);

    // Pattern 1: {Company}-{version}-draft.md (highest priority)
    const draftPattern = new RegExp(`^${companyName}-${version}-draft\\.md$`, 'i');
    for (const file of files) {
      if (draftPattern.test(file)) {
        return file.replace('.md', '');
      }
    }

    // Pattern 2: 6-{Company}-{version}.md or similar numbered prefix
    const numberedPattern = new RegExp(`^\\d+-${companyName}-${version}\\.md$`, 'i');
    for (const file of files) {
      if (numberedPattern.test(file)) {
        return file.replace('.md', '');
      }
    }

    // Pattern 3: {Company}-{version}.md (without -draft suffix)
    const plainPattern = new RegExp(`^${companyName}-${version}\\.md$`, 'i');
    for (const file of files) {
      if (plainPattern.test(file)) {
        return file.replace('.md', '');
      }
    }

    // Fallback: any .md file that contains the company name and version
    const loosePattern = new RegExp(`${companyName}.*${version}`, 'i');
    for (const file of files) {
      if (file.endsWith('.md') && loosePattern.test(file)) {
        return file.replace('.md', '');
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

// Cache for latest memo slugs to reduce API calls
const latestMemoCache = new Map<string, { slug: string | null; expires: number }>();
const LATEST_MEMO_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Get the latest memo slug for a company.
 *
 * This function:
 * 1. Lists the company's outputs directory
 * 2. Finds all version directories (e.g., MitrixBio-v0.0.1, MitrixBio-v0.0.2)
 * 3. Sorts by version and picks the highest
 * 4. Finds the draft memo file in that directory
 * 5. Returns the slug (e.g., "MitrixBio-v0.0.2-draft")
 *
 * @param companyName - The company name (e.g., "MitrixBio")
 * @param options - Optional: baseDir for deals folder
 * @returns The latest memo slug, or null if no memo exists
 */
export async function getLatestMemoSlug(
  companyName: string,
  options?: { baseDir?: string }
): Promise<string | null> {
  const { baseDir = 'deals' } = options || {};
  const config = getConfig();

  // Check cache first
  const cacheKey = `latest:${companyName}`;
  const cached = latestMemoCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    console.log(`[github-content] Cache hit for latest memo: ${companyName} -> ${cached.slug}`);
    return cached.slug;
  }

  // Use local discovery if: no PAT, or forced via env var
  const useLocal = config.useLocalFallback || config.forceLocalDiscovery;
  const mode = useLocal ? 'LOCAL' : 'GITHUB';
  console.log(`[github-content] Discovering latest memo for: ${companyName} (${mode} mode)`);

  // Get list of version directories
  let versions: Array<{ version: string; path: string }>;

  if (useLocal) {
    versions = await listCompanyVersionsLocal(companyName);
  } else {
    versions = await listCompanyVersionsGitHub(companyName, baseDir);
  }

  if (versions.length === 0) {
    console.log(`[github-content] No versions found for: ${companyName}`);
    latestMemoCache.set(cacheKey, { slug: null, expires: Date.now() + LATEST_MEMO_CACHE_TTL_MS });
    return null;
  }

  // Parse and sort versions
  const parsedVersions = versions
    .map(v => ({
      ...v,
      parsed: parseVersion(v.version),
    }))
    .filter(v => v.parsed !== null) as Array<{
      version: string;
      path: string;
      parsed: [number, number, number];
    }>;

  if (parsedVersions.length === 0) {
    console.log(`[github-content] No valid versions found for: ${companyName}`);
    latestMemoCache.set(cacheKey, { slug: null, expires: Date.now() + LATEST_MEMO_CACHE_TTL_MS });
    return null;
  }

  // Sort descending by version
  parsedVersions.sort((a, b) => compareVersions(b.parsed, a.parsed));

  const latest = parsedVersions[0];
  console.log(`[github-content] Latest version for ${companyName}: ${latest.version}`);

  // Find the draft memo in the latest version directory
  let slug: string | null;

  if (useLocal) {
    slug = await findDraftMemoLocal(latest.path, companyName, latest.version);
  } else {
    slug = await findDraftMemoGitHub(latest.path, companyName, latest.version);
  }

  console.log(`[github-content] Latest memo slug for ${companyName}: ${slug}`);

  // Cache the result
  latestMemoCache.set(cacheKey, { slug, expires: Date.now() + LATEST_MEMO_CACHE_TTL_MS });

  return slug;
}

/**
 * Batch resolve latest memo slugs for multiple companies.
 * More efficient than calling getLatestMemoSlug for each company individually.
 *
 * @param companyNames - Array of company names
 * @returns Map of companyName -> slug (or null if no memo)
 */
export async function resolveLatestMemos(
  companyNames: string[]
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();

  // Process in parallel for efficiency
  const promises = companyNames.map(async (name) => {
    const slug = await getLatestMemoSlug(name);
    results.set(name, slug);
  });

  await Promise.all(promises);

  return results;
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
 * Handles multiple slug formats:
 * - URL-safe: Aito-v002-draft -> deals/Aito/outputs/Aito-v0.0.2/Aito-v0.0.2-draft.md
 * - Dotted: Class5-Global-v0.0.2-draft -> deals/Class5-Global/outputs/Class5-Global-v0.0.2/Class5-Global-v0.0.2-draft.md
 * - Numbered: 6-RavenGraph-v0.0.3 -> deals/RavenGraph/outputs/RavenGraph-v0.0.3/6-RavenGraph-v0.0.3.md
 */
export function deriveGitHubPathFromSlug(slug: string, baseDir: string = 'deals'): string {
  // Pattern 1: Numbered prefix format (e.g., 6-RavenGraph-v0.0.3)
  const numberedMatch = slug.match(/^\d+-(.+?)-(v\d+\.\d+\.\d+)$/);
  if (numberedMatch) {
    const companyName = numberedMatch[1]; // e.g., "RavenGraph"
    const version = numberedMatch[2]; // e.g., "v0.0.3"
    const versionDir = `${companyName}-${version}`;
    return `${baseDir}/${companyName}/outputs/${versionDir}/${slug}.md`;
  }

  // Pattern 2: URL-safe version without dots (e.g., Aito-v002-draft)
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

  // Pattern 3: Dotted version (e.g., Class5-Global-v0.0.2-draft)
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
 * 1. In local mode: reads from the orchestrator deals directory
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

  // Use local mode if: no PAT, or forced via MEMO_DISCOVERY_LOCAL
  const useLocal = config.useLocalFallback || config.forceLocalDiscovery;

  let result: GitHubContentResult | null = null;

  if (useLocal) {
    // Local mode: read from orchestrator deals directory
    result = await fetchLocalMemoContent(slug, baseDir);
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

/**
 * Fetch memo content from the local orchestrator deals directory.
 * Uses the same path derivation as GitHub mode.
 */
async function fetchLocalMemoContent(
  slug: string,
  baseDir: string = 'deals'
): Promise<GitHubContentResult | null> {
  const { readFile } = await import('node:fs/promises');
  const { join } = await import('node:path');

  // Path to the orchestrator deals directory
  const orchestratorDealsPath = '/Users/mpstaton/code/lossless-monorepo/ai-labs/investment-memo-orchestrator/io/dark-matter/deals';

  // Derive the file path from the slug using the same logic as GitHub
  const relativePath = deriveGitHubPathFromSlug(slug, '');
  const fullPath = join(orchestratorDealsPath, relativePath);

  console.log(`[github-content:local] Fetching from local path: ${fullPath}`);

  try {
    const content = await readFile(fullPath, 'utf-8');
    return {
      content,
      sha: 'local',
      lastModified: undefined,
    };
  } catch (error) {
    console.error(`[github-content:local] Failed to read memo: ${fullPath}`, error);
    return null;
  }
}
