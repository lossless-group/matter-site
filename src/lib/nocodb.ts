/**
 * NocoDB API Client
 *
 * Fetches data from NocoDB at build time or runtime.
 *
 * Required environment variables:
 * - NOCODB_API_KEY: API token from NocoDB Account Settings
 *
 * Configuration:
 * - NOCODB_BASE_URL: NocoDB instance URL (default: https://app.nocodb.com)
 * - NOCODB_BASE_ID: The base (project) ID
 * - NOCODB_TABLE_ID: The table ID to fetch from
 */

const NOCODB_BASE_URL = 'https://app.nocodb.com';
const DEFAULT_BASE_ID = 'pvop0ydhmtugzvv';

// Table IDs for different data types
export const NOCODB_TABLES = {
  organizations: 'myxl4ug85sr1d4p',
  materials: 'mruw5fu5cthdwkl',
} as const;

// ============================================================================
// Types
// ============================================================================

export interface NocoDBConfig {
  apiKey: string;
  baseUrl: string;
  baseId: string;
}

export interface NocoDBRecord<T = Record<string, any>> {
  id: number;
  fields: T;
}

export interface NocoDBResponse<T = Record<string, any>> {
  records: NocoDBRecord<T>[];
  nestedNext?: string | null;
}

export interface NocoDBSortParam {
  field: string;
  direction: 'asc' | 'desc';
}

export interface NocoDBQueryParams {
  /** Filter conditions (NocoDB where syntax) */
  where?: string;
  /** Number of records to fetch (default: 25, max: 1000) */
  limit?: number;
  /** Pagination offset */
  offset?: number;
  /** Sort order (v3 API format) */
  sort?: NocoDBSortParam[];
  /** Specific fields to include */
  fields?: string[];
  /** View ID to use instead of default table view */
  viewId?: string;
}

// Trademarks/logos JSON structure
export interface TrademarksSlugs {
  trademarkDarkMode?: string;
  trademarkLightMode?: string;
  trademarkVibrantMode?: string;
}

// Organization-specific types
export interface OrganizationFields {
  conventionalName: string;
  officialName: string;
  'Entity-Type'?: string | null;
  uuid?: string | null;
  url?: string | null;
  elevatorPitch?: string | null;
  trademarksSlugs?: TrademarksSlugs | string | null;
  Materials?: { id: number; fields: { Title: string } } | null;
  relatedMaterials?: number;
  CreatedAt: string;
  UpdatedAt: string | null;
}

// Simplified portfolio company structure for rendering
export interface PortfolioCompany {
  id: number;
  conventionalName: string;
  officialName: string;
  entityType: string | null;
  logoLightMode?: string;
  logoDarkMode?: string;
  logoVibrantMode?: string;
  /** True if logos are transparent SVGs that need CSS color treatment */
  logoIsTransparent?: boolean;
  urlToPortfolioSite?: string;
  blurbShortTxt?: string;
  category?: 'direct' | 'lp';
}

// ============================================================================
// Cache
// ============================================================================

const recordsCache = new Map<string, { data: NocoDBResponse; expires: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ============================================================================
// Configuration
// ============================================================================

function getConfig(): NocoDBConfig {
  const apiKey = import.meta.env.NOCODB_API_KEY;

  if (!apiKey) {
    console.warn('[nocodb] NOCODB_API_KEY not configured');
  }

  return {
    apiKey: apiKey || '',
    baseUrl: import.meta.env.NOCODB_BASE_URL || NOCODB_BASE_URL,
    baseId: import.meta.env.NOCODB_BASE_ID || DEFAULT_BASE_ID,
  };
}

/**
 * Check if NocoDB is properly configured
 */
export function isNocoDBConfigured(): boolean {
  const config = getConfig();
  return Boolean(config.apiKey);
}

// ============================================================================
// Core API Functions
// ============================================================================

/**
 * Fetch records from a NocoDB table
 */
export async function fetchRecords<T = Record<string, any>>(
  tableId: string,
  params: NocoDBQueryParams = {}
): Promise<NocoDBResponse<T>> {
  const config = getConfig();

  if (!config.apiKey) {
    console.error('[nocodb] API key not configured');
    return { records: [], nestedNext: null };
  }

  // Build cache key
  const cacheKey = `${tableId}:${JSON.stringify(params)}`;
  const cached = recordsCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    console.log(`[nocodb] Cache hit for ${tableId}`);
    return cached.data as NocoDBResponse<T>;
  }

  // Build URL with query params
  const url = new URL(
    `/api/v3/data/${config.baseId}/${tableId}/records`,
    config.baseUrl
  );

  if (params.limit) url.searchParams.set('limit', String(params.limit));
  if (params.offset) url.searchParams.set('offset', String(params.offset));
  if (params.where) url.searchParams.set('where', params.where);
  if (params.sort && params.sort.length > 0) {
    // v3 API requires JSON array format for sort
    url.searchParams.set('sort', JSON.stringify(params.sort));
  }
  if (params.fields) url.searchParams.set('fields', params.fields.join(','));

  console.log(`[nocodb] Fetching from: ${url.pathname}`);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'xc-token': config.apiKey,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[nocodb] API error: ${response.status}`, errorBody);
      throw new Error(`NocoDB API error: ${response.status} ${response.statusText}`);
    }

    const data: NocoDBResponse<T> = await response.json();

    // Cache the result
    recordsCache.set(cacheKey, {
      data,
      expires: Date.now() + CACHE_TTL_MS,
    });

    console.log(`[nocodb] Fetched ${data.records.length} records from ${tableId}`);
    return data;
  } catch (error) {
    console.error(`[nocodb] Failed to fetch records:`, error);
    return { records: [], nestedNext: null };
  }
}

/**
 * Fetch all records from a table (handles pagination)
 */
export async function fetchAllRecords<T = Record<string, any>>(
  tableId: string,
  params: Omit<NocoDBQueryParams, 'offset'> = {}
): Promise<NocoDBRecord<T>[]> {
  const allRecords: NocoDBRecord<T>[] = [];
  const limit = params.limit || 100;
  let offset = 0;

  while (true) {
    const response = await fetchRecords<T>(tableId, {
      ...params,
      limit,
      offset,
    });

    allRecords.push(...response.records);

    // Check if there are more records
    if (response.records.length < limit) {
      break;
    }

    offset += limit;
  }

  return allRecords;
}

// ============================================================================
// Portfolio-specific Functions
// ============================================================================

/**
 * Fetch all organizations (portfolio companies)
 */
export async function fetchOrganizations(): Promise<NocoDBRecord<OrganizationFields>[]> {
  return fetchAllRecords<OrganizationFields>(NOCODB_TABLES.organizations, {
    sort: [{ field: 'conventionalName', direction: 'asc' }],
  });
}

// Base path for portfolio logo assets
const PORTFOLIO_LOGOS_BASE = '/portfolio/logos';

/**
 * Normalize a URL to ensure it has a protocol prefix
 */
function normalizeUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  // Already has protocol
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  // Add https:// prefix
  return `https://${trimmed}`;
}

/**
 * Parse trademarksSlugs JSON field and return logo paths
 */
function parseTrademarksSlugs(
  trademarksSlugs: TrademarksSlugs | string | null | undefined
): { lightMode?: string; darkMode?: string; vibrantMode?: string } {
  if (!trademarksSlugs) {
    return {};
  }

  // Parse if it's a string (JSON from NocoDB)
  let parsed: TrademarksSlugs;
  if (typeof trademarksSlugs === 'string') {
    try {
      parsed = JSON.parse(trademarksSlugs);
    } catch {
      console.warn('[nocodb] Failed to parse trademarksSlugs JSON:', trademarksSlugs);
      return {};
    }
  } else {
    parsed = trademarksSlugs;
  }

  return {
    lightMode: parsed.trademarkLightMode
      ? `${PORTFOLIO_LOGOS_BASE}/${parsed.trademarkLightMode}`
      : undefined,
    darkMode: parsed.trademarkDarkMode
      ? `${PORTFOLIO_LOGOS_BASE}/${parsed.trademarkDarkMode}`
      : undefined,
    vibrantMode: parsed.trademarkVibrantMode
      ? `${PORTFOLIO_LOGOS_BASE}/${parsed.trademarkVibrantMode}`
      : undefined,
  };
}

/**
 * Transform NocoDB organization records to portfolio company format
 * Maps current NocoDB fields to the portfolio page structure
 */
export function transformToPortfolioCompanies(
  records: NocoDBRecord<OrganizationFields>[]
): PortfolioCompany[] {
  return records.map((record) => {
    const { fields } = record;

    // Determine category based on Entity-Type
    // LP = fund investment, C-Corp/LLC = direct investment
    const entityType = fields['Entity-Type'] || null;
    let category: 'direct' | 'lp' = 'direct';
    if (entityType === 'LP') {
      category = 'lp';
    }

    // Parse trademark/logo paths from JSON field
    const trademarks = parseTrademarksSlugs(fields.trademarksSlugs);

    // Detect if logos are transparent (need CSS color treatment)
    const logoIsTransparent = Boolean(
      trademarks.lightMode?.includes('--Transparent') ||
      trademarks.darkMode?.includes('--Transparent')
    );

    return {
      id: record.id,
      conventionalName: fields.conventionalName,
      officialName: fields.officialName,
      entityType,
      category,
      // Use trademarks from NocoDB, fallback to placeholders
      logoLightMode: trademarks.lightMode || '/portfolio/logos/placeholder-light.svg',
      logoDarkMode: trademarks.darkMode || '/portfolio/logos/placeholder-dark.svg',
      logoVibrantMode: trademarks.vibrantMode || trademarks.darkMode || '/portfolio/logos/placeholder-dark.svg',
      logoIsTransparent,
      // Mapped from NocoDB fields
      urlToPortfolioSite: normalizeUrl(fields.url),
      blurbShortTxt: fields.elevatorPitch || undefined,
    };
  });
}

/**
 * Fetch and transform portfolio companies ready for rendering
 */
export async function getPortfolioCompanies(): Promise<PortfolioCompany[]> {
  const records = await fetchOrganizations();
  return transformToPortfolioCompanies(records);
}

// ============================================================================
// Cache Management
// ============================================================================

/**
 * Clear all caches (useful for development/testing)
 */
export function clearNocoDBCache(): void {
  recordsCache.clear();
  console.log('[nocodb] Cache cleared');
}

/**
 * Get cache stats for debugging
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: recordsCache.size,
    keys: Array.from(recordsCache.keys()),
  };
}
