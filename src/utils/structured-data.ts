/**
 * JSON-LD Structured Data Builders
 *
 * Schema.org structured data for search engines and AI.
 * See: context-v/Maintain-an-Elegant-Open-Graph-System.md
 */

import { SITE_SEO } from '../config/seo';

// Schema Types
export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  publisher?: OrganizationSchema;
}

export interface OrganizationSchema {
  '@context'?: 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  description?: string;
}

export interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article' | 'BlogPosting' | 'NewsArticle';
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: PersonSchema | OrganizationSchema;
  publisher?: OrganizationSchema;
  mainEntityOfPage?: string;
}

export interface PersonSchema {
  '@type': 'Person';
  name: string;
  url?: string;
  jobTitle?: string;
  image?: string;
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }[];
}

export interface InvestmentFundSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  '@id': string;
  name: string;
  url: string;
  description?: string;
  logo?: string;
  foundingDate?: string;
  founders?: PersonSchema[];
  areaServed?: string;
  knowsAbout?: string[];
}

/**
 * Builds WebSite schema (use on homepage)
 */
export function buildWebSiteSchema(siteUrl?: string): WebSiteSchema {
  const url = siteUrl || SITE_SEO.siteUrl;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_SEO.siteName,
    url,
    description: SITE_SEO.defaultDescription,
  };
}

/**
 * Builds Organization schema for Dark Matter
 */
export function buildOrganizationSchema(options: {
  siteUrl?: string;
  logo?: string;
  socialProfiles?: string[];
} = {}): OrganizationSchema {
  const url = options.siteUrl || SITE_SEO.siteUrl;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_SEO.siteName,
    url,
    description: SITE_SEO.defaultDescription,
    ...(options.logo && { logo: options.logo }),
    ...(options.socialProfiles?.length && { sameAs: options.socialProfiles }),
  };
}

/**
 * Builds Investment Fund schema (more specific than Organization)
 */
export function buildInvestmentFundSchema(options: {
  siteUrl?: string;
  logo?: string;
  foundingDate?: string;
  founders?: { name: string; url?: string; jobTitle?: string }[];
  focusAreas?: string[];
} = {}): InvestmentFundSchema {
  const url = options.siteUrl || SITE_SEO.siteUrl;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}#organization`,
    name: SITE_SEO.siteName,
    url,
    description: SITE_SEO.defaultDescription,
    ...(options.logo && { logo: options.logo }),
    ...(options.foundingDate && { foundingDate: options.foundingDate }),
    ...(options.founders?.length && {
      founders: options.founders.map(f => ({
        '@type': 'Person' as const,
        name: f.name,
        ...(f.url && { url: f.url }),
        ...(f.jobTitle && { jobTitle: f.jobTitle }),
      })),
    }),
    areaServed: 'Worldwide',
    ...(options.focusAreas?.length && { knowsAbout: options.focusAreas }),
  };
}

/**
 * Builds Article schema (for memos, blog posts)
 */
export function buildArticleSchema(options: {
  type?: 'Article' | 'BlogPosting' | 'NewsArticle';
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  url: string;
  siteUrl?: string;
}): ArticleSchema {
  const baseUrl = options.siteUrl || SITE_SEO.siteUrl;

  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': options.type ?? 'Article',
    headline: options.headline,
    mainEntityOfPage: options.url,
  };

  if (options.description) schema.description = options.description;
  if (options.image) schema.image = options.image;
  if (options.datePublished) schema.datePublished = options.datePublished;
  if (options.dateModified) schema.dateModified = options.dateModified;

  if (options.authorName) {
    schema.author = {
      '@type': 'Person',
      name: options.authorName,
      ...(options.authorUrl && { url: options.authorUrl }),
    };
  }

  schema.publisher = {
    '@type': 'Organization',
    name: SITE_SEO.siteName,
    url: baseUrl,
  };

  return schema;
}

/**
 * Builds Person schema (for team pages)
 */
export function buildPersonSchema(options: {
  name: string;
  url?: string;
  jobTitle?: string;
  image?: string;
  siteUrl?: string;
}): PersonSchema & { '@context': 'https://schema.org' } {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: options.name,
    ...(options.url && { url: options.url }),
    ...(options.jobTitle && { jobTitle: options.jobTitle }),
    ...(options.image && { image: options.image }),
  };
}

/**
 * Builds Breadcrumb schema
 */
export function buildBreadcrumbSchema(
  items: { name: string; url?: string }[],
  siteUrl?: string
): BreadcrumbSchema {
  const baseUrl = siteUrl || SITE_SEO.siteUrl;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}` }),
    })),
  };
}

/**
 * Serializes schema to JSON-LD script tag content
 */
export function serializeSchema(schema: object): string {
  return JSON.stringify(schema);
}
