/**
 * Component Deck Registry
 *
 * Registry for component-based (Astro) presentations.
 * Each deck has metadata for display on the index page.
 */

export interface ComponentDeck {
  title: string;
  description: string;
  component: string;
  author?: string;
  date?: string;
  tags?: string[];
  type: 'component';

  // Image assets
  coverImage?: string;   // Card preview on index page
  shareImage?: string;   // OpenGraph/social sharing
}

/**
 * Registry of all component-based presentations.
 * Key is the URL slug.
 */
export const componentDecks: Record<string, ComponentDeck> = {
  'dark-matter-thesis': {
    title: 'Why Now, Why Dark Matter?',
    description: 'A venture-built thesis at the edge of bioscience, data, and longevity.',
    component: 'SlideShowDarkMatterThesis',
    author: 'Dark Matter',
    date: '2025-01-15',
    coverImage: '/share-banners/shareBanner__Dark-Matter-Bio_Longevity-Fund-II.webp',
    shareImage: '/share-banners/shareBanner__Dark-Matter-Bio_Longevity-Fund-II.webp',
    type: 'component',
  },
};

/**
 * Get a single component deck by slug
 */
export function getComponentDeck(slug: string): ComponentDeck | undefined {
  return componentDecks[slug.toLowerCase()];
}

/**
 * Get all component decks as array with slugs
 */
export function getAllComponentDecks(): Array<{ slug: string; deck: ComponentDeck }> {
  return Object.entries(componentDecks).map(([slug, deck]) => ({
    slug,
    deck,
  }));
}
