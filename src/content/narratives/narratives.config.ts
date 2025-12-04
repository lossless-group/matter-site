/**
 * Narratives Content Collection Config
 *
 * Passthrough configuration for narrative content.
 * No schema validation - accepts any frontmatter.
 */

import { defineCollection, z } from 'astro:content';

export const narratives = defineCollection({
  type: 'content',
  // Passthrough schema - accepts any frontmatter without validation
  schema: z.object({}).passthrough(),
});
