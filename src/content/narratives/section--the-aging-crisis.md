---
# Section Metadata
slug: the-aging-crisis
component: TheAgingCrisis.astro
componentPath: src/layouts/sections/narratives/TheAgingCrisis.astro
order: 1
category: problem
lastUpdated: 2024-12-18

# Display Configuration
title: The Aging Crisis
subtitle: Age-related diseases cost $1T+ annually in global healthcare
eyebrow: The Problem

# Hero Section - The Big Number
hero:
  stat: "$1T+"
  label: annual global healthcare costs
  diseases:
    - Alzheimer's
    - Cancer
    - CVD
    - Diabetes
    - Renal Failure

# Disease Cost Cards (4 cards in 2x2 grid)
diseaseCosts:
  - disease: Cardiovascular Disease
    cost: "$1.8T"
    timeframe: by 2050 (US)
    description: Leading cause of death globally, costs projected to triple from current levels.
    icon: heart
    citationKey: alyqs4

  - disease: Diabetes
    cost: "$966B"
    timeframe: per year (global)
    description: Approaching $1T annually worldwide in direct health expenditure.
    icon: blood
    citationKey: null  # IDF data, not in our citation set

  - disease: Cancer
    cost: "#1"
    timeframe: cost driver
    description: Now the leading condition driving insurer medical costs globally, cited by 57% of insurers.
    icon: microscope
    citationKey: m761t3

  - disease: Chronic Conditions
    cost: "90%"
    timeframe: of US spend
    description: Nearly all US healthcare spending goes to chronic and mental health conditions.
    icon: pill
    citationKey: vw99oj

# Healthspan vs Lifespan Visualization
healthspanGap:
  healthspan: 65
  lifespan: 80
  gap: 15
  gapDescription: Years living with chronic disease, disability, or frailty
  citationKey: k9m6ww

# US Demographics Stats (4 stat cards)
usStats:
  - stat: "55M+"
    label: Americans 65+
    description: Already over 55 million Americans aged 65 or older today.
    citationKey: vw99oj

  - stat: "80M"
    label: By 2040
    description: Projected 65+ population will reach almost 80 million.
    citationKey: alyqs4

  - stat: "20%"
    label: of Population
    description: 1 in 5 Americans will be 65+ by 2030.
    citationKey: alyqs4

  - stat: "5x"
    label: Cost Multiplier
    description: Per-person spending for 65+ is 5x higher than for children.
    citationKey: alyqs4

# Cost Implications (3 stat cards)
costImplications:
  - stat: "$172,500"
    label: Per Retiree
    description: Average healthcare cost during retirement, more than doubled since 2002.
    citationKey: "67utob"

  - stat: "7-8%"
    label: Annual Increase
    description: Expected healthcare cost growth for US employers in 2025.
    citationKey: qg3qsq

  - stat: "2.5x"
    label: vs Working Age
    description: Per-capita spending for 65+ compared to working-age adults.
    citationKey: alyqs4

# Closing CTA Section
closing:
  badge: The Opportunity
  headline: Biotech Can Bend the Cost Curve
  text: Solutions that extend healthspan, reduce costs, and improve lives
  subtext: If 90% of spend is tied to chronic conditions linked to aging, even single-digit percentage reductions cascade into hundreds of billions in savings.

# Citations (keyed by hex code for inline references)
citations:
  alyqs4:
    title: Key Drivers of 2025 Health Care Cost Increases
    url: https://parrottbenefitgroup.com/key-drivers-of-2025-health-care-cost-increases/
    source: Parrott Benefit Group
    publishedDate: "2024-11-22"

  vw99oj:
    title: Why Health Care Costs Are Rising in 2025
    url: https://watkinsinsurancegroup.com/blog/why-health-care-costs-are-rising-in-2025/
    source: Watkins Insurance Group
    publishedDate: "2025-01-30"

  m761t3:
    title: Global Healthcare Costs Projected to Rise More Than 10% in 2026
    url: https://worldatwork.org/publications/workspan-daily/global-healthcare-costs-projected-to-rise-more-than-10-in-2026
    source: WorldatWork
    publishedDate: "2025-11-13"

  k9m6ww:
    title: How heavy is the medical expense burden among the older adults
    url: https://pmc.ncbi.nlm.nih.gov/articles/PMC10313336/
    source: NIH/PMC
    publishedDate: "2023-06-16"

  "67utob":
    title: Fidelity Investments Releases 2025 Retiree Health Care Cost Estimate
    url: https://newsroom.fidelity.com/pressreleases/fidelity-investments--releases-2025-retiree-health-care-cost-estimate--a-timely-reminder-for-all-gen/s/3c62e988-12e2-4dc8-afb4-f44b06c6d52e
    source: Fidelity Investments
    publishedDate: "2025-07-30"

  dvh7iv:
    title: "Rising Healthcare Costs: GLP-1 & Containment Strategies"
    url: https://www.definitivehc.com/blog/rising-healthcare-costs
    source: Definitive Healthcare
    publishedDate: "2025-09-12"

  qg3qsq:
    title: 2025 Healthcare Cost Outlook | Drivers & Trend Insights
    url: https://www.bbrown.com/us/insight/2025-healthcare-cost-outlook-drivers-trend-insights/
    source: Brown & Brown
    publishedDate: "2024-10-28"
---

# The Aging Crisis

## What This Section Communicates

This is the **problem statement** slide for the Dark Matter Longevity Fund pitch. It establishes the massive scale of the healthcare cost crisis driven by aging populations and age-related diseases.

## Visual Structure

1. **Hero Opening** (min-height 80vh)
   - Problem badge with pulsing dot
   - Large headline: "The Aging Crisis"
   - Supporting subtitle
   - Giant "$1T+" stat with gradient text
   - List of major diseases
   - Scroll indicator

2. **Disease Cost Clusters** (4 cards, 2x2 grid)
   - Each card shows: icon, disease name, cost figure, timeframe, description
   - Inline citations appear after descriptions
   - Cards animate in on scroll (alternating slide direction)

3. **Healthspan vs Lifespan Gap** (visual bar chart)
   - Two horizontal bars showing 65 years vs 80+ years
   - Gap callout: "15 years" of disease/disability
   - Gradient background treatment

4. **US Demographics** (4 stat cards in row)
   - Quick-read statistics about aging population
   - Each links to citation

5. **Cost Implications** (3 stat cards)
   - Per-retiree costs, annual increase rate, age multiplier
   - Dark gradient background

6. **Closing CTA**
   - "The Opportunity" badge
   - Transition message to solution/investment thesis
   - Gradient glow effect

7. **Sources Section**
   - Numbered citations with links

## Theming

Supports three visual modes:
- **Light**: Clean, professional with subtle gradients
- **Dark**: Deep void background with glowing accents
- **Vibrant**: Intense gradients and glow effects

Color scheme: Red/orange tones for "crisis/warning" messaging, green for "opportunity" closing.

## Animation

- Hero elements fade in sequentially (0.2s delays)
- Cards use IntersectionObserver for scroll-triggered reveals
- Bar chart animates on scroll
- Scroll hint pulses continuously

## Dependencies

- `@lib/citations/types` - Citation type definitions and index builder
- `@components/citations/InlineCitation.astro` - Popover citation component
- `@components/citations/Sources.astro` - Sources list component
