/**
 * Narratives Content Collection Config
 *
 * Schema for pitch deck narrative sections.
 * Each section represents a slide/component in the Dark Matter fund presentation.
 *
 * See _schema.md for full documentation of the YAML structure.
 */

import { defineCollection, z } from 'astro:content';

// Citation reference schema
const citationSchema = z.object({
  title: z.string().optional(),
  url: z.string().optional(),
  source: z.string().optional(),
  publishedDate: z.union([z.string(), z.date()]).optional(),
  updatedDate: z.union([z.string(), z.date()]).optional(),
});

// Base stat/card schema used across sections
const statCardSchema = z.object({
  stat: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  citationKey: z.string().nullable().optional(),
});

// Closing CTA schema
const closingSchema = z.object({
  eyebrow: z.string().optional(),
  badge: z.string().optional(),
  headline: z.string().optional(),
  text: z.string().optional(),
  subtext: z.string().optional(),
});

export const narratives = defineCollection({
  type: 'content',
  schema: z
    .object({
      // === Section Metadata ===
      slug: z.string().optional(),
      component: z.string().optional(),
      componentPath: z.string().optional(),
      order: z.number().optional(),
      category: z
        .enum(['problem', 'opportunity', 'solution', 'team', 'returns', 'fund'])
        .optional(),
      lastUpdated: z.union([z.string(), z.date()]).optional(),

      // === Display Configuration ===
      title: z.string().optional(),
      subtitle: z.string().optional(),
      eyebrow: z.string().optional(),

      // === Hero Section (varies by section type) ===
      hero: z
        .object({
          stat: z.string().optional(),
          value: z.string().optional(),
          label: z.string().optional(),
          source: z.string().optional(),
          diseases: z.array(z.string()).optional(),
        })
        .optional(),

      heroStats: z.array(statCardSchema).optional(),
      heroMetrics: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
            suffix: z.string().optional(),
          })
        )
        .optional(),

      // === Content Arrays (section-specific) ===
      diseaseCosts: z
        .array(
          z.object({
            disease: z.string(),
            cost: z.string(),
            timeframe: z.string(),
            description: z.string(),
            icon: z.string(),
            citationKey: z.string().nullable().optional(),
          })
        )
        .optional(),

      healthspanGap: z
        .object({
          healthspan: z.number(),
          lifespan: z.number(),
          gap: z.number(),
          gapDescription: z.string(),
          citationKey: z.string().optional(),
        })
        .optional(),

      usStats: z.array(statCardSchema).optional(),
      costImplications: z.array(statCardSchema).optional(),
      demographicStats: z.array(statCardSchema).optional(),

      scienceBreakthroughs: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string(),
          })
        )
        .optional(),

      economyPoints: z.array(statCardSchema).optional(),

      // === Differentiation Section ===
      pillars: z
        .array(
          z.object({
            id: z.string(),
            icon: z.string(),
            title: z.string(),
            subtitle: z.string(),
            bullets: z.array(z.string()),
            citationKeys: z.array(z.string()).optional(),
          })
        )
        .optional(),

      team: z
        .array(
          z.object({
            name: z.string(),
            role: z.string(),
            description: z.string(),
            pillar: z.string(),
            photo: z.string(),
          })
        )
        .optional(),

      // === Exit Potential Section ===
      ipoPath: z
        .object({
          title: z.string(),
          icon: z.string(),
          description: z.string(),
          points: z.array(
            z.object({
              title: z.string(),
              text: z.string(),
              citationKey: z.string().optional(),
            })
          ),
        })
        .optional(),

      maPath: z
        .object({
          title: z.string(),
          icon: z.string(),
          description: z.string(),
          points: z.array(
            z.object({
              title: z.string(),
              text: z.string(),
              citationKey: z.string().optional(),
            })
          ),
        })
        .optional(),

      marketGrowth: z
        .object({
          from: z.string(),
          to: z.string(),
          period: z.string(),
          cagr: z.string(),
          citationKey: z.string().optional(),
        })
        .optional(),

      dealExample: z
        .object({
          title: z.string(),
          subtitle: z.string(),
          rationale: z.array(z.string()),
          terms: z.array(
            z.object({
              label: z.string(),
              value: z.string(),
            })
          ),
          citationKey: z.string().optional(),
        })
        .optional(),

      // === Fund Construction Section ===
      economics: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
            description: z.string(),
          })
        )
        .optional(),

      geography: z
        .array(
          z.object({
            region: z.string(),
            percentage: z.number(),
            description: z.string(),
          })
        )
        .optional(),

      stages: z
        .array(
          z.object({
            stage: z.string(),
            percentage: z.number(),
            color: z.string(),
            description: z.string(),
            focus: z.string(),
          })
        )
        .optional(),

      checkSizes: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
            description: z.string(),
          })
        )
        .optional(),

      followOnTiers: z
        .array(
          z.object({
            tier: z.string(),
            exposure: z.string(),
            strategy: z.string(),
            ownership: z.string(),
            highlight: z.boolean(),
          })
        )
        .optional(),

      lpBenefits: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
          })
        )
        .optional(),

      // === Closing CTA ===
      closing: closingSchema.optional(),

      // === Citations Library ===
      citations: z.record(z.string(), citationSchema).optional(),
    })
    .passthrough(), // Allow additional fields for iteration
});
