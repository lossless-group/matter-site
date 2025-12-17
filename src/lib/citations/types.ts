/**
 * Citation System Types
 *
 * Hex-code based citation system that converts to sequential integers at render time.
 * See: astro-knots/context-v/Citation-System-Architecture.md
 */

/**
 * A citation reference definition.
 * The hexCode is stable across documents; index is assigned at render time.
 */
export interface CitationReference {
  /** 6-character alphanumeric identifier (e.g., "alyqs4") */
  hexCode: string;
  /** Sequential index assigned at render time (e.g., 1, 2, 3) */
  index?: number;
  /** Title of the source article/document */
  title: string;
  /** Full URL to the source */
  url: string;
  /** ISO date string when the source was published */
  publishedDate?: string;
  /** ISO date string when the source was last updated */
  updatedDate?: string;
  /** When the citation was captured/accessed */
  accessDate?: string;
  /** Publication name or domain (e.g., "NIH", "McKinsey") */
  source?: string;
}

/**
 * Citation with index assigned (after render-time processing)
 */
export interface IndexedCitation extends CitationReference {
  index: number;
}

/**
 * A data item that may have an associated citation
 */
export interface CitableData<T = unknown> {
  data: T;
  citation?: CitationReference;
}

/**
 * Build a citation index map from an array of citations.
 * Assigns sequential integers in order of first appearance.
 */
export function buildCitationIndex(
  citations: (CitationReference | undefined)[]
): Map<string, IndexedCitation> {
  const indexMap = new Map<string, IndexedCitation>();

  citations.forEach((citation) => {
    if (citation && !indexMap.has(citation.hexCode)) {
      indexMap.set(citation.hexCode, {
        ...citation,
        index: indexMap.size + 1,
      });
    }
  });

  return indexMap;
}

/**
 * Get an indexed citation from a map, or undefined if not found
 */
export function getCitation(
  hexCode: string,
  indexMap: Map<string, IndexedCitation>
): IndexedCitation | undefined {
  return indexMap.get(hexCode);
}

/**
 * Convert a citation map to a sorted array for the Sources component
 */
export function citationsToArray(
  indexMap: Map<string, IndexedCitation>
): IndexedCitation[] {
  return [...indexMap.values()].sort((a, b) => a.index - b.index);
}
