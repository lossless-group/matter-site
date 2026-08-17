// Resolve the display / sort date for a changelog entry.
//
// WHY THIS EXISTS
// ---------------
// The tree-wide frontmatter standard renames the legacy `date:` key to the
// editorial pair `date_authored_initial_draft:` / `date_authored_current_draft:`.
// This site could not take that rename directly:
//
//   1. `date` was a *required* z.coerce.date() on the changelog collection, so
//      dropping the key failed content validation and the build outright.
//   2. `src/pages/changelog/index.astro` filters on `entry.data.date` being
//      truthy — so an entry that survived validation without the key would
//      silently vanish from the index rather than error. That failure is worse
//      than a broken build, because nothing announces it.
//
// Every date spelling is now optional in the schema and every renderer resolves
// through this function, so an entry validates and renders whether it carries
// the legacy key, the editorial keys, both, or neither.
//
// PRECEDENCE, AND WHY LEGACY WINS
// -------------------------------
// `date` is checked FIRST, ahead of the newer editorial keys. That is not a
// preference for the old standard:
//
//   - It makes the migration provably zero-diff. Entries carry both keys with
//     identical values during the transition, so no rendered date can move.
//   - Curated `date` values were authored by hand. Editorial keys added by a
//     bulk sweep may be `stat`-derived, and filesystem birthtimes in this tree
//     are known to lie — whole directories report the date of a bulk copy
//     rather than of authorship. When the two disagree, trust the hand-authored
//     one.
//
// Once `date` is dropped from a file the editorial keys take over with no code
// change. That is what makes dropping the key a safe, file-at-a-time operation
// instead of a flag day.

/** Frontmatter is `.passthrough()`d, so callers hold a loose bag of keys. */
export type EntryData = Record<string, any>;

/** Accepted date keys, in precedence order. First one that parses wins. */
const DATE_KEYS = [
  'date',                          // legacy; canonical here until dropped per-file
  'date_authored_initial_draft',   // editorial standard — the ship date
  'date_created',
  'date_posted',
  'date_authored_current_draft',   // a revision date, so below the initial draft
  'date_modified',
  'date_scheduled',
] as const;

function toDate(value: unknown): Date | null {
  if (value == null || value === '') return null;
  const d = value instanceof Date ? value : new Date(value as any);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Last-resort date: entry ids in this collection are `YYYY-MM-DD_NN`, so the
 * filename itself carries the ship date. Per the frontmatter spec a date in the
 * filename outranks `stat`, so an entry with no date frontmatter at all still
 * sorts and renders correctly instead of falling to the epoch.
 */
export function dateFromId(id: string | undefined): Date | null {
  if (!id) return null;
  const m = id.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? toDate(`${m[1]}-${m[2]}-${m[3]}`) : null;
}

/**
 * The entry's date, resolved through the full fallback chain. Returns null only
 * when nothing parses and the id carries no date — render the date line
 * conditionally rather than printing a bogus one.
 */
export function resolveEntryDate(data: EntryData, id?: string): Date | null {
  for (const key of DATE_KEYS) {
    const d = toDate(data?.[key]);
    if (d) return d;
  }
  return dateFromId(id);
}

/**
 * Sort key. Undated entries return 0 so they sink to the bottom of a
 * newest-first sort rather than throwing on `.getTime()` of undefined.
 */
export function entryDateMs(data: EntryData, id?: string): number {
  return resolveEntryDate(data, id)?.getTime() ?? 0;
}

/** True when the entry has any resolvable date — replaces `entry.data.date` truthiness filters. */
export function hasEntryDate(data: EntryData, id?: string): boolean {
  return resolveEntryDate(data, id) !== null;
}
