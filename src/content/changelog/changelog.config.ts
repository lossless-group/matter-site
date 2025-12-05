/**
 * Changelog Content Collection Config
 *
 * Points to the changelog directory OUTSIDE of src/
 * The changelog is managed as a separate git submodule.
 *
 * Directory: ../../../changelog (relative to src/content/)
 * Actual path: <project-root>/changelog/
 */

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const changelog = defineCollection({
  // Use glob loader to point to external directory
  loader: glob({
    pattern: '**/*.md',
    base: './changelog', // Relative from src/content/ -> project root changelog/
  }),
  // Passthrough schema - accepts any frontmatter without validation
  schema: z.object({}).passthrough(),
});
