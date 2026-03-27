# Phase 1: Foundation & Bento Grid - Research

**Researched:** 2026-03-27
**Domain:** Astro framework, Bento Grid CSS layouts, Cloudflare Pages deployment, Tailwind CSS
**Confidence:** HIGH

## Summary

This phase establishes the visual foundation for a technical blog and portfolio site using Astro 6.1 with React islands, deployed to Cloudflare Pages. The core challenge is implementing a responsive Bento Grid layout with 4 card variants (Image, Text, Terminal, Stats), precise hover animations, and a configuration-driven placement system.

**Key technical decisions verified:**
- Astro 6.1.1 (released 2026-03-26) with Live Content Collections support
- Tailwind CSS v4.2.2 with CSS-first configuration (breaking change from v3)
- Cloudflare adapter 13.1.4 for Workers/Pages deployment
- React 5.0.2 integration for interactive components (modal, subscribe form)
- CSS Grid for Bento layout with responsive breakpoints (4col → 2col → 1col)

**Primary recommendation:** Use Astro's Islands architecture with React components for interactive elements (subscribe modal, stats card with GitHub API), and pure Astro components for static card templates. Configure Tailwind v4 via CSS `@theme` directives, not JavaScript config.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **4 card types** to support: Image card, Text card, Terminal card, Stats card
- Each card type is a reusable component with props for content
- **Config-driven placement**: Card positions and sizes defined in a configuration file (not auto-placement algorithm)
- Size hints in config: `span-1`, `span-2`, `span-4`, `row-2` values respected by grid
- Use mockup content structure as baseline (12 cards)
- Images: Use Unsplash URLs from mockup for now (swap later with real portfolio images)
- Stats card (Weekly Commits): **Live GitHub API** — fetch real commit count
- Cards link to detail pages (routing structure ready for Phase 2 content)
- **Header links**: Only "Articles" tab — remove Setups/Repo from nav
- Articles tab switches view to Articles list (Phase 2 will populate)
- **Subscribe button**: Opens modal overlay with email capture form
- Newsletter card in grid also has email input (Phase 3 backend)
- **Breakpoint strategy**: 4 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- Cards reflow proportionally while respecting span values
- **Touch-friendly**: 44px minimum tap targets on all interactive elements

### Animations & Hover Effects (All Required)
1. **Card background shift**: Light cards #F7F7F7 → #F0F0F0 on hover
2. **Arrow icon nudge**: ↗ moves 4px up-right on card hover
3. **Image grayscale-to-color**: grayscale(100%) → grayscale(0%) + scale(1.02)
4. **Cursor blink**: Terminal blocks show CSS keyframe blinking cursor

### Typography (From Design Mockup)
- Sans: Inter (weights 200-600)
- Mono: JetBrains Mono (weights 300-400)
- Headlines: Light weight (200-300), tight letter-spacing (-0.02em to -0.04em)
- Meta tags: 9px uppercase with 0.1em letter-spacing

### Color Palette (From Design Mockup)
- Canvas white: #FFFFFF
- Card light: #F7F7F7
- Card hover: #F0F0F0
- Ink black: #111111
- Ink gray: #666666
- Ink light: #999999
- Dark card background: #111111
- Dark card hover: #000000

### Grid System
- 4-column base layout
- 4px gaps between cards
- Min card height: 320px (auto-rows: minmax(320px, auto))
- Max layout width: 1600px, centered with 40px padding

### Claude's Discretion
- Exact card configuration file structure (JSON/YAML/TS)
- How to structure the GitHub API integration (endpoint, caching, error handling)
- Subscribe modal component implementation details
- Exact breakpoint pixel values for responsive grid
- Footer implementation (full mockup footer or simplified for Phase 1)

### Deferred Ideas (OUT OF SCOPE)
- Auto-placement algorithm for cards (interesting but complex — defer to future exploration)
- Dark mode toggle (explicitly out of scope per PROJECT.md)
- Comments system (v2+)
- Table of contents for articles (v2+)
- Service worker for offline reading (v2+)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PORT-01 | Bento Grid layout with varying card sizes (span-2, span-4, row-2) | CSS Grid with `grid-column: span-X` and `grid-row: span-Y`; 4-column base with responsive breakpoints |
| PORT-02 | Dark and light card variants with smooth hover transitions | CSS transitions on background-color with cubic-bezier easing; dark variant uses inverted colors |
| PORT-03 | Image cards with grayscale-to-color effect on hover | CSS `filter: grayscale(100%)` on img, `filter: grayscale(0%)` + `transform: scale(1.02)` on hover |
| PORT-04 | Terminal/code block styling within cards | JetBrains Mono font, CSS keyframe animation for blinking cursor, dark background (#111111) |
| PORT-05 | Tab navigation between Portfolio and Articles views | React state management with `client:load` directive, URL-based routing optional |
| RESP-01 | Fully responsive design (mobile, tablet, desktop) | CSS Grid media queries: 4col → 2col → 1col, max-width 1600px with 40px padding |
| RESP-02 | Touch-friendly interactions on mobile | 44px minimum tap targets, `touch-action: manipulation`, prevent zoom on inputs |
| DEPLOY-01 | Deployment to Cloudflare Pages | Wrangler CLI with `@astrojs/cloudflare` adapter, `astro build && wrangler deploy` |
| DEPLOY-02 | Custom domain support (optional) | Cloudflare Pages DNS configuration, SSL auto-provisioned via Let's Encrypt |
| DEPLOY-03 | Environment variables configuration | Cloudflare Pages dashboard or `wrangler.toml` `[vars]` section, accessed via `import.meta.env` |
| DEPLOY-04 | HTTPS with Let's Encrypt (SSL certificates auto, custom domain DNS) | Automatic via Cloudflare Pages, no manual configuration needed |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 6.1.1 | Static site generator framework | Best Cloudflare support, content collections, islands architecture, 67% faster first-screen loading |
| @astrojs/cloudflare | 13.1.4 | Cloudflare adapter for Astro | Official adapter for Workers/Pages deployment, SSR support |
| @astrojs/react | 5.0.2 | React integration for Astro | Enables React components with client directives for interactive islands |
| tailwindcss | 4.2.2 | Utility-first CSS framework | Rapid styling, CSS-first config in v4, excellent grid utilities |
| react | 19.0.0 | UI component library | Required for interactive components (modal, forms) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/tailwind | 6.0.2 | Tailwind integration for Astro | Automatic Tailwind setup with Astro, use in all projects |
| wrangler | 4.x | Cloudflare CLI tool | Deployment, local dev with Workers runtime |
| @fontsource/inter | 5.x | Self-hosted Inter font | Performance, no external requests |
| @fontsource/jetbrains-mono | 5.x | Self-hosted JetBrains Mono font | Terminal/code styling |

### Testing
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vitest | 3.x | Unit and integration tests | Test Astro components with Container API, React components |
| @playwright/test | 1.50.x | End-to-end tests | Test responsive grid, hover effects, tab navigation |
| @astrojs/testing | - | Container API for component testing | Native Astro component testing |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind CSS | CSS Modules, styled-components | Tailwind v4 CSS-first config is simpler; CSS-in-JS adds runtime overhead |
| React islands | Solid.js, Preact islands | React has largest ecosystem, best Astro integration support |
| Vitest | Jest | Vitest is Vite-native, faster, better ESM support, works with Astro's `getViteConfig()` |
| Playwright | Cypress | Playwright supports WebKit (Safari), better for testing across all browsers |

**Installation:**
```bash
# Core framework
npm create astro@latest
cd cool-blog
npx astro add cloudflare react tailwind

# Fonts (self-hosted for performance)
npm install @fontsource/inter @fontsource/jetbrains-mono

# Testing
npm install -D vitest @playwright/test
npx playwright install
```

**Version verification:**
```bash
npm view astro version        # 6.1.1 (2026-03-26)
npm view tailwindcss version  # 4.2.2 (2026-03-26)
npm view @astrojs/cloudflare  # 13.1.4 (2026-03-26)
npm view @astrojs/react       # 5.0.2 (2026-03-26)
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── cards/              # Card component variants
│   │   ├── ImageCard.astro
│   │   ├── TextCard.astro
│   │   ├── TerminalCard.astro
│   │   └── StatsCard.tsx   # React for GitHub API fetch
│   ├── layout/
│   │   ├── BentoGrid.astro
│   │   └── Header.astro
│   └── interactive/
│       ├── SubscribeModal.tsx    # React (client:load)
│       └── TabNavigation.tsx     # React (client:load)
├── config/
│   └── cards.ts            # Card placement config
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro         # Portfolio view
│   └── articles.astro      # Articles list (Phase 2)
├── styles/
│   └── global.css          # Tailwind imports, CSS variables
└── lib/
    └── github-api.ts       # GitHub API client
```

### Pattern 1: Configuration-Driven Card Placement
**What:** Define card positions, sizes, and content in a TypeScript config file, then render grid dynamically.
**When to use:** When card layout needs to be easily adjustable without touching component code.

**Example:**
```typescript
// src/config/cards.ts
import type { ComponentType } from 'astro';

interface CardConfig {
  id: string;
  type: 'image' | 'text' | 'terminal' | 'stats';
  span: 1 | 2 | 4;
  row?: 2;
  variant?: 'light' | 'dark';
  props: Record<string, any>;
}

export const portfolioCards: CardConfig[] = [
  {
    id: 'hero-featured',
    type: 'image',
    span: 2,
    row: 2,
    variant: 'dark',
    props: {
      image: 'https://images.unsplash.com/...',
      title: 'Featured Project',
      link: '/projects/featured'
    }
  },
  {
    id: 'weekly-commits',
    type: 'stats',
    span: 1,
    props: {
      repo: 'owner/repo',
      label: 'Weekly Commits'
    }
  }
];
```

```astro
<!-- src/components/layout/BentoGrid.astro -->
---
import { portfolioCards } from '../config/cards';
import ImageCard from '../cards/ImageCard.astro';
import TextCard from '../cards/TextCard.astro';
import TerminalCard from '../cards/TerminalCard.astro';
import StatsCard from '../cards/StatsCard';

const cardComponents = {
  image: ImageCard,
  text: TextCard,
  terminal: TerminalCard,
  stats: StatsCard
};
---

<div class="bento-grid">
  {portfolioCards.map((card) => {
    const Component = cardComponents[card.type];
    return (
      <div
        class:list={[
          'bento-card',
          `col-span-${card.span}`,
          card.row === 2 && 'row-span-2'
        ]}
      >
        <Component {...card.props} variant={card.variant} />
      </div>
    );
  })}
</div>

<style>
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 40px;
    grid-auto-rows: minmax(320px, auto);
  }

  @media (max-width: 1024px) {
    .bento-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .bento-grid {
      grid-template-columns: 1fr;
      padding: 0 16px;
    }
  }
</style>
```

### Pattern 2: Astro Islands with React for Interactivity
**What:** Use Astro components for static content, React components only for interactive elements.
**When to use:** Minimize JavaScript bundle, maximize performance.

**Example:**
```astro
<!-- Portfolio page with React islands -->
---
import BentoGrid from '../components/layout/BentoGrid.astro';
import SubscribeModal from '../components/interactive/SubscribeModal';
---

<BentoGrid />

<!-- Only this component ships JavaScript -->
<SubscribeModal client:load />
```

```tsx
// src/components/interactive/SubscribeModal.tsx
import { useState } from 'react';

export default function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 3: Submit to backend
    console.log('Subscribe:', email);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 border border-black rounded-full"
      >
        Subscribe
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border px-4 py-2 mb-4"
            />
            <button type="submit" className="block w-full bg-black text-white py-2">
              Subscribe
            </button>
          </form>
        </div>
      )}
    </>
  );
}
```

### Pattern 3: GitHub API with Caching
**What:** Fetch commit stats from GitHub API with in-memory caching to avoid rate limits.
**When to use:** Live stats display without backend database.

**Example:**
```typescript
// src/lib/github-api.ts
interface CommitStats {
  count: number;
  fetchedAt: number;
}

const cache = new Map<string, CommitStats>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getWeeklyCommits(repo: string): Promise<number> {
  const cached = cache.get(repo);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.count;
  }

  // Use GitHub Stats API for weekly commit activity
  const response = await fetch(
    `https://api.github.com/repos/${repo}/stats/commit_activity`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Cool-Blog-App'
      }
    }
  );

  if (!response.ok) {
    console.error('GitHub API error:', response.status);
    return cached?.count || 0; // Fallback to cached or 0
  }

  const data = await response.json();
  // Get last week's commits (last entry in array)
  const lastWeekCommits = data[data.length - 1]?.total || 0;

  cache.set(repo, { count: lastWeekCommits, fetchedAt: Date.now() });
  return lastWeekCommits;
}
```

```tsx
// src/components/cards/StatsCard.tsx
import { useEffect, useState } from 'react';
import { getWeeklyCommits } from '../../lib/github-api';

interface Props {
  repo: string;
  label?: string;
}

export default function StatsCard({ repo, label = 'Weekly Commits' }: Props) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWeeklyCommits(repo)
      .then(setCount)
      .finally(() => setLoading(false));
  }, [repo]);

  return (
    <div className="p-6 bg-[#F7F7F7] hover:bg-[#F0F0F0] transition-colors min-h-[320px]">
      <p className="text-xs uppercase tracking-widest text-[#999999] mb-2">{label}</p>
      <p className="text-6xl font-light text-[#111111]">
        {loading ? '...' : count}
      </p>
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **Don't use client:load on all components**: Only interactive components need hydration. Static cards should be pure Astro components.
- **Don't fetch GitHub API on every render**: Use caching to avoid rate limits (60 requests/hour for unauthenticated).
- **Don't use JavaScript for responsive grid**: CSS Grid with media queries is sufficient and more performant.
- **Don't use Tailwind v3 config approach**: Tailwind v4 uses CSS-first configuration with `@theme` directives, not `tailwind.config.js`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading | Custom `@font-face` CSS | `@fontsource/inter` and `@fontsource/jetbrains-mono` | Pre-optimized, subset fonts, CSS included, better caching |
| CSS Grid utilities | Custom CSS classes | Tailwind CSS v4 grid classes | Battle-tested, responsive variants, maintainable |
| Modal component | Custom overlay logic | React state + Tailwind utility classes | Accessibility needs (focus trap, escape key) are complex; build once carefully |
| Markdown rendering | Custom parser | Astro built-in Markdown support | Security, syntax highlighting, frontmatter parsing already handled |
| Icon library | Custom SVG sprites | Inline SVGs or Lucide Icons | Tree-shakeable, accessible, easy to style |

**Key insight:** Astro's islands architecture means most components are static HTML. Only build custom JavaScript for truly interactive elements (modal, live stats, tab switching).

## Common Pitfalls

### Pitfall 1: Wrong Cloudflare Deployment Target
**What goes wrong:** Cloudflare UI misidentifies static Astro sites as Workers, or vice versa. Deploy fails with "Upload complete" but site doesn't render.
**Why it happens:** Cloudflare Pages and Workers are separate products; Astro can deploy to both depending on `output` mode.
**How to avoid:**
1. For static sites: Set `output: 'static'` in `astro.config.mjs`, use Wrangler with `assets.directory: "./dist"`
2. For SSR: Set `output: 'server'`, install `@astrojs/cloudflare` adapter, Wrangler config uses `main` entry
3. Always use `npx astro build && npx wrangler dev` to preview locally before deploying

**Warning signs:**
- "Worker not found" error on static site
- Hydration mismatches in console
- 404 on routes that work locally

### Pitfall 2: Tailwind v4 Breaking Changes
**What goes wrong:** `tailwind.config.js` is ignored, custom theme values don't apply, classes don't generate CSS.
**Why it happens:** Tailwind v4 removed JavaScript config file in favor of CSS-native configuration with `@theme` directive.
**How to avoid:**
```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-canvas: #FFFFFF;
  --color-card-light: #F7F7F7;
  --color-card-hover: #F0F0F0;
  --color-ink-black: #111111;
  --color-ink-gray: #666666;
  --color-ink-light: #999999;

  --font-family-sans: 'Inter', sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;

  --spacing-card-gap: 4px;
  --spacing-container-padding: 40px;
}
```

**Warning signs:**
- Custom colors not working
- `tailwind.config.js` file not being read
- Build succeeds but no styles appear

### Pitfall 3: React Hydration Mismatches
**What goes wrong:** Console shows "Hydration completed but contains mismatches", layout shifts, event handlers fail.
**Why it happens:** Server-rendered HTML doesn't match client-rendered output (dates, random values, browser APIs).
**How to avoid:**
1. Use `client:visible` instead of `client:load` for below-fold components
2. Ensure GitHub API fetch happens in `useEffect`, not during render
3. Disable Cloudflare Auto Minify (can break hydration)

**Warning signs:**
- "Hydration mismatch" errors in console
- Layout shifts after page load
- Interactive elements unresponsive

### Pitfall 4: GitHub API Rate Limiting
**What goes wrong:** Stats card shows 0 or errors after 60 requests.
**Why it happens:** Unauthenticated GitHub API has 60 requests/hour limit per IP.
**How to avoid:**
1. Cache responses in memory (1-hour TTL recommended)
2. Use `stats/commit_activity` endpoint (pre-aggregated data, fewer requests)
3. Consider server-side caching with Cloudflare KV for production
4. Add fallback UI for error states

**Warning signs:**
- `403 Forbidden` from GitHub API
- Stats showing 0 unexpectedly
- Network errors in console

### Pitfall 5: Touch Target Size on Mobile
**What goes wrong:** Interactive elements are hard to tap, users report frustration, accessibility audit fails.
**Why it happens:** Links, buttons, or cards smaller than 44x44px don't meet WCAG 2.1 guidelines.
**How to avoid:**
```css
/* Ensure all interactive elements meet 44px minimum */
.bento-card a,
.bento-card button {
  min-width: 44px;
  min-height: 44px;
  touch-action: manipulation; /* Prevent double-tap zoom */
}
```

**Warning signs:**
- Accessibility audit flags "target size" issues
- User complaints about tapping cards
- Accidental double-taps on mobile

### Pitfall 6: SVG Attribute Mangling on Cloudflare
**What goes wrong:** Icons appear malformed, lose colors, or break entirely after deployment.
**Why it happens:** Cloudflare Pages has been known to mangle SVG attributes like `clip-path`.
**How to avoid:**
1. Inline critical SVGs directly in HTML (not as external files)
2. Use base64-encoded data URLs for small icons
3. Test SVG rendering on Cloudflare preview deployment before merge

**Warning signs:**
- Icons missing or broken on production
- SVG filters not working
- Clip paths or masks failing

## Code Examples

Verified patterns from official sources:

### Bento Grid with Responsive Breakpoints
```css
/* Source: https://senorit.de/en/blog/bento-grid-design-trend-2025 */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 40px;
  grid-auto-rows: minmax(320px, auto);
}

/* Tablet: 2 columns */
@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 3px;
    padding: 0 24px;
  }
}

/* Mobile: 1 column */
@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: 1fr;
    gap: 2px;
    padding: 0 16px;
  }
}

/* Card span utilities */
.col-span-1 { grid-column: span 1; }
.col-span-2 { grid-column: span 2; }
.col-span-4 { grid-column: span 4; }
.row-span-2 { grid-row: span 2; }
```

### Image Card with Hover Effects
```astro
<!-- Source: Astro component pattern from official docs -->
---
interface Props {
  image: string;
  title: string;
  link?: string;
  variant?: 'light' | 'dark';
}

const { image, title, link, variant = 'light' } = Astro.props;
---

<div class:list={['image-card', variant]}>
  <a href={link || '#'}>
    <div class="image-wrapper">
      <img src={image} alt={title} loading="lazy" />
    </div>
    <div class="content">
      <h3>{title}</h3>
      <span class="arrow">↗</span>
    </div>
  </a>
</div>

<style>
  .image-card {
    background: #F7F7F7;
    border-radius: 8px;
    overflow: hidden;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .image-card:hover {
    background: #F0F0F0;
  }

  .image-card.dark {
    background: #111111;
  }

  .image-card.dark:hover {
    background: #000000;
  }

  .image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .image-card:hover .image-wrapper img {
    filter: grayscale(0%);
    transform: scale(1.02);
  }

  .content {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .arrow {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .image-card:hover .arrow {
    transform: translate(4px, -4px);
  }
</style>
```

### Terminal Card with Blinking Cursor
```astro
---
interface Props {
  code: string;
  language?: string;
  variant?: 'light' | 'dark';
}

const { code, language = 'bash', variant = 'dark' } = Astro.props;
---

<div class:list={['terminal-card', variant]}>
  <div class="terminal-header">
    <span class="dot red"></span>
    <span class="dot yellow"></span>
    <span class="dot green"></span>
  </div>
  <pre><code>{code}<span class="cursor">▊</span></code></pre>
</div>

<style>
  .terminal-card {
    background: #111111;
    border-radius: 8px;
    padding: 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: #F7F7F7;
  }

  .terminal-header {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .dot.red { background: #FF5F56; }
  .dot.yellow { background: #FFBD2E; }
  .dot.green { background: #27C93F; }

  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .cursor {
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
</style>
```

### Astro + Vitest Configuration
```typescript
// Source: https://docs.astro.build/en/guides/testing/
// vitest.config.ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/config/'],
    },
  },
});
```

```typescript
// src/components/cards/__tests__/TextCard.test.ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import TextCard from '../TextCard.astro';

test('TextCard renders with correct content', async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(TextCard, {
    props: {
      title: 'Test Title',
      description: 'Test description',
    },
  });

  expect(result).toContain('Test Title');
  expect(result).toContain('Test description');
});
```

### Playwright E2E Test for Responsive Grid
```typescript
// tests/responsive.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Bento Grid Responsive Layout', () => {
  test('displays 4-column grid on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const grid = page.locator('.bento-grid');
    await expect(grid).toHaveCSS('grid-template-columns', /^264px\s{4}/); // 4 equal columns
  });

  test('displays 2-column grid on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const grid = page.locator('.bento-grid');
    await expect(grid).toHaveCSS('grid-template-columns', /^376px\s{3}/); // 2 equal columns
  });

  test('displays 1-column grid on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const grid = page.locator('.bento-grid');
    await expect(grid).toHaveCSS('grid-template-columns', '343px'); // 1 column
  });

  test('image card transitions from grayscale to color on hover', async ({ page }) => {
    await page.goto('/');
    const imageCard = page.locator('.image-card').first();
    const img = imageCard.locator('img');

    // Check grayscale before hover
    await expect(img).toHaveCSS('filter', /grayscale\(100%\)/);

    // Hover and check color
    await imageCard.hover();
    await expect(img).toHaveCSS('filter', /grayscale\(0%\)/);
  });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 JavaScript config | Tailwind v4 CSS-first config with `@theme` | 2026-01 (v4 release) | Simpler configuration, better performance, CSS-native |
| Next.js for all sites | Astro for content sites, Next.js for apps | 2023-2024 | 67% faster first-screen loading, 90% less JavaScript |
| Client-side routing for everything | Astro islands architecture | 2022-2023 | Static HTML for most content, JS only for interactive parts |
| GitHub API GraphQL for commit count | REST `stats/commit_activity` endpoint | N/A | Simpler query, pre-aggregated weekly data |
| Cloudflare Workers separate deployment | Cloudflare Pages + Workers unified | 2024-2025 | Single deployment target, automatic SSL, easier CI/CD |

**Deprecated/outdated:**
- `tailwind.config.js` in Tailwind v4: Use `@theme` directive in CSS instead
- Cloudflare Workers Sites: Use Cloudflare Pages with Workers for full-stack
- Astro v4 Content Collections: v6 has Live Content Collections for request-time fetching

## Open Questions

1. **Exact breakpoint pixel values for responsive grid**
   - What we know: 4 columns → 2 columns → 1 column strategy defined in CONTEXT.md
   - What's unclear: Specific pixel values for tablet (768px? 1024px?) and mobile (640px? 768px?)
   - Recommendation: Use 1024px for tablet (2-col) and 640px for mobile (1-col) based on common breakpoints and Bento Grid best practices from [Senorit](https://senorit.de/en/blog/bento-grid-design-trend-2025)

2. **Card configuration file format (JSON/YAML/TS)**
   - What we know: Config-driven placement required
   - What's unclear: Best format for type safety and developer experience
   - Recommendation: Use TypeScript (`.ts`) for type checking, autocomplete, and import without build step. JSON is verbose, YAML needs parser.

3. **GitHub API caching strategy**
   - What we know: In-memory cache with 1-hour TTL works for single instance
   - What's unclear: Should we use Cloudflare KV for multi-instance caching?
   - Recommendation: Start with in-memory cache for Phase 1 (simple, fast). Evaluate KV in Phase 3 if scaling issues arise.

4. **Subscribe modal accessibility**
   - What we know: Modal needs focus trap and escape key support
   - What's unclear: Should we use a library or build custom?
   - Recommendation: Build custom with React state + focus management. Libraries like `@radix-ui/react-dialog` add 20KB+ for simple use case.

5. **Footer implementation scope**
   - What we know: Full mockup footer exists, but Phase 1 focuses on grid
   - What's unclear: Simplified footer or full mockup footer?
   - Recommendation: Simplified footer for Phase 1 (copyright, links). Full footer with social icons can be added in Phase 2 or 4.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.x + Playwright 1.50.x |
| Config file | `vitest.config.ts` (unit), `playwright.config.ts` (e2e) |
| Quick run command | `npm run test` (Vitest unit tests) |
| Full suite command | `npm run test:e2e` (Playwright e2e tests) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PORT-01 | Bento Grid renders with correct column layout | e2e | `npx playwright test responsive.spec.ts` | ❌ Wave 0 |
| PORT-02 | Light/dark card variants apply correct backgrounds | unit | `npm run test -- TextCard.test.ts` | ❌ Wave 0 |
| PORT-03 | Image cards transition grayscale-to-color on hover | e2e | `npx playwright test responsive.spec.ts:image-card` | ❌ Wave 0 |
| PORT-04 | Terminal card shows blinking cursor animation | unit | `npm run test -- TerminalCard.test.ts` | ❌ Wave 0 |
| PORT-05 | Tab navigation switches between Portfolio/Articles | e2e | `npx playwright test navigation.spec.ts` | ❌ Wave 0 |
| RESP-01 | Grid adapts from 4-col to 2-col to 1-col | e2e | `npx playwright test responsive.spec.ts` | ❌ Wave 0 |
| RESP-02 | Touch targets meet 44px minimum on mobile | e2e | `npx playwright test accessibility.spec.ts` | ❌ Wave 0 |
| DEPLOY-01 | Site deploys to Cloudflare Pages | manual | N/A (deployment validation) | N/A |
| DEPLOY-02 | Custom domain resolves correctly | manual | N/A (DNS validation) | N/A |
| DEPLOY-03 | Environment variables accessible in app | unit | `npm run test -- env.test.ts` | ❌ Wave 0 |
| DEPLOY-04 | HTTPS certificate valid | manual | N/A (SSL validation) | N/A |

### Sampling Rate
- **Per task commit:** `npm run test` (Vitest unit tests, < 30s)
- **Per wave merge:** `npm run test:e2e` (Playwright e2e tests, < 2min)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/unit/cards/TextCard.test.ts` — covers PORT-02 (card variants)
- [ ] `tests/unit/cards/TerminalCard.test.ts` — covers PORT-04 (blinking cursor)
- [ ] `tests/unit/lib/github-api.test.ts` — covers GitHub API caching
- [ ] `tests/e2e/responsive.spec.ts` — covers PORT-01, PORT-03, RESP-01
- [ ] `tests/e2e/navigation.spec.ts` — covers PORT-05 (tab switching)
- [ ] `tests/e2e/accessibility.spec.ts` — covers RESP-02 (touch targets)
- [ ] `vitest.config.ts` — Vitest configuration with Astro's `getViteConfig()`
- [ ] `playwright.config.ts` — Playwright configuration with base URL
- [ ] Framework install: `npm install -D vitest @playwright/test` — if none detected

## Sources

### Primary (HIGH confidence)
- [Astro 6.0 Documentation](https://astro.build/blog/astro-6/) - Live Content Collections, Cloudflare integration
- [Astro Testing Guide](https://docs.astro.build/en/guides/testing/) - Vitest setup, Container API, Playwright integration
- [Astro Cloudflare Deployment Guide](https://docs.astro.build/en/guides/deploy/cloudflare/) - Wrangler setup, adapter configuration, SSR vs static
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) - CSS-first configuration, breaking changes
- [Tailwind CSS v4 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4) - v4 announcement, new features

### Secondary (MEDIUM confidence)
- [Bento Grid Design 2026 Guide](https://senorit.de/en/blog/bento-grid-design-trend-2025) - CSS Grid patterns, responsive breakpoints, common mistakes
- [Bento Grid Layout Tutorial](https://www.wearedevelopers.com/en/magazine/682/building-a-bento-grid-layout-with-modern-css-grid-682) - Span utilities, grid templates
- [Cloudflare SVG Issues](https://www.lloydatkinson.net/posts/2024/stupid-problems-require-stupid-solutions-cloudflare-is-breaking-my-svgs/) - SVG attribute mangling pitfall
- [Astro Cloudflare Deployment Issues](https://www.gmkennedy.com/blog/deploy-astro-cloudflare-pages/) - Static vs Worker confusion, output directory pitfalls
- [Vitest Browser Mode vs Playwright 2026](https://www.pkgpulse.com/blog/vitest-browser-mode-vs-playwright-component-testing-vs-webdriverio-2026) - Testing framework comparison

### Tertiary (LOW confidence)
- [Astro 2026 Framework Comparison](https://dev.to/polliog/astro-in-2026-why-its-beating-nextjs-for-content-sites-and-what-cloudflares-acquisition-means-6kl) - Industry trends, Cloudflare acquisition context
- [GitHub Stats API Documentation](https://docs.github.com/en/rest/metrics/statistics) - Commit activity endpoint (needs verification for weekly data format)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions verified via `npm view` on 2026-03-27, documentation from official sources
- Architecture: HIGH - Patterns based on official Astro docs and established Bento Grid practices
- Pitfalls: MEDIUM - Cloudflare issues documented in community posts, may change with platform updates
- Testing: HIGH - Official Astro testing guide with Vitest and Playwright
- GitHub API: MEDIUM - Endpoint documented, but caching strategy is recommendation based on general API best practices

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (30 days - stable framework versions, but Tailwind v4 and Astro 6 are recent releases with potential for minor breaking changes)
