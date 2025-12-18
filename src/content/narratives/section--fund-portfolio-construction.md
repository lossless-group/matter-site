---
# Section Metadata
slug: fund-portfolio-construction
component: FundPortfolioConstructionDetails.astro
componentPath: src/layouts/sections/narratives/FundPortfolioConstructionDetails.astro
order: 5
category: fund
lastUpdated: 2024-12-18

# Display Configuration
title: Fund Strategy
subtitle: Portfolio construction designed for category-defining longevity outcomes
eyebrow: Portfolio Construction

# Hero Metrics (3 large stats)
heroMetrics:
  - value: "$100M"
    label: Fund Size

  - value: "10"
    label: Year Term
    suffix: yrs

  - value: "25"
    label: Target Investments

# Fund Economics (3 cards)
economics:
  - label: Management Fee
    value: "2%"
    description: Annual on committed capital

  - label: Carried Interest
    value: "20-25%"
    description: Performance fee, back-ended

  - label: GP Commitment
    value: Meaningful
    description: Personal capital alongside LPs

# Geographic Allocation
geography:
  - region: U.S. / Europe
    percentage: 70
    description: Best-in-class research hubs with deep biotech talent and established exit markets

  - region: Rest of World
    percentage: 30
    description: Opportunistic positions in Israel, Asia, and emerging innovation clusters

# Stage Allocation
stages:
  - stage: Seed
    percentage: 50
    color: seed
    description: Lead or co-lead in technical and scientific founding teams
    focus: Core longevity biology, platform technologies, enabling tools

  - stage: Series A/B
    percentage: 30
    color: series
    description: Scale capital into companies showing human data and traction
    focus: Clinical validation, strategic partnerships, commercial progress

  - stage: Follow-ons
    percentage: 20
    color: followon
    description: Systematic double-down into top decile outcomes
    focus: Concentrated capital behind proven winners

# Check Sizes
checkSizes:
  - label: Initial Check
    value: $2.75M-$3.0M
    description: Per company at entry

  - label: Target Ownership
    value: 10-15%+
    description: At seed entry

  - label: Winner Reserves
    value: $5M-$10M
    description: Per breakout company

# Follow-On Tiers (pyramid structure)
followOnTiers:
  - tier: Top 3-5
    exposure: $5M-$10M+
    strategy: Lead or participate meaningfully in multiple subsequent rounds
    ownership: High-single to low-double digit ownership into late stages
    highlight: true

  - tier: Next 8-10
    exposure: $3M-$5M
    strategy: Support through key de-risking milestones
    ownership: First-in-human data, partnerships, reimbursement validation
    highlight: false

  - tier: Remaining
    exposure: Pro-rata only
    strategy: Capital not trapped in low-conviction situations
    ownership: Preserve dry powder for true outliers
    highlight: false

# LP Benefits (3 cards)
lpBenefits:
  - title: Balanced Diversification
    description: "~25 core positions across the longevity stack with meaningful concentration in winners"

  - title: Stage Mix Advantage
    description: Seed taps early entry pricing; A/B compounds into validated companies

  - title: Systematic Framework
    description: Written reserve rules avoid emotional decisions, focusing on highest risk-adjusted MOIC

# Closing CTA
closing:
  eyebrow: Institutional Grade
  headline: Venture Returns from the Longevity Ecosystem
  text: Category-defining companies through critical inflection points
---

# Fund Portfolio Construction Details

## What This Section Communicates

This is the **fund mechanics** slide. It provides institutional-grade transparency on fund size, economics, stage allocation, and follow-on strategy.

## Visual Structure

1. **Hero Opening** (min-height 70vh)
   - "Portfolio Construction" eyebrow
   - Large headline: "Fund Strategy"
   - Supporting subtitle
   - Three giant metrics: $100M, 10 years, 25 investments
   - Scroll indicator

2. **Fund Economics** (3 cards)
   - Section badge: "Economics"
   - Headline: "LP-GP Alignment"
   - Cards for: Management Fee, Carry, GP Commitment

3. **Stage Allocation** (visual bar + 3 detail cards)
   - Section badge: "Capital Deployment"
   - Headline: "Stage Allocation"
   - Colored horizontal bar showing 50%/30%/20% split
   - Legend with stage names
   - Three detail cards explaining each stage
   - Gradient background

4. **Geographic Focus** (donut chart + legend)
   - Section badge: "Geography"
   - Headline: "Geographic Focus"
   - SVG donut chart showing 70/30 split
   - Two-item legend with descriptions

5. **Check Sizes** (3 cards)
   - Section badge: "Investment Approach"
   - Headline: "Check Sizes & Ownership"
   - Cards for initial check, ownership target, reserves
   - Gradient background

6. **Follow-On Strategy** (pyramid tiers)
   - Section badge: "Capital Concentration"
   - Headline: "Follow-On Strategy"
   - Three tiers with narrowing widths (pyramid effect)
   - Top tier highlighted with special styling
   - Shows exposure amounts and strategy

7. **LP Benefits** (3 numbered cards)
   - Section badge: "LP Value"
   - Headline: "How This Serves LPs"
   - Large number + title + description
   - Gradient background

8. **Closing CTA**
   - "Institutional Grade" eyebrow
   - Headline about venture returns
   - Gradient glow effect

## Theming

Color scheme: Blue for fund/institutional messaging, purple for stages, cyan for geography, green for checks, amber for follow-ons.

- **Light**: Clean blue accents
- **Dark**: Blue/cyan glows on void
- **Vibrant**: Intense gradients and glow effects throughout

## Key Data Points

| Metric | Value |
|--------|-------|
| Fund Size | $100M |
| Term | 10 years |
| Target Companies | 25 |
| Seed Allocation | 50% |
| Series A/B | 30% |
| Follow-ons | 20% |
| Initial Check | $2.75M-$3.0M |
| Target Ownership | 10-15%+ |
| Winner Reserves | $5M-$10M |
| US/Europe | 70% |
| Rest of World | 30% |

## Donut Chart Calculation

The SVG donut uses stroke-dasharray to show the 70% primary segment:
- Circumference: 2 * π * 40 = 251.33
- 70% segment: 0.70 * 251.33 = 175.93
- stroke-dasharray: "175.93 251.33"

## Animation

- Hero metrics reveal with delays
- Stage bar animates width on scroll
- Tier cards narrow progressively (pyramid effect)
- Numbered LP benefit cards reveal sequentially

## Dependencies

None - this section has no citations (internal fund data)
