/**
 * Date Formatting Utilities
 *
 * String-in, string-out date transformations.
 * Dates are stored as ISO (YYYY-MM-DD) and displayed in preferred formats.
 *
 * @example
 * import { formatDate, formatCitationDate } from '@lib/dates';
 *
 * formatDate('2025-12-26', 'citation')  // "2025, Dec 26"
 * formatCitationDate('2025-12-26')      // "2025, Dec 26"
 */

export {
  // Core formatting
  formatDate,
  formatCitationDate,
  formatPublishedDate,

  // Parsing & validation
  parseDate,
  isValidDate,

  // Conversion
  toISODateString,
  getTodayISO,

  // Sorting
  compareDates,
  sortByDate,

  // Types
  type DateFormat,
  type DateFormatPreset,
  type CustomDateFormat,
  type DateFormatOptions,

  // Constants
  DEFAULT_FORMAT,
  MONTHS_FULL,
  MONTHS_SHORT,

  // Default export
  default as dateUtils
} from './convertRawDatesToPreferredFormats';
