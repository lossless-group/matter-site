---
# Section Metadata
slug: aging-population
component: AgingPopulation.astro
componentPath: src/layouts/sections/narratives/AgingPopulation.astro
order: 2
category: opportunity
lastUpdated: 2024-12-18

# Display Configuration
title: The Global Aging Wave
subtitle: A demographic shift creating a multi-trillion dollar opportunity
eyebrow: Why Now

# Hero Section
hero:
  stat: "2B"
  label: people over 60 by 2050
  source: United Nations

# Demographic Statistics (4 cards)
demographicStats:
  - stat: "2.1B"
    label: People 60+ by 2050
    description: The UN projects the global population aged 60+ will roughly double to 2.1 billion by 2050.
    citationKey: "1ucdcd"

  - stat: "1.6B"
    label: People 65+ by 2050
    description: Population aged 65+ expected to reach around 1.6 billion, nearly double today's 857 million.
    citationKey: xs9htq

  - stat: "3x"
    label: Growth in 80+ Population
    description: The "oldest old" (80+) will more than triple from 127M in 2015 to 447M by 2050.
    citationKey: xs9htq

  - stat: "1 in 4"
    label: Asians over 60 by 2050
    description: In Asia, one in four people will be over 60, with some economies nearing 40% aged 65+.
    citationKey: "3lhrqq"

# Scientific Breakthroughs (3 cards, no citations - general literature)
scienceBreakthroughs:
  - title: CRISPR & Genetic Interventions
    description: Evolved from basic gene editing to base editing, prime editing, and epigenome editing—enabling precise interventions in age-related pathways.
    icon: dna

  - title: Senolytics
    description: Drugs that selectively clear senescent "zombie" cells, implicated in chronic inflammation and age-related diseases.
    icon: cell

  - title: AI-Driven Drug Discovery
    description: Applied to multi-omics datasets and biomarker streams to identify aging signatures and enable biological-age-driven interventions.
    icon: brain

# Economy Points (3 stat cards)
economyPoints:
  - stat: "25%"
    label: of Global Consumption
    description: Seniors will account for one-quarter of global consumption by 2050, double their share in 1997.
    citationKey: bdc9bv

  - stat: "$7T+"
    label: Longevity Economy
    description: Healthcare, financial products, housing, caregiving, and consumer markets serving older adults.
    citationKey: bdc9bv

  - stat: "77 years"
    label: Life Expectancy by 2050
    description: Global life expectancy projected to reach 77 years by 2050, up from 73 years in 2023.
    citationKey: bdc9bv

# Closing CTA
closing:
  eyebrow: Join Us
  headline: Capture the $7T+ Longevity Economy
  text: Demographic inevitability meets scientific readiness

# Citations
citations:
  "1ucdcd":
    title: "Population ageing: Navigating the demographic shift"
    url: https://www.helpage.org/news/population-ageing-navigating-the-demographic-shift/
    source: HelpAge International
    publishedDate: "2024-07-11"

  xs9htq:
    title: "World's older population grows dramatically"
    url: https://www.nia.nih.gov/news/worlds-older-population-grows-dramatically
    source: NIH/NIA
    publishedDate: "2016-03-28"

  "3lhrqq":
    title: "Chart: Aging Populations"
    url: https://www.statista.com/chart/29345/countries-and-territories-with-the-highest-share-of-people-aged-65-and-older/
    source: Statista
    publishedDate: "2025-07-07"

  "7d6fsj":
    title: "Fact Sheet: Aging in the United States"
    url: https://www.prb.org/resources/fact-sheet-aging-in-the-united-states/
    source: PRB.org
    publishedDate: "2024-01-09"

  bdc9bv:
    title: Confronting the consequences of a new demographic reality
    url: https://www.mckinsey.com/mgi/our-research/dependency-and-depopulation-confronting-the-consequences-of-a-new-demographic-reality
    source: McKinsey
    publishedDate: "2025-01-15"

  "7hvbv5":
    title: "Charted: Global Senior Population by Region (2025 vs. 2050P)"
    url: https://www.visualcapitalist.com/global-senior-population-forecasts-2025-vs-2050p/
    source: Visual Capitalist
    publishedDate: "2025-11-13"

  j87cis:
    title: Ageing - the United Nations
    url: https://www.un.org/en/global-issues/ageing
    source: United Nations
    publishedDate: "2025-12-17"
---

# Aging Population: The Longevity Opportunity

## What This Section Communicates

This is the **"Why Now"** opportunity slide. It establishes the massive demographic shift as a structural, secular investment opportunity backed by both demographic certainty and scientific readiness.

## Visual Structure

1. **Hero Opening** (min-height 80vh)
   - "Why Now" eyebrow
   - Large headline: "The Global Aging Wave"
   - Supporting subtitle
   - Giant "2B" stat with gradient text
   - "United Nations" source attribution
   - Scroll indicator

2. **Demographic Statistics** (4 cards in row/grid)
   - Section badge: "Demographics"
   - Headline: "A Defining Global Trend"
   - Supporting quote from UN
   - Four stat cards with reveal animation

3. **Scientific Breakthroughs** (3 horizontal cards)
   - Section badge: "Breakthroughs"
   - Headline: "Science at an Inflection Point"
   - Cards with icons, alternating slide animations
   - Gradient background

4. **The Longevity Economy** (3 stat cards)
   - Section badge: "Opportunity"
   - Headline: "The Longevity Economy"
   - Large stat numbers with descriptions

5. **Closing CTA**
   - "Join Us" eyebrow
   - "$7T+ Longevity Economy" headline
   - Gradient glow effect

6. **Sources Section**
   - Numbered citations with links

## Theming

Color scheme: Purple/violet tones (brand colors) for opportunity/growth messaging.

- **Light**: Clean with subtle purple gradients
- **Dark**: Deep void with glowing lilac accents
- **Vibrant**: Intense purple glows and gradient cards

## Key Messages

1. **Demographic Certainty**: 2B people 60+ by 2050 is locked in
2. **Scientific Readiness**: CRISPR, senolytics, AI have matured
3. **Market Size**: $7T+ economy with 25% of global consumption

## Animation

- Hero elements fade in sequentially
- Stat cards reveal on scroll
- Breakthrough cards alternate slide-left/slide-right
- Stat numbers have subtle pulse animation

## Dependencies

- `@lib/citations/types` - Citation type definitions
- `@components/citations/InlineCitation.astro` - Popover citations
- `@components/citations/Sources.astro` - Sources list
