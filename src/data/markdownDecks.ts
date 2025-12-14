/**
 * Markdown Deck Loader
 *
 * Auto-loads markdown presentations from the 'slides' content collection.
 * Stores content as strings for direct use with MarkdownSlideDeck.
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

// Store decks in a record for quick lookup
export const markdownDecks: Record<string, MarkdownDeckData> = {};

// Load all markdown decks at module initialization
const loadMarkdownDecks = async () => {
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
};

// Initialize the decks at module load
await loadMarkdownDecks();

/**
 * Get all loaded markdown decks as an array
 */
export function getAllMarkdownDecks(): MarkdownDeckData[] {
  return Object.values(markdownDecks);
}

/**
 * Get a single markdown deck by slug (case-insensitive)
 */
export async function getMarkdownDeckBySlug(slug: string): Promise<MarkdownDeckData | undefined> {
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
