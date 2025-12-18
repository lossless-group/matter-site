---
# Section Metadata
slug: dark-matter-differentiation
component: DarkMatterDifferentiation.astro
componentPath: src/layouts/sections/narratives/DarkMatterDifferentiation.astro
order: 3
category: team
lastUpdated: 2024-12-18

# Display Configuration
title: Our Differentiation
subtitle: Scientific depth, exclusive access, and tight focus on defensible longevity technologies
eyebrow: Why Dark Matter

# Four Pillars of Differentiation
pillars:
  - id: expertise
    icon: dna
    title: Deep Scientific Expertise
    subtitle: in longevity biology
    bullets:
      - Decades of experience across biology, data science, and company-building
      - Embedded in leading geroscience centers working to extend healthspan
      - Distinguish true mechanism-based therapies from superficial wellness products
      - Support portfolio companies with trial design, regulatory strategy, and biomarker selection
    citationKeys:
      - "1d3uza"
      - afb7dp

  - id: dealflow
    icon: microscope
    title: Proprietary Deal Flow
    subtitle: via Stanford & Cedars-Sinai partnerships
    bullets:
      - Early visibility into spin-outs, pilot projects, and translational teams
      - Access to key investigators and clinical trial infrastructure
      - Co-design company formation around validated science and IP
      - NIH-backed aging clinical trials and gerotherapeutics programs
    citationKeys:
      - "4v5z4c"
      - hi3ous
      - pa7m9m
      - a8ony5
      - "1d3uza"
      - afb7dp

  - id: network
    icon: globe
    title: Longevity Leader Network
    subtitle: Ben Greenfield, Bryan Johnson, Peter Attia
    bullets:
      - Platforms reaching millions of longevity-focused consumers and clinicians
      - Real-world testing grounds with highly engaged, data-rich users
      - Credible distribution, education, and awareness channels
      - Direct feedback from athletes, biohackers, and prevention-oriented patients
    citationKeys: []

  - id: ip
    icon: shield
    title: IP-Protected, Scalable Solutions
    subtitle: Focus on defensible platforms
    bullets:
      - Novel therapeutics targeting fundamental aging pathways
      - Diagnostic, digital, and AI-driven tools for personalized interventions
      - Strong intellectual property moats and clear regulatory paths
      - Measurable impact on healthspan—clinically meaningful outcomes
    citationKeys:
      - "1d3uza"
      - afb7dp
      - "4v5z4c"
      - hi3ous

# Team Members (linked to pillars)
team:
  - name: Skinner Layne
    role: Strategy & Capital Formation
    description: Builds structures that bridge scientific discovery with institutional LP expectations.
    pillar: expertise
    photo: /photos/headshot__Skinner-Layne.png

  - name: Mark Moline
    role: Investment Analysis
    description: Translates scientific narratives into investment-grade theses.
    pillar: dealflow
    photo: /photos/headshot__Mark-Moline.jpeg

  - name: Thomas Vu
    role: Operations & Scale
    description: Scaling products from early validation to mass adoption.
    pillar: network
    photo: /photos/headshotOf__Thomas-Vu.jpeg

  - name: Anthony Borquez
    role: Commercialization
    description: Driving user acquisition, partnerships, and go-to-market execution.
    pillar: ip
    photo: /photos/headshotOf__Anthony-Borquez.jpeg

# Closing CTA
closing:
  eyebrow: Partner With Us
  headline: A Team That Speaks Both Lab and Late-Stage Capital
  text: Scientific depth meets investment discipline

# Citations
citations:
  "1d3uza":
    title: "Cedars-Sinai Heads Up $6.5M Multicenter Aging Research Grant"
    url: https://www.cedars-sinai.org/newsroom/cedars-sinai-ucla-and-usc-join-forces-to-extend-human-healthspan/
    source: Cedars-Sinai
    publishedDate: "2025-10-16"

  "4v5z4c":
    title: "Stanford Medicine's Longevity and Healthy Aging Pilot Grants 2025"
    url: https://seedfunding.stanford.edu/opportunities/stanford-medicines-longevity-and-healthy-aging-pilot-grants-2025-2026
    source: Stanford Seed Funding
    publishedDate: "2025-07-01"

  hi3ous:
    title: Stanford Medicine Center for Longevity and Healthy Aging
    url: https://aging.stanford.edu
    source: Stanford Medicine
    publishedDate: "2025-12-12"

  pa7m9m:
    title: "Stanford Center on Longevity: Home"
    url: https://longevity.stanford.edu
    source: Stanford
    publishedDate: "2025-11-12"

  a8ony5:
    title: SCL Corporate Affiliates Program
    url: https://longevity.stanford.edu/scl-corporate-affiliates-program/
    source: Stanford Center on Longevity
    publishedDate: "2025-07-31"

  afb7dp:
    title: Healthy Aging Research - Cedars-Sinai Health Sciences University
    url: https://www.cedars-sinai.edu/health-sciences-university/research/departments-institutes/smidt-heart-institute/healthy-aging.html
    source: Cedars-Sinai
---

# Dark Matter Differentiation: Why Us

## What This Section Communicates

This is the **competitive advantage** slide. It establishes the fund's unique positioning through four key pillars and demonstrates that differentiation is embedded in the team, not just claimed.

## Visual Structure

1. **Hero Opening** (min-height 60vh)
   - "Why Dark Matter" eyebrow
   - Large headline: "Our Differentiation"
   - Supporting subtitle about scientific depth
   - Scroll indicator

2. **Four Pillars of Differentiation** (2x2 grid)
   - Section badge: "Competitive Advantages"
   - Headline: "Four Pillars of Differentiation"
   - Each pillar card contains:
     - Icon (emoji)
     - Title + subtitle
     - 4 bullet points
     - Inline citations on final bullet
   - Cards animate in on scroll

3. **Team Section** (4 cards in row)
   - Section badge: "The Team"
   - Headline: "Team-Enabled Advantages"
   - Supporting text about embedded differentiation
   - Each team card:
     - Circular photo
     - Name and role
     - Description
     - Pillar indicator badge
   - Gradient background

4. **Closing CTA**
   - "Partner With Us" eyebrow
   - Headline about lab + capital expertise
   - Gradient glow effect

5. **Sources Section**
   - Numbered citations (Stanford, Cedars-Sinai sources)

## Theming

Color scheme: Purple/violet brand tones throughout.

- **Light**: Clean cards with subtle purple borders
- **Dark**: Glowing purple accents on void background
- **Vibrant**: Intense glow effects and gradient cards

## Key Messages

1. **Scientific Depth**: Real expertise, not just marketing
2. **Exclusive Access**: Stanford + Cedars-Sinai partnerships
3. **Network Effects**: Longevity influencer relationships
4. **IP Focus**: Defensible, scalable platforms

## Pillar-Team Mapping

- **Expertise** → Skinner Layne (Strategy)
- **Deal Flow** → Mark Moline (Analysis)
- **Network** → Thomas Vu (Operations)
- **IP** → Anthony Borquez (Commercialization)

## Animation

- Hero elements fade in sequentially
- Pillar cards reveal on scroll with delays
- Team cards fade up in sequence
- Pillar indicator badges show first word of pillar title

## Dependencies

- `@lib/citations/types` - Citation type definitions
- `@components/citations/InlineCitation.astro` - Popover citations
- `@components/citations/Sources.astro` - Sources list
