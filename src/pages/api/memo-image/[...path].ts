/**
 * Memo Image Proxy API
 *
 * Proxies images from the private GitHub repository for investment memos.
 * This keeps the GitHub PAT secure on the server side.
 *
 * Usage: /api/memo-image/deals/ExoLux/outputs/ExoLux-v0.0.2/deck-screenshots/page-02.png
 *
 * The path after /api/memo-image/ maps directly to the GitHub repo structure.
 */

import type { APIRoute } from 'astro';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';

// Content type mapping for common image formats
const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function getContentType(path: string): string {
  const ext = path.toLowerCase().match(/\.[^.]+$/)?.[0] || '';
  return CONTENT_TYPES[ext] || 'application/octet-stream';
}

export const GET: APIRoute = async ({ params, cookies }) => {
  // Check auth - require portfolio access
  const accessCookie = cookies.get('universal_portfolio_access');
  if (!accessCookie?.value) {
    return new Response('Unauthorized', { status: 401 });
  }

  const imagePath = params.path;

  if (!imagePath) {
    return new Response('Missing image path', { status: 400 });
  }

  // Get GitHub config
  const pat = import.meta.env.GITHUB_CONTENT_PAT;
  const owner = import.meta.env.GITHUB_CONTENT_OWNER || 'lossless-group';
  const repo = import.meta.env.GITHUB_CONTENT_REPO || 'dark-matter-secure-data';
  const branch = import.meta.env.GITHUB_CONTENT_BRANCH || 'main';

  if (!pat) {
    // In local mode without PAT, try to serve from local filesystem
    return await serveLocalImage(imagePath);
  }

  // Construct the GitHub raw URL
  const rawUrl = `${GITHUB_RAW_BASE}/${owner}/${repo}/${branch}/${imagePath}`;

  try {
    const response = await fetch(rawUrl, {
      headers: {
        Authorization: `token ${pat}`,
        Accept: 'application/vnd.github.raw',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`[memo-image] Not found: ${imagePath}`);
        return new Response('Image not found', { status: 404 });
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const imageData = await response.arrayBuffer();
    const contentType = getContentType(imagePath);

    return new Response(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error(`[memo-image] Failed to fetch ${imagePath}:`, error);
    return new Response('Failed to fetch image', { status: 500 });
  }
};

/**
 * Serve image from local filesystem (for development without PAT)
 */
async function serveLocalImage(imagePath: string): Promise<Response> {
  const { readFile } = await import('node:fs/promises');
  const { join } = await import('node:path');

  // Local path to orchestrator deals directory
  const orchestratorDealsPath = '/Users/mpstaton/code/lossless-monorepo/ai-labs/investment-memo-orchestrator/io/dark-matter';
  const fullPath = join(orchestratorDealsPath, imagePath);

  try {
    const imageData = await readFile(fullPath);
    const contentType = getContentType(imagePath);

    return new Response(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.warn(`[memo-image:local] Not found: ${fullPath}`);
    return new Response('Image not found', { status: 404 });
  }
}
