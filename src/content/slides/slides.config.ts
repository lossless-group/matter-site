/**
 * Slides Content Collection Config
 *
 * Configuration for markdown-based presentations.
 * Uses passthrough schema to accept any frontmatter.
 */

import { defineCollection, z } from 'astro:content';

export const slides = defineCollection({
  type: 'content',
  // Passthrough schema - accepts any frontmatter without strict validation
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    author: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
    shareImage: z.string().optional(),
  }).passthrough(),
});
