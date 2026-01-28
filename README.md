# Dark Matter Site

![Dark Matter Trademark](https://ik.imagekit.io/xvpgfijuw/Dark-Matter-Embeds/trademark__Dark-Matter--Dark-Mode.svg)

## Version 0.2.2 as of December 27, 2025

**New in 0.2.2:**
- Complete Open Graph and SEO infrastructure for messaging-first sharing
- Dynamic OG image generation with satori + resvg at `/api/og`
- JSON-LD structured data (WebSite, InvestmentFund, Article schemas)
- Collection-specific OG defaults for consistent sharing across page types
- Platform-optimized meta tags (WhatsApp, iMessage, LinkedIn, Slack, Discord, Twitter)

**v0.2.0 (Dec 26):**
- New layer of authentication for confidential access
- Modular slide deck architecture with 33 extracted section components
- Three.js visual components (Mitochondria, Cells, Human Body, Graph Networks)
- PageAsDeckWrapper layout with double-click and keyboard navigation
- Citation system with hex-code identifiers and hover popovers
- Strategy and thesis narrative pages rebuilt as composable slides

**v0.1.0 (Dec 13):** Confidential access, portfolio/pipeline pages, investment memo rendering.

<p align="center">
  <span style="font-size: 18px; font-weight: 500; color: #374151;">A modern web application built with</span>
  <span style="font-size: 20px; color: #ef4444; margin: 0 4px;">❤️</span>
  <span style="font-size: 18px; font-weight: 500; color: #374151;">by</span>
  <br/>
  <a href="https://lossless.group" target="_blank" rel="noopener" style="text-decoration: none; display: inline-flex; align-items: center; margin: 8px 0;">
    <img src="https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/trademark__The-Lossless-Group.svg?updatedAt=1758016855404" alt="The Lossless Group" height="24" style="margin-right: 8px;" />
    <span style="font-size: 22px; font-weight: 600; color: #1f2937;">The Lossless Group</span>
  </a>
  <br/>
  <span style="font-size: 14px; color: #6b7280; margin-top: 12px; display: block;">
    SSG and Styles with 
    <a href="https://astro.build" style="color: #7c3aed; text-decoration: none; font-weight: 500;">Astro</a> 
    and 
    <a href="https://tailwindcss.com" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">Tailwind CSS v4</a> 
    for <a href="https://darkmatter.bio/" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">Dark Matter Bio</a>
  </span>
</p>


# Stack

<p align="center">
  <a href="https://astro.build" target="_blank" rel="noopener">
    <img src="https://astro.build/assets/press/astro-logo-light-gradient.png" alt="Astro" height="48" />
  </a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://revealjs.com" target="_blank" rel="noopener">
    <img src="https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/trademark__Reveal--SizeMod--Light.svg?updatedAt=1758016291602" alt="RevealJS" height="48" />
  </a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tailwindcss.com" target="_blank" rel="noopener">
    <img src="https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/trademark__TailwindCSS--Lighter.webp?updatedAt=1758016076289" height="42" />
  </a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://threejs.org" target="_blank" rel="noopener">
    <img src="https://threejs.org/files/favicon.ico" alt="Three.js" height="48" />
  </a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://vitest.dev" target="_blank" rel="noopener">
    <span style="display:inline-flex;align-items:center;gap:8px">
      <img src="https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/trademark__Vitest.webp?updatedAt=1758016614303" alt="Vitest" height="48" />
    </span>
  </a>
</p>

<p align="center">
  Modern site generation, presentations, styling, testing, and 3D graphics.
</p>

---

## 🌐 Three.js for WebGL Graphics

This site uses [Three.js](https://threejs.org) for hardware-accelerated 3D graphics and particle systems. Three.js provides:

- **WebGL Abstraction** — Write high-level JavaScript instead of raw WebGL shaders
- **Particle Systems** — Create thousands of animated points with custom behaviors
- **Custom Shaders** — GLSL vertex and fragment shaders for unique visual effects
- **Performance** — GPU-accelerated rendering runs smoothly even with complex scenes
- **Cross-Platform** — Works on desktop and mobile browsers with WebGL support

### Current Components

**`ImageAbstract--Orb--Half.astro`** — A signature particle sphere based on Dark Matter brand assets:
- ~8000 particles distributed using golden spiral algorithm
- Central void/eye cutout creating an almond-shaped hole
- Custom shaders for soft circular particles with depth-based transparency
- Subtle rotation animation with configurable speed
- Additive blending for glowing effect

```astro
<ImageAbstractOrb
  size="400px"
  color="#9C85DF"
  rotationSpeed={0.3}
/>
```

### Future Possibilities

Three.js opens the door to:
- Interactive data visualizations
- Animated backgrounds and hero sections
- 3D product showcases
- Particle-based transitions between pages
- Scroll-driven 3D animations

---

## 🎴 Slide Deck and SlideShow Architecture

The strategy and thesis narrative pages use a modular slide deck architecture. Each section is extracted into its own reusable component, enabling presentation-style viewing and custom deck compositions.

### Reveal.js Library enables presentation-style navigation

The Reveal.js library is used to enable presentation-style navigation. It provides a set of tools for creating and managing presentations, including:

- **Navigation:** Double-click upper half → previous section, Double-click lower half → next section
- **Keyboard:** Arrow keys, Page Up/Down, Home/End
- **Section indicator:** Shows current/total in bottom-right

Reveal presentations are available at `slides/` directory and url.

However, the Reveal.js library is not used for the main site. Instead, the `PageAsDeckWrapper` layout is used to enable presentation-style navigation while preserving smooth scrolling.

### PageAsDeckWrapper

A wrapper layout enabling presentation-style navigation while preserving smooth scrolling:

```astro
import PageAsDeckWrapper from '@layouts/PageAsDeckWrapper.astro';

<PageAsDeckWrapper enableScrollSnap={true} showNavigationHints={true}>
  <SlideComponent1 />
  <SlideComponent2 />
  <SlideComponent3 />
</PageAsDeckWrapper>
```

**Navigation:**
- **Double-click** upper half → previous section
- **Double-click** lower half → next section
- **Keyboard:** Arrow keys, Page Up/Down, Home/End
- **Section indicator** shows current/total in bottom-right

### Slide Components

**33 total components** extracted from monolithic narrative pages:

| Path | Count | Content |
|------|-------|---------|
| `src/layouts/sections/narratives/slides/strategy/` | 17 | S01-WhyNowHero through S17-LPBenefits |
| `src/layouts/sections/narratives/slides/thesis/` | 16 | T01-AgingCrisisHero through T16-Closing |

### Test Pages

- `/strategy/reassembled` — All 17 strategy slides composed
- `/thesis/reassembled` — All 16 thesis slides composed

### Reveal Animation System

Components use IntersectionObserver-triggered animations:

```css
.reveal-item[data-reveal="fade-up"]    /* Translate up 40px */
.reveal-item[data-reveal="slide-right"] /* Translate from -60px */
.reveal-item[data-reveal="slide-left"]  /* Translate from +60px */
.reveal-item[data-reveal="scale-up"]    /* Scale from 0.85 */
```

Stagger delays via CSS custom property: `style="--delay: 200ms;"`

---

## 📝 Changelog as Git Submodule

The `changelog/` directory is managed as a **separate git repository** (submodule), enabling:

- **Independent Version Control** — Changelog history is tracked separately from site code
- **Cross-Repository Collaboration** — Team members can update the changelog without touching the main codebase
- **Selective Sharing** — The changelog can be shared with stakeholders who don't need access to source code
- **Clean Commit History** — Documentation changes don't clutter the main repository's git log
- **Reusability** — The same changelog can be mounted in multiple projects or documentation sites

The changelog is also registered as an **Astro content collection** using a `glob` loader that points outside `src/`:

```ts
// src/content/changelog/changelog.config.ts
loader: glob({
  pattern: '**/*.md',
  base: '../../changelog',
}),
```

This allows changelog entries to be queried and rendered as pages while keeping the content in its own repository.

---

## 🗄️ NocoDB API Integration

The site uses [NocoDB](https://nocodb.com) as a cloud-hosted database for dynamic content and access tracking. NocoDB provides a spreadsheet-like interface for non-technical team members while exposing a REST API for the site.

### Configuration

Required environment variables:

```bash
# NocoDB API token (from Account Settings)
NOCODB_API_KEY=your_api_token_here

# Optional: Override defaults
NOCODB_BASE_URL=https://app.nocodb.com  # Default
NOCODB_BASE_ID=your_base_id             # Default provided
```

### Tables

| Table | Purpose |
|-------|---------|
| `organizations` | Portfolio companies with logos, descriptions, URLs |
| `materials` | Investment memos and documents |
| `emailAccess` | Session tracking for confidential content access |

### Features

**Portfolio Data**
- Fetches company information at build time or runtime
- Parses trademark/logo JSON for mode-aware assets (light/dark/vibrant)
- Graceful fallback to static JSON when API not configured

**Caching**
- 5-minute TTL in-memory cache
- Reduces API calls during development and SSR

**TypeScript Types**
- Full type definitions for all NocoDB responses
- `PortfolioCompany` interface for rendering

```typescript
import { getPortfolioCompanies, isNocoDBConfigured } from '@lib/nocodb';

// Check if configured before fetching
if (isNocoDBConfigured()) {
  const companies = await getPortfolioCompanies();
}
```

---

## 🔗 Open Graph & SEO System

The site implements a comprehensive Open Graph and SEO system optimized for messaging-first sharing. When links are shared via iMessage, WhatsApp, LinkedIn, or Slack, rich previews are generated automatically.

### Configuration

Centralized in `src/config/seo.ts`:

```typescript
export const SITE_SEO: SiteSEO = {
  siteName: 'Dark Matter',
  siteUrl: 'https://matter-site.vercel.app',
  defaultTitle: 'Dark Matter | Bio Longevity Fund',
  defaultDescription: 'Investing in the science of longevity...',
  defaultImage: '/share-banners/shareBanner__Dark-Matter-Bio_Longevity-Fund-II.webp',
  themeColor: '#0f0f23',
  locale: 'en_US',
};
```

### Collection Defaults

Each page type has default OG settings:

```typescript
import { COLLECTION_DEFAULTS } from '@config/seo';

// Available collections: thesis, strategy, portfolio, pipeline,
//                        memos, slides, changelog, team, dataroom

<BaseThemeLayout
  title="Investment Strategy"
  meta={{
    title: 'Investment Strategy',
    description: COLLECTION_DEFAULTS.strategy.description,
    image: COLLECTION_DEFAULTS.strategy.image,
    type: COLLECTION_DEFAULTS.strategy.type,
  }}
>
```

### Dynamic OG Image Generation

Server-side image generation at `/api/og`:

```
GET /api/og?title=My+Title&description=...&category=Blog&author=Name
```

Returns a 1200x630 PNG with Dark Matter branding. Uses satori + resvg with bundled Inter font.

### JSON-LD Structured Data

Schema.org builders for Google rich results:

```typescript
import { buildWebSiteSchema, buildInvestmentFundSchema } from '@utils/structured-data';

const schemas = [
  buildWebSiteSchema(siteUrl),
  buildInvestmentFundSchema({ siteUrl, focusAreas: ['Longevity Science'] }),
];

<BoilerPlateHTML jsonLd={schemas}>
```

Available builders: `buildWebSiteSchema`, `buildOrganizationSchema`, `buildInvestmentFundSchema`, `buildArticleSchema`, `buildPersonSchema`, `buildBreadcrumbSchema`.

### Platform Optimization

Character limits enforced for cross-platform compatibility:
- **Title:** 60 characters
- **Description:** 155 characters
- **Site name:** 30 characters

All image URLs are converted to absolute HTTPS (required by WhatsApp, iMessage).

### File Structure

```
src/
├── config/seo.ts           # SITE_SEO, COLLECTION_DEFAULTS
├── utils/
│   ├── og.ts               # buildOgMeta(), buildCanonical()
│   └── structured-data.ts  # JSON-LD schema builders
└── pages/api/og.ts         # Dynamic image endpoint
```

### Blueprint Reference

See `context-v/Maintain-an-Elegant-Open-Graph-System.md` for the complete specification.

---

## 📚 Citation System

The site implements a citation system for referencing research sources in narrative content. Citations use **hex codes** as stable identifiers that get converted to sequential integers at render time.

### Why Hex Codes?

Traditional `[1]`, `[2]`, `[3]` numbering breaks when:
- Content is modular (same research appears on multiple pages)
- Citations are reused across documents
- Content is updated (adding/removing shifts all numbers)

Hex codes like `[^hi3ous]` provide stability and portability.

### Components

**`InlineCitation.astro`** — Renders a citation marker with hover popover:

```astro
import InlineCitation from '@components/citations/InlineCitation.astro';

const citation = {
  index: 1,
  hexCode: 'hi3ous',
  title: 'Stanford Medicine Center for Longevity and Healthy Aging',
  url: 'https://aging.stanford.edu',
  source: 'Stanford Medicine',
  publishedDate: '2025-12-12'  // ISO format
};

<p>Deep relationships with Stanford<InlineCitation {...citation} /></p>
```

The popover displays the title, source, formatted date, and a "View Source" link.

### Date Formatting Utility

Dates are stored in ISO format (`YYYY-MM-DD`) and displayed using the `@lib/dates` utility:

```typescript
import { formatDate, formatCitationDate } from '@lib/dates';

// Citation format (default): "2025, Dec 26"
formatCitationDate('2025-12-26')

// Other formats
formatDate('2025-12-26', 'full')       // "December 26, 2025"
formatDate('2025-12-26', 'short')      // "Dec 26, 2025"
formatDate('2025-12-26', 'monthYear')  // "December 2025"
formatDate('2025-12-26', 'relative')   // "2 days ago"

// Custom patterns
formatDate('2025-12-26', { pattern: 'MMM YYYY' })  // "Dec 2025"
```

**Available Presets:** `iso`, `citation`, `full`, `short`, `monthYear`, `monthYearShort`, `yearOnly`, `us`, `eu`, `relative`

**Pattern Tokens:** `YYYY`, `YY`, `MMMM`, `MMM`, `MM`, `M`, `DD`, `D`

### File Structure

```
src/
├── components/citations/
│   ├── InlineCitation.astro    # Hover popover citation marker
│   ├── Sources.astro           # Full sources list
│   ├── SourcesCompact.astro    # Compact sources display
│   └── CitedSection.astro      # Wrapper for sections with citations
├── lib/
│   ├── citations/
│   │   └── types.ts            # CitationReference interface
│   └── dates/
│       ├── convertRawDatesToPreferredFormats.ts
│       └── index.ts            # Barrel export
└── content/narratives/
    └── section--*.md           # Markdown with citation data in frontmatter
```

### Architecture Reference

See `context-v/Citation-System-Architecture.md` for the complete specification including the global popover pattern that solves `overflow: hidden` clipping issues.

---

## 🔐 Authentication & Access Control

The site implements a multi-tier authentication system for protecting confidential investment materials.

### Access Tiers

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PUBLIC CONTENT                               │
│  /, /thesis, /strategy, /portfolio, /pipeline, /team                │
│  No authentication required                                          │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LEVEL 1: EMAIL GATE                               │
│  /portfolio-gate → /portfolio/confidential                          │
│                                                                      │
│  • User submits email address                                        │
│  • Session created in NocoDB (emailAccess table)                    │
│  • Auth cookie set (24-hour expiry)                                 │
│  • Heartbeat tracking for session duration                          │
│                                                                      │
│  Auto-approved domains: darkmatter.vc, lossless.group               │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LEVEL 2: PASSCODE GATE                           │
│  /portfolio/confidential/[company]/gate → /portfolio/confidential/[company] │
│                                                                      │
│  • Company-specific passcode required                               │
│  • Grants access to detailed investment memos                       │
│  • Markdown-rendered documents with financials                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

**Level 1: Email Verification**

1. User navigates to `/portfolio-gate`
2. Submits email address via form
3. `POST /api/verify-temp-access`:
   - Creates session record in NocoDB with `sessionStartTime`
   - Generates SHA-256 session token
   - Sets cookies: `universal_portfolio_access`, `accessor_email`, `session_record_id`
4. Redirects to `/portfolio/confidential`

**Session Heartbeat**

While viewing confidential content, a heartbeat component (`SessionHeartbeat.astro`) periodically pings the server:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        HEARTBEAT PATTERN                             │
│                                                                      │
│  Page Load → Immediate heartbeat                                    │
│      │                                                               │
│      ├──► Every 3 minutes: PATCH sessionEndTime                     │
│      │                                                               │
│      ├──► Tab hidden: Pause heartbeats                              │
│      │                                                               │
│      ├──► Tab visible: Resume + immediate heartbeat                 │
│      │                                                               │
│      └──► Page unload: sendBeacon final heartbeat                   │
│                                                                      │
│  Result: sessionEndTime - sessionStartTime = viewing duration       │
└─────────────────────────────────────────────────────────────────────┘
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/verify-temp-access` | POST | Email gate → create session, set cookies |
| `/api/verify-email` | POST | Check if email is allowed (domain/approval) |
| `/api/verify-portfolio-passcode` | POST | Level 2 passcode verification |
| `/api/session-heartbeat` | POST | Update sessionEndTime for duration tracking |

### Cookies

| Cookie | HttpOnly | Purpose |
|--------|----------|---------|
| `universal_portfolio_access` | Yes | Auth token for confidential access |
| `accessor_email` | Yes | Email for server-side reference |
| `session_record_id` | No | NocoDB record ID for heartbeat tracking |

### Domain Auto-Approval

Configure via `ALLOWED_EMAIL_DOMAINS` environment variable (comma-separated):

```bash
ALLOWED_EMAIL_DOMAINS=darkmatter.vc,lossless.group,trusted-partner.com
```

Emails from these domains bypass approval workflows and get instant access.

---

## 📄 Investment Memo System (GitHub Content Fetcher)

The site fetches investment memos from a **private GitHub repository** at runtime (SSR), keeping confidential content out of static builds. This allows memos to be updated in GitHub without redeploying the site.

### Configuration

Required environment variables:

```bash
# Fine-grained PAT with read-only Contents access to the private repo
GITHUB_CONTENT_PAT=github_pat_xxxx

# Optional: Override defaults
GITHUB_CONTENT_OWNER=lossless-group        # Default
GITHUB_CONTENT_REPO=dark-matter-secure-data # Default
GITHUB_CONTENT_BRANCH=main                  # Default

# Local development: read from orchestrator directory instead of GitHub
MEMO_DISCOVERY_LOCAL=true
```

### How It Works

1. **URL → Slug**: `/memos/[slug].astro` receives a slug like `MitrixBio-v0.0.2-draft`
2. **Auth Check**: Requires `universal_portfolio_access` cookie (set via `/portfolio-gate`)
3. **Fetch**: The slug is parsed to derive the GitHub path and fetch the markdown content

### GitHub Repository Structure

Memos are organized in a versioned directory structure:

```
deals/
├── MitrixBio/
│   └── outputs/
│       ├── MitrixBio-v0.0.1/
│       │   └── MitrixBio-v0.0.1-draft.md
│       └── MitrixBio-v0.0.2/
│           └── MitrixBio-v0.0.2-draft.md
├── Aito/
│   └── outputs/
│       └── Aito-v0.0.2/
│           └── Aito-v0.0.2-draft.md
└── RavenGraph/
    └── outputs/
        └── RavenGraph-v0.0.3/
            └── 6-RavenGraph-v0.0.3.md
```

### Slug → Path Derivation

The system handles multiple slug formats:

| Slug Format | Derived GitHub Path |
|-------------|---------------------|
| `Aito-v002-draft` (URL-safe) | `deals/Aito/outputs/Aito-v0.0.2/Aito-v0.0.2-draft.md` |
| `Class5-Global-v0.0.2-draft` (dotted) | `deals/Class5-Global/outputs/Class5-Global-v0.0.2/Class5-Global-v0.0.2-draft.md` |
| `6-RavenGraph-v0.0.3` (numbered) | `deals/RavenGraph/outputs/RavenGraph-v0.0.3/6-RavenGraph-v0.0.3.md` |

### Latest Version Discovery

When you need the "latest" memo for a company (e.g., for portfolio links), the system:

1. Lists `deals/{CompanyName}/outputs/` directory
2. Finds all version directories (e.g., `MitrixBio-v0.0.1`, `MitrixBio-v0.0.2`)
3. Parses and sorts versions semantically (v0.0.2 > v0.0.1)
4. Looks inside the latest version directory for the draft file
5. Returns the slug of the highest-versioned memo

```typescript
import { getLatestMemoSlug, resolveLatestMemos } from '@lib/github-content';

// Get latest for one company
const slug = await getLatestMemoSlug('MitrixBio');
// Returns: "MitrixBio-v0.0.2-draft"

// Batch resolve for multiple companies
const memos = await resolveLatestMemos(['MitrixBio', 'Aito', 'RavenGraph']);
// Returns: Map { 'MitrixBio' => 'MitrixBio-v0.0.2-draft', ... }
```

### Caching

To reduce GitHub API calls:
- **Content cache**: 5 minutes TTL
- **Latest memo cache**: 10 minutes TTL

### Markdown Rendering Pipeline

Memos use the same full-featured markdown pipeline as changelog entries:

- **GitHub Flavored Markdown** — Tables, strikethrough, task lists
- **Shiki syntax highlighting** — Dual themes (github-light/tokyo-night)
- **Mermaid diagrams** — Rendered client-side with Dark Matter theming
- **ContentEnhancer** — Code block headers with copy buttons

### Citation Support

Memos support the hex-code citation system. Add citations to frontmatter:

```yaml
---
title: Investment Memo
company: Acme Corp
citations:
  mkt001:
    title: "Market Analysis Report 2024"
    url: "https://example.com/report"
    source: "Gartner"
    publishedDate: "2024-06-15"
  tech002:
    title: "Technology Trends"
    url: "https://example.com/tech"
    source: "MIT Technology Review"
    publishedDate: "2024-03-22"
---
```

Citations are automatically rendered as a Sources section at the bottom of the memo.

### Local Development Mode

When `GITHUB_CONTENT_PAT` is not set (or `MEMO_DISCOVERY_LOCAL=true`), the system reads from:

```
/Users/mpstaton/code/lossless-monorepo/ai-labs/investment-memo-orchestrator/io/dark-matter/deals/
```

This allows testing memo rendering without GitHub API access.

### File Structure

```
src/
├── lib/
│   ├── github-content.ts    # Core fetching logic, version discovery, caching
│   └── citations/
│       └── types.ts         # Citation system types and helpers
├── pages/
│   └── memos/
│       └── [slug].astro     # SSR page that renders memos
├── components/
│   ├── content/
│   │   └── ContentEnhancer.astro  # Code block and Mermaid enhancement
│   └── citations/
│       └── InlineCitation.astro   # Hover popover citation marker
└── content/
    └── markdown-memos/      # Local fallback files for testing
```

---

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more about Astro?

Feel free to check out [Astro Documentation](https://docs.astro.build) or jump into the Astro [Discord server](https://astro.build/chat).
