/**
 * Open Graph Meta Tag Builder
 *
 * Builds OG and Twitter Card meta tags from input.
 * See: context-v/Maintain-an-Elegant-Open-Graph-System.md
 */

import { SITE_SEO, CHAR_LIMITS } from '../config/seo';
import type { ShareMetaInput } from '../config/seo';

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

/**
 * Truncates string to limit, adding ellipsis if needed
 */
function truncate(str: string, limit: number): string {
  if (str.length <= limit) return str;
  return str.slice(0, limit - 1).trim() + '…';
}

/**
 * Ensures URL is absolute. Prepends siteUrl if relative.
 */
export function ensureAbsoluteUrl(url: string, siteUrl?: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const base = siteUrl || SITE_SEO.siteUrl;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base.replace(/\/$/, '')}${path}`;
}

/**
 * Builds Open Graph and Twitter meta tags from input.
 * Falls back to site defaults for any missing values.
 *
 * @param input - Page-specific metadata overrides
 * @param siteUrl - Optional site URL override (usually from Astro.site)
 * @returns Array of meta tag objects ready for rendering
 */
export function buildOgMeta(input: ShareMetaInput = {}, siteUrl?: string): MetaTag[] {
  const baseUrl = siteUrl || SITE_SEO.siteUrl;

  const title = truncate(input.title ?? SITE_SEO.defaultTitle, CHAR_LIMITS.title);
  const description = truncate(input.description ?? SITE_SEO.defaultDescription, CHAR_LIMITS.description);
  const image = ensureAbsoluteUrl(input.image ?? SITE_SEO.defaultImage, baseUrl);
  const imageAlt = input.imageAlt ?? SITE_SEO.defaultImageAlt;
  const url = input.url ? ensureAbsoluteUrl(input.url, baseUrl) : undefined;
  const type = input.type ?? 'website';

  const meta: MetaTag[] = [
    // Basic meta
    { name: 'description', content: description },

    // Open Graph (primary - used by WhatsApp, iMessage, LinkedIn, Facebook)
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: SITE_SEO.siteName },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: imageAlt },
  ];

  // URL (required for proper canonical reference)
  if (url) {
    meta.push({ property: 'og:url', content: url });
  }

  // Locale
  if (SITE_SEO.locale) {
    meta.push({ property: 'og:locale', content: SITE_SEO.locale });
  }

  // Article-specific properties (for memos, blog posts, news)
  if (type === 'article') {
    if (input.publishedTime) {
      meta.push({ property: 'article:published_time', content: input.publishedTime });
    }
    if (input.modifiedTime) {
      meta.push({ property: 'article:modified_time', content: input.modifiedTime });
    }
    if (input.author) {
      meta.push({ property: 'article:author', content: input.author });
    }
    if (input.section) {
      meta.push({ property: 'article:section', content: input.section });
    }
    if (input.tags?.length) {
      input.tags.forEach(tag => {
        meta.push({ property: 'article:tag', content: tag });
      });
    }
  }

  // Twitter Card (explicit is better than relying on OG fallback)
  meta.push({ name: 'twitter:card', content: 'summary_large_image' });
  if (SITE_SEO.twitterHandle) {
    meta.push({ name: 'twitter:site', content: SITE_SEO.twitterHandle });
  }
  meta.push({ name: 'twitter:title', content: title });
  meta.push({ name: 'twitter:description', content: description });
  meta.push({ name: 'twitter:image', content: image });
  meta.push({ name: 'twitter:image:alt', content: imageAlt });

  // Theme color (for Discord embeds, PWA, browser chrome)
  if (SITE_SEO.themeColor) {
    meta.push({ name: 'theme-color', content: SITE_SEO.themeColor });
  }

  return meta;
}

/**
 * Builds canonical URL from pathname
 */
export function buildCanonical(pathname: string, siteUrl?: string): string {
  return ensureAbsoluteUrl(pathname, siteUrl || SITE_SEO.siteUrl);
}
