/**
 * Astro Content Collections Config
 *
 * Central registry for all content collections.
 * Individual collection configs are defined in their respective directories.
 */

import { narratives } from './content/narratives/narratives.config';
import { changelog } from './content/changelog/changelog.config';

export const collections = {
  narratives,
  changelog,
};
