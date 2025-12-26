/**
 * Date Format Conversion Utilities
 *
 * Converts between ISO storage format (YYYY-MM-DD) and various display formats.
 * Use ISO format for storage/data, display formats for user-facing content.
 *
 * Usage:
 *   import { formatDate, DateFormat } from '@lib/dates/convertRawDatesToPreferredFormats';
 *
 *   // Basic usage with preset format
 *   formatDate('2025-12-26', 'citation');  // "2025, Dec 26"
 *   formatDate('2025-12-26', 'full');      // "December 26, 2025"
 *
 *   // With custom format
 *   formatDate('2025-12-26', { pattern: 'MMM YYYY' });  // "Dec 2025"
 */

// =============================================================================
// TYPES
// =============================================================================

/** Preset format identifiers */
export type DateFormatPreset =
  | 'iso'           // 2025-12-26 (storage format)
  | 'citation'      // 2025, Dec 26 (for citations/references)
  | 'full'          // December 26, 2025
  | 'short'         // Dec 26, 2025
  | 'monthYear'     // December 2025
  | 'monthYearShort'// Dec 2025
  | 'yearOnly'      // 2025
  | 'us'            // 12/26/2025
  | 'eu'            // 26/12/2025
  | 'relative';     // "2 days ago", "in 3 months"

/** Custom format configuration */
export interface CustomDateFormat {
  pattern: string;
}

/** Format can be a preset string or custom config */
export type DateFormat = DateFormatPreset | CustomDateFormat;

/** Options for date formatting */
export interface DateFormatOptions {
  /** Fallback text when date is invalid or missing */
  fallback?: string;
  /** Locale for formatting (default: 'en-US') */
  locale?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Month names for manual formatting */
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/** Default format for the site */
export const DEFAULT_FORMAT: DateFormatPreset = 'citation';

/** Default options */
const DEFAULT_OPTIONS: DateFormatOptions = {
  fallback: '',
  locale: 'en-US'
};

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Parse a date string into a Date object.
 * Handles ISO format (YYYY-MM-DD) and other common formats.
 */
export function parseDate(dateStr: string | Date | undefined | null): Date | null {
  if (!dateStr) return null;

  if (dateStr instanceof Date) {
    return isNaN(dateStr.getTime()) ? null : dateStr;
  }

  // Try ISO format first (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    // Parse as local date (not UTC) to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }

  // Try ISO with time (YYYY-MM-DDTHH:mm:ss)
  if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  // Try other common formats
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Format a date according to a preset or custom format.
 *
 * @param dateInput - ISO date string (YYYY-MM-DD), Date object, or undefined
 * @param format - Preset format name or custom format config
 * @param options - Additional formatting options
 * @returns Formatted date string or fallback
 *
 * @example
 * formatDate('2025-12-26', 'citation')     // "2025, Dec 26"
 * formatDate('2025-12-26', 'full')         // "December 26, 2025"
 * formatDate('2025-12-26', 'short')        // "Dec 26, 2025"
 * formatDate('2025-12-26', 'monthYear')    // "December 2025"
 * formatDate('2025-12-26', 'iso')          // "2025-12-26"
 * formatDate(undefined, 'citation', { fallback: 'N/A' })  // "N/A"
 */
export function formatDate(
  dateInput: string | Date | undefined | null,
  format: DateFormat = DEFAULT_FORMAT,
  options: DateFormatOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const date = parseDate(dateInput);

  if (!date) {
    return opts.fallback ?? '';
  }

  // Handle preset formats
  if (typeof format === 'string') {
    return formatWithPreset(date, format, opts);
  }

  // Handle custom format
  return formatWithPattern(date, format.pattern);
}

/**
 * Format using a preset format identifier
 */
function formatWithPreset(
  date: Date,
  preset: DateFormatPreset,
  options: DateFormatOptions
): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  switch (preset) {
    case 'iso':
      return toISODateString(date);

    case 'citation':
      // 2025, Dec 26
      return `${year}, ${MONTHS_SHORT[month]} ${day}`;

    case 'full':
      // December 26, 2025
      return `${MONTHS_FULL[month]} ${day}, ${year}`;

    case 'short':
      // Dec 26, 2025
      return `${MONTHS_SHORT[month]} ${day}, ${year}`;

    case 'monthYear':
      // December 2025
      return `${MONTHS_FULL[month]} ${year}`;

    case 'monthYearShort':
      // Dec 2025
      return `${MONTHS_SHORT[month]} ${year}`;

    case 'yearOnly':
      return String(year);

    case 'us':
      // 12/26/2025
      return `${month + 1}/${day}/${year}`;

    case 'eu':
      // 26/12/2025
      return `${day}/${month + 1}/${year}`;

    case 'relative':
      return formatRelative(date, options.locale);

    default:
      return toISODateString(date);
  }
}

/**
 * Format using a custom pattern string.
 *
 * Supported tokens:
 * - YYYY: 4-digit year (2025)
 * - YY: 2-digit year (25)
 * - MMMM: Full month name (December)
 * - MMM: Short month name (Dec)
 * - MM: 2-digit month (12)
 * - M: Month number (12)
 * - DD: 2-digit day (26)
 * - D: Day number (26)
 */
function formatWithPattern(date: Date, pattern: string): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return pattern
    .replace(/YYYY/g, String(year))
    .replace(/YY/g, String(year).slice(-2))
    .replace(/MMMM/g, MONTHS_FULL[month])
    .replace(/MMM/g, MONTHS_SHORT[month])
    .replace(/MM/g, String(month + 1).padStart(2, '0'))
    .replace(/M/g, String(month + 1))
    .replace(/DD/g, String(day).padStart(2, '0'))
    .replace(/D/g, String(day));
}

/**
 * Format a date as relative time (e.g., "2 days ago", "in 3 months")
 */
function formatRelative(date: Date, locale: string = 'en-US'): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // Use Intl.RelativeTimeFormat if available
  if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (Math.abs(diffDays) < 1) {
      return rtf.format(0, 'day'); // "today"
    } else if (Math.abs(diffDays) < 7) {
      return rtf.format(diffDays, 'day');
    } else if (Math.abs(diffDays) < 30) {
      return rtf.format(Math.round(diffDays / 7), 'week');
    } else if (Math.abs(diffDays) < 365) {
      return rtf.format(Math.round(diffDays / 30), 'month');
    } else {
      return rtf.format(Math.round(diffDays / 365), 'year');
    }
  }

  // Fallback for environments without Intl.RelativeTimeFormat
  const absdays = Math.abs(diffDays);
  const suffix = diffDays < 0 ? 'ago' : 'from now';

  if (absdays < 1) return 'today';
  if (absdays === 1) return diffDays < 0 ? 'yesterday' : 'tomorrow';
  if (absdays < 7) return `${absdays} days ${suffix}`;
  if (absdays < 30) return `${Math.round(absdays / 7)} weeks ${suffix}`;
  if (absdays < 365) return `${Math.round(absdays / 30)} months ${suffix}`;
  return `${Math.round(absdays / 365)} years ${suffix}`;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Convert a Date to ISO date string (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as ISO string
 */
export function getTodayISO(): string {
  return toISODateString(new Date());
}

/**
 * Check if a date string is valid
 */
export function isValidDate(dateStr: string | undefined | null): boolean {
  return parseDate(dateStr) !== null;
}

/**
 * Compare two dates (for sorting)
 * Returns negative if a < b, positive if a > b, 0 if equal
 */
export function compareDates(
  a: string | Date | undefined | null,
  b: string | Date | undefined | null
): number {
  const dateA = parseDate(a);
  const dateB = parseDate(b);

  if (!dateA && !dateB) return 0;
  if (!dateA) return 1;  // nulls sort to end
  if (!dateB) return -1;

  return dateA.getTime() - dateB.getTime();
}

/**
 * Sort an array by date field (newest first by default)
 */
export function sortByDate<T>(
  items: T[],
  getDate: (item: T) => string | Date | undefined | null,
  ascending: boolean = false
): T[] {
  return [...items].sort((a, b) => {
    const comparison = compareDates(getDate(a), getDate(b));
    return ascending ? comparison : -comparison;
  });
}

// =============================================================================
// CITATION-SPECIFIC HELPERS
// =============================================================================

/**
 * Format a date for citation display (the site's preferred format)
 * Convenience wrapper for formatDate with 'citation' preset.
 *
 * @example
 * formatCitationDate('2025-12-26')  // "2025, Dec 26"
 * formatCitationDate(undefined)     // ""
 */
export function formatCitationDate(
  dateInput: string | Date | undefined | null,
  fallback: string = ''
): string {
  return formatDate(dateInput, 'citation', { fallback });
}

/**
 * Format a published date for display, with optional "Published: " prefix
 */
export function formatPublishedDate(
  dateInput: string | Date | undefined | null,
  options: { prefix?: boolean; format?: DateFormat } = {}
): string {
  const { prefix = false, format = 'citation' } = options;
  const formatted = formatDate(dateInput, format);

  if (!formatted) return '';
  return prefix ? `Published: ${formatted}` : formatted;
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  formatDate,
  formatCitationDate,
  formatPublishedDate,
  parseDate,
  toISODateString,
  getTodayISO,
  isValidDate,
  compareDates,
  sortByDate,
  DEFAULT_FORMAT,
  MONTHS_FULL,
  MONTHS_SHORT
};
