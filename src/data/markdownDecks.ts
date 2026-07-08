/**
 * Markdown Deck Loader
 *
 * Auto-loads markdown presentations from the 'slides' content collection.
 * Stores content as strings for direct use with MarkdownSlideDeck.
 *
 * NOTE: Loading is lazy (memoized on first call) rather than a top-level
 * await. Astro's content layer store isn't guaranteed to be populated yet
 * when this module is first imported (e.g. during getStaticPaths module
 * graph resolution), so a module-scope `await getCollection(...)` can race
 * ahead of content sync and silently resolve to an empty collection.
 * Deferring the fetch until a consumer actually calls one of the exported
 * functions ensures content sync has completed first.
 */

import { getCollection } from 'astro:content';

export interface MarkdownDeckData {
  slug: string;
  title: string;
  description: string;
  author?: string;
  date?: string;
  tags?: string[];
  coverImage?: string;
  shareImage?: string;
  content: string;
}

// Store decks in a record for quick lookup, populated on first access
const markdownDecks: Record<string, MarkdownDeckData> = {};

let loadPromise: Promise<void> | null = null;

// Load all markdown decks, memoized so the collection is only fetched once
const loadMarkdownDecks = (): Promise<void> => {
  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const slides = await getCollection('slides');

        for (const slide of slides) {
          // Use the slug from the collection entry, or derive from id
          const slug = slide.slug || slide.id.replace(/\.md$/, '').toLowerCase();

          markdownDecks[slug] = {
            slug,
            title: slide.data.title || 'Untitled Deck',
            description: slide.data.description || '',
            author: slide.data.author,
            date: slide.data.date,
            tags: slide.data.tags,
            coverImage: slide.data.coverImage,
            shareImage: slide.data.shareImage,
            content: slide.body,
          };
        }

        console.log('Loaded markdown decks:', Object.keys(markdownDecks));
      } catch (error) {
        console.error('Error loading markdown decks:', error);
      }
    })();
  }

  return loadPromise;
};

/**
 * Get all loaded markdown decks as an array
 */
export async function getAllMarkdownDecks(): Promise<MarkdownDeckData[]> {
  await loadMarkdownDecks();
  return Object.values(markdownDecks);
}

/**
 * Get all loaded markdown decks keyed by slug
 */
export async function getMarkdownDecksMap(): Promise<Record<string, MarkdownDeckData>> {
  await loadMarkdownDecks();
  return markdownDecks;
}

/**
 * Get a single markdown deck by slug (case-insensitive)
 */
export async function getMarkdownDeckBySlug(slug: string): Promise<MarkdownDeckData | undefined> {
  await loadMarkdownDecks();

  // Try exact match first
  if (markdownDecks[slug]) {
    return markdownDecks[slug];
  }

  // Try case-insensitive match
  const foundSlug = Object.keys(markdownDecks).find(key =>
    key.toLowerCase() === slug.toLowerCase()
  );

  return foundSlug ? markdownDecks[foundSlug] : undefined;
}
