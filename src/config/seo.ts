/**
 * SEO Configuration for Dark Matter
 *
 * Centralized defaults for Open Graph, Twitter Cards, and structured data.
 * See: context-v/Maintain-an-Elegant-Open-Graph-System.md
 */

export interface SiteSEO {
  siteName: string;
  siteUrl: string;
  twitterHandle?: string;
  linkedInCompany?: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  defaultImageAlt: string;
  themeColor: string;
  locale: string;
}

export interface ShareMetaInput {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'product' | string;
  // Article-specific (for blog posts, memos, news)
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

// Character limits for platform safety
export const CHAR_LIMITS = {
  title: 60,
  description: 155,
  siteName: 30,
} as const;

// Collection-specific defaults
export const COLLECTION_DEFAULTS = {
  memos: {
    image: '/share-banners/shareBanner__Dark-Matter-Bio_Longevity-Fund-II.webp',
    type: 'article' as const,
  },
  team: {
    image: '/share-banners/shareBanner__Dark-Matter-Bio_Longevity-Fund-II.webp',
    type: 'profile' as const,
  },
  slides: {
    image: '/share-banners/shareBanner__Dark-Matter-Bio_Market-Maps.webp',
    type: 'website' as const,
  },
  pipeline: {
    image: '/share-banners/shareBanner__Dark-Matter-Bio_Longevity-Fund-II.webp',
    type: 'website' as const,
  },
} as const;

/**
 * Site-wide SEO defaults
 *
 * siteUrl is set from Astro.site at runtime (configured in astro.config.mjs)
 * This fallback is used when Astro.site is not available.
 */
export const SITE_SEO: SiteSEO = {
  siteName: 'Dark Matter',
  siteUrl: import.meta.env.SITE || 'https://matter-site.vercel.app',
  defaultTitle: 'Dark Matter | Bio Longevity Fund',
  defaultDescription: 'Investing in the science of longevity. Dark Matter backs breakthrough companies extending human healthspan.',
  defaultImage: '/share-banners/shareBanner__Dark-Matter-Bio_Longevity-Fund-II.webp',
  defaultImageAlt: 'Dark Matter Bio Longevity Fund - Investing in the science of longevity',
  twitterHandle: undefined, // Add when available: '@darkmatterbio'
  linkedInCompany: undefined, // Add when available
  themeColor: '#0f0f23', // Dark Matter brand dark
  locale: 'en_US',
};
