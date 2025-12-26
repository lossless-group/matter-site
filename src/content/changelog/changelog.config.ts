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

export const changelogSchema = z.object({
  // Required fields
  title: z.string(),
  date: z.coerce.date(),

  // Optional metadata
  authors: z.array(z.string()).optional(),
  augmented_with: z.string().optional(),
  category: z.enum([
    'Feature',
    'Component',
    'Refactor',
    'Fix',
    'Documentation',
    'Infrastructure',
    'Design-System',
    'Milestone',
  ]).optional(),
  tags: z.array(z.string()).optional(),

  // Summary fields
  summary: z.string().optional(),
  why_care: z.string().optional(),

  // Files changed
  files_added: z.array(z.string()).optional(),
  files_modified: z.array(z.string()).optional(),

  // Allow additional fields
}).passthrough();

export const changelog = defineCollection({
  // Use glob loader to point to external directory
  loader: glob({
    pattern: '**/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]_*.md',
    base: './changelog', // Relative from src/content/ -> project root changelog/
  }),
  schema: changelogSchema,
});
