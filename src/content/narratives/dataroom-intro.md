---
# Section Metadata
slug: dataroom-intro
component: DataroomIntro.astro
componentPath: src/layouts/sections/narratives/DataroomIntro.astro
order: 0
category: fund
lastUpdated: 2025-12-18

# Display Configuration
title: Dataroom Overview
subtitle: A complete, LP-ready checklist for reviewing Fund I materials
eyebrow: VC Dataroom

# Checklist (infographic-friendly)
checklist:
  - id: intro-materials
    title: Intro Materials
    description: First-pass orientation materials that establish the story, terms, and what to read next.
    items:
      - label: Intro Deck
      - label: One Pager
      - label: Fund Terms (to the extent set), Disclaimer

  - id: team
    title: Team
    description: Credentials, references, and investor-ready evidence of operator/investor capability.
    items:
      - label: Team Bios
      - label: Team Extended Bios
      - label: Team CVs
      - label: Letters of Recommendation / Testimonials / References
      - label: Team Previous Track Record
        children:
          - label: Individual Visual Dealsheets
            children:
              - label: Company
              - label: Date of Investment
              - label: Round Stage at Investment
              - label: Coinvestors
              - label: Current MOIC
              - label: Current Horizon IRR

  - id: track-record
    title: Track Record
    description: Portfolio evidence from the proto-fund and prior roles, standardized for LP diligence.
    items:
      - label: Combined Track Record
        children:
          - label: Company
          - label: Date of Investment
          - label: Round Stage at Investment
          - label: Coinvestors
          - label: Current MOIC
          - label: Current Horizon IRR
      - label: 3 Success Case Studies, with References if available.
      - label: 3 Lessons Learned Case Studies

  - id: ppm
    title: Private Placement Memorandum
    description: Formal fund documentation and the sections LPs diligence most.
    items:
      - label: Market Opportunity Section

  - id: imprint-legal
    title: Imprint / Legal
    description: Entity formation, standing, and governance artifacts.
    items:
      - label: Incorporation Documents
      - label: Good Standing Documents
      - label: Partner Agreements

  - id: thesis-pipeline
    title: Thesis & Pipeline
    description: How you win (thesis) and how you deploy (pipeline), supported by concrete examples.
    items:
      - label: 2-page Thesis Briefs (Segment / Sector / Stage)
      - label: Deal Sheets
        children:
          - label: 3 Example Deals from last year (would have done if in market)
          - label: 3 Example Pipeline Deals
          - label: 3 Anti-Portfolio Deals (passed or missed due to lack of capital)
      - label: Export / Spreadsheet of Current Pipeline
      - label: Sourcing Advantages (networks, relationships, events)

  - id: double-click
    title: Double Click Materials
    description: Optional depth for LPs who want additional evidence and detail.
    items:
      - label: Extended Slide Deck
      - label: Extended Market Research
      - label: Media Kit / Mentions / Publications

  - id: portfolio-model
    title: Portfolio Model
    description: How the fund translates strategy into construction, sizing, and outcome distributions.
    items:
      - label: Portfolio Construction
      - label: Investment Period / Pacing Schedule
      - label: Sensitivity Analysis (based on capital raise amount)
      - label: Pretend Returns Forecasts (with fill-in-the-blank realtime updates)

  - id: lp-social-proof
    title: LP Social Proof
    description: Momentum and validation, appropriately redacted and probability-weighted.
    items:
      - label: Spreadsheet / Export of Fundraise Pipeline (redacted, probability weighted)
      - label: Letters of intent / letters of reference from LPs
---

# Dataroom Introduction

## What This Section Communicates

This is an **infographic introduction** to the dataroom: a fast orientation layer for LPs that shows exactly what is included, how to navigate it, and what diligence questions each section answers.

## Visual Structure

1. **Hero Opening** (min-height 60vh)
   - "VC Dataroom" eyebrow
   - Large headline: "Dataroom Overview"
   - Subtitle that sets expectation: comprehensive Fund I checklist, structured for diligence
   - Scroll indicator

2. **Checklist Grid** (cards)
   - Each category is a card with:
     - Title
     - One-line purpose
     - Checklist items (with nested items where relevant)

3. **Closing CTA**
   - Prompt: start with Intro Materials, then Team + Track Record

## Theming

Color scheme: neutral + disciplined, optimized for diligence (clear hierarchy, high contrast, minimal ornamentation).

- **Light**: clean cards, subtle borders
- **Dark**: soft glows on borders, legible type, muted accents
- **Vibrant**: restrained gradients, emphasis on category titles and completion cues

## Checklist (Readable)

### Intro Materials

- Intro Deck
- One Pager
- Fund Terms (to the extent set)

### Team

- Team Bios
- Team Extended Bios
- Team CVs
- (Letters of Recommendation, Testimonials, References)
- Team Previous Track Record
  - Individual Visual Dealsheets
    - Company
    - Date of Investment
    - Round Stage at Investment
    - Coinvestors
    - Current MOIC
    - Current Horizon IRR

### Track Record

- Combined Track Record (assembled from Individuals)
  - Company
  - Date of Investment
  - Round Stage at Investment
  - Coinvestors
  - Current MOIC
  - Current Horizon IRR
- 3 Success Case Studies
- 3 Lessons Learned Case Studies

### Private Placement Memorandum

- Market Opportunity Section

### Imprint/Legal

- Incorporation Documents
- Good Standing Documents
- Partner Agreements

### Thesis & Pipeline

- 2 page Thesis Briefs covering Segement/Sector/Stage/Vehicle/Type
- Deal Sheets
  - 3 Example Deals from last year (firm would have done if in market)
  - 3 Example Pipeline Deals
  - 3 Anti-Portfolio Deals (could be passed, or missed because of lack of capital)
- Export or Spreadhseet of Current Pipeline
- Sourcing Advantages (networks, relationships, events)

### Double Click Materials

- Extended Slide Deck
- Extended Market Research

### Portfolio Model

- Portfolio Construction
- Sensitivity Analysis (based on Capital Raise/Amount)
- Pretend Returns Forecasts (realtime updates)

### LP Social Proof

- Spreadhseet/Export of Fundraise Pipeline (Redacted, Probability Weighted)
- Any letters of intent, letters of reference from LPs.
