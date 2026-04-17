# Cool Blog

> 配置驱动的个人博客，内置 MCP Server，AI 聊完直接发

![Cool Blog](docs/screenshots/article-detail-full.png)

## Live Demo

[https://cool-blog.aries10011.workers.dev](https://cool-blog.aries10011.workers.dev)

## Why Cool Blog?

- **One Article, Two Views** — 同一篇文章加 `"Project"` tag 上首页 portfolio，不加就在 `/articles`。不用维护两套内容。
- **Config-Driven Portfolio** — 卡片大小、颜色深浅、排列模式全部在 `portfolio.ts` 里配。改配置文件，不改组件代码。
- **AI-Native Workflow** — 内置 MCP Server。和 Claude 聊完，让它直接创建文章，博客自动更新。

## Workflow

```
  Claude / Agent  ──MCP──▶  Cool Blog API  ──▶  你的博客
  (讨论、起草)              (创建/发布)          (portfolio + articles)
```

和 AI 讨论出一个想法，让它调用 MCP Server 创建文章，博客自动渲染。推荐直接把仓库地址发给 Agent 让它自己配置。

## Features

- **Modern Stack** — Astro 6, TypeScript, Tailwind CSS 4, React 19
- **Config-Driven** — Portfolio layout controlled by `portfolio.ts`, styling by CSS variables
- **Database-Driven** — Neon PostgreSQL + Drizzle ORM
- **MCP Server** — AI assistant integration for article management
- **Search** — Client-side fuzzy search with Fuse.js
- **Newsletter** — Email subscriptions via Resend
- **Analytics** — Privacy-friendly visitor tracking
- **Bento Grid** — Responsive card-based design
- **Hybrid Rendering** — SSR + static generation
- **Type-Safe** — Full TypeScript coverage

## Quick Start

### Prerequisites

- Node.js 22+
- A [Neon](https://neon.tech) account (free tier)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/cool-blog.git
cd cool-blog
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Required
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Optional
GITHUB_TOKEN=your_github_token
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=newsletter@yourdomain.com
MCP_API_KEY=ckb_your_generated_key
```

### 3. Run

```bash
npm run dev
```

Visit `http://localhost:4321`

## Project Structure

```
cool-blog/
├── src/
│   ├── components/       # React & Astro components
│   ├── config/           # Site configuration & branding
│   ├── db/               # Database schema & connection
│   ├── lib/              # Utilities, MCP server, search
│   └── pages/            # Astro pages & API routes
├── public/               # Static assets
├── scripts/              # Build & migration scripts
└── tests/                # E2E tests
```

## Key Technologies

| Category | Technology |
|----------|-----------|
| **Framework** | Astro 6 |
| **Language** | TypeScript |
| **Database** | Neon PostgreSQL + Drizzle ORM |
| **Styling** | Tailwind CSS 4 |
| **UI** | React 19 |
| **Search** | Fuse.js |
| **Email** | Resend |
| **Testing** | Playwright + Vitest |
| **Deployment** | Cloudflare Workers / Zeabur |

## How It Works: Two Modules

This blog has two distinct content modules that share the same database:

```
┌─────────────────────────────────────────────────────────┐
│                    articles table                        │
│  (Neon PostgreSQL — single source of truth)              │
│                                                          │
│  columns: title, slug, body, tags[], image, status ...   │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
     tags contains "Project"     status = "published"
           │                          │
           ▼                          ▼
   ┌───────────────┐          ┌──────────────┐
   │   Portfolio   │          │   Articles   │
   │   (Homepage)  │          │   (/articles)│
   │               │          │              │
   │  Bento Grid   │          │  Card List   │
   │  with modal   │          │  + detail    │
   └───────────────┘          └──────────────┘
```

- **Portfolio** — Homepage bento grid. Shows articles tagged `"Project"`. Tagged `"featured"` for prominent display.
- **Articles** — Blog listing at `/articles`. Shows all published articles.

An article can appear in both places (add both `"Project"` tag and set `status = 'published'`).

## Customization Guide

### Configuration File Map

All user-facing configuration lives in `src/config/`. Here's how the files connect:

```
src/config/
├── branding.ts    ← Your name, site title, tagline (the "who")
│       │
│       ▼
├── content.ts     ← Page metadata (SEO titles, descriptions) — reads from branding
│
├── portfolio.ts   ← Portfolio display rules (the "how it looks")
│       │              Controls: card sizing, variety patterns, tag filters, fallbacks
│       │
│       ▼
└── cards.ts       ← Card type definitions (CardConfig shape)
                     Used by BentoGrid, TextCard, ImageCard components
```

### 1. Branding — Who Are You?

**File:** `src/config/branding.ts`

This file controls your identity across the entire site. It has two modes:

| Mode | When Active | What to Edit |
|------|-------------|--------------|
| **Personal** | `PUBLIC_SITE_URL` contains your domain, or `PUBLIC_IS_PERSONAL_SITE=true` | `productionBranding` object |
| **Template** | localhost, or `PUBLIC_USE_TEMPLATE_BRANDING=true` | `templateBranding` object |

**Fields you can customize:**

```typescript
// src/config/branding.ts
const productionBranding: BrandConfig = {
  siteName: 'Your Name',              // Browser tab short name
  siteTitle: 'Your Name | TAGLINE',   // Full page title (home)
  siteDescription: 'Your bio.',       // Meta description for SEO
  brandTitle: 'Your Name',            // Header — left side text
  brandSubtitle: 'YOUR TAGLINE',      // Header — right side text
  footerBrand: 'INITIALS',            // Footer — e.g., "YN"
  authorName: 'YOUR NAME',            // Footer — author credit
  authorTagline: 'Your tagline'       // Footer — subtitle
};
```

You can also use the helper for partial overrides:

```typescript
import { getCustomBranding } from './branding';
const myBrand = getCustomBranding({ brandTitle: 'New Name' });
```

**Don't forget:** Also update `site` in `astro.config.mjs` to your actual domain:

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://your-domain.com',  // Change this
});
```

### 2. Social Links

**File:** `src/components/layout/Footer.astro`

Edit the `socialLinks` array in the component's frontmatter:

```typescript
// src/components/layout/Footer.astro (frontmatter section)
const socialLinks = [
  { id: 'github', name: 'GitHub', url: 'https://github.com/yourname', icon: 'github' },
  { id: 'website', name: 'Website', url: 'https://yoursite.com', icon: 'website' },
  // Add more links — each needs a matching icon branch in the template
];
```

Supported built-in icons: `'github'`, `'website'`. For custom icons, add a new branch in the SVG conditional in the template section.

### 3. Navigation Tabs

**File:** `src/components/interactive/TabNavigation.tsx`

The top navigation tabs are defined in the `tabs` array:

```typescript
// src/components/interactive/TabNavigation.tsx
const tabs = [
  { label: 'Portfolio', href: '/' },       // Homepage bento grid
  { label: 'Articles', href: '/articles' }, // Blog listing
];
```

Add or remove tabs to match your site structure. The active tab highlights automatically based on the current URL path.

### 4. Portfolio — What Appears on the Homepage

This is the most detailed configuration. There are two layers: **content** (which articles) and **layout** (how they look).

#### 4a. Content — Adding Articles to the Portfolio

Articles come from the database. To make an article appear in the portfolio bento grid:

| Action | How | Effect |
|--------|-----|--------|
| Add to portfolio | Set `tags` to include `"Project"` | Article appears in the bento grid |
| Feature it | Also add `"featured"` tag | Card becomes span-2, more prominent |
| Set explicit image | Set the `image` field to a URL | Card uses this image |
| Auto-extract image | Leave `image` null, include `![](url)` in body | First image from markdown is used |
| Hide from portfolio | Add `"draft"` or `"archived"` tag | Excluded even if it has `"Project"` tag |
| Remove from portfolio | Remove `"Project"` tag | Only appears in `/articles`, not homepage |

**Database fields that matter for portfolio cards:**

```
articles table
├── title       → Card headline
├── slug        → Card ID and URL
├── excerpt     → Card body text (short description)
├── image       → Card image (explicit URL, or auto-extracted from body)
├── tags[]      → Controls inclusion and featured status
├── date        → Sort order (newer first)
└── status      → Must be "published"
```

You can manage articles via:
1. **MCP Server** — AI assistant integration ([setup guide](docs/MCP_SETUP_GUIDE.md))
2. **Direct SQL** — Insert into the `articles` table
3. **API** — RESTful endpoints (with API key)

#### 4b. Layout — Configuring the Bento Grid

**File:** `src/config/portfolio.ts`

This file controls how portfolio cards look and behave. The config is validated by Zod — if you make a typo, the app will tell you.

```typescript
// src/config/portfolio.ts
export const portfolioConfig: PortfolioConfig = {
  // ── Which articles appear ──
  tagFilter: ['Project'],           // Required tags (must have at least one)
  excludeTags: ['draft', 'archived'], // Disqualifying tags
  featuredTag: 'featured',          // Tag for prominent display
  maxFeatured: 3,                   // Max featured cards (rest become standard)

  // ── Card sizes ──
  sizing: {
    featured: { span: 2, row: 2, variant: 'image' },  // Featured cards: 2-col, 2-row, image
    standard: { span: 1, variant: 'text' },             // Standard cards: 1-col, text
  },

  // ── What to show when data is missing ──
  fallback: {
    whenNoArticles: 'animation',  // 'animation' | 'empty' | 'placeholder'
    whenNoImage: 'text',          // 'text' | 'placeholder' | 'hide'
  },

  // ── Visual variety for non-featured cards ──
  variety: {
    spanCycle: [1, 2, 1, 1, 2, 4],       // Column width pattern (repeats)
    variantCycle: ['dark', 'light', ...],  // Color theme pattern (repeats)
    rowPatterns: [undefined, 2, ...],      // Row height pattern (undefined = 1 row)
    imageCycle: [false, false, ...],       // true = show image, false = force text-only
  }
};
```

**How variety cycles work:** Non-featured cards cycle through these arrays based on their index. For example, with `spanCycle: [1, 2, 1, 1, 2, 4]`:
- Card 0 → span 1
- Card 1 → span 2
- Card 2 → span 1
- Card 3 → span 1
- Card 4 → span 2
- Card 5 → span 4
- Card 6 → back to span 1 (cycle repeats)

The same pattern applies to `variantCycle`, `rowPatterns`, and `imageCycle`.

**Max articles:** The grid shows up to 12 articles. To change this, modify the `.slice(0, 12)` in `mapArticlesToCards()`.

#### 4c. Card Types

**File:** `src/config/cards.ts`

Each card in the grid has this shape:

```typescript
interface CardConfig {
  id: string;           // Unique identifier
  type: 'image' | 'text' | 'terminal' | 'stats';  // Card component to render
  span: 1 | 2 | 4;     // Column width (4-column grid)
  row?: 2;             // Optional: span 2 rows
  variant?: 'light' | 'dark';  // Color scheme
  props: {
    title?: string;     // Headline
    body?: string;      // Description
    image?: string;     // Image URL (for image cards)
    metaTag?: string;   // Small label above title
    link?: string;      // Click target URL
  };
}
```

The bento grid is 4 columns wide:
- `span: 1` = quarter width
- `span: 2` = half width
- `span: 4` = full width

### 5. Styling — Colors, Fonts, Spacing

**File:** `src/styles/global.css`

The project uses Tailwind CSS v4 with CSS-native configuration. All design tokens are CSS custom properties, defined in both `:root` and `@theme {}` (for Tailwind).

**Color palette:**

```css
/* src/styles/global.css */
:root {
  --color-canvas-white: #FFFFFF;      /* Page background */
  --color-card-light: #F7F7F7;        /* Light card background */
  --color-card-hover: #F0F0F0;        /* Card hover state */
  --color-ink-black: #111111;         /* Primary text */
  --color-ink-gray: #666666;          /* Secondary text */
  --color-ink-light: #999999;         /* Tertiary text */
  --color-dark-card-bg: #111111;      /* Dark card background */
  --color-dark-card-hover: #000000;   /* Dark card hover */
}
```

To change the color scheme, update values in **both** `:root {}` and `@theme {}` blocks (they should match).

**Typography:**

```css
--font-family-sans: 'Inter', system-ui, sans-serif;       /* Body text */
--font-family-mono: 'JetBrains Mono', monospace;           /* Code, terminal */
```

Fonts are bundled via `@fontsource` packages — no Google Fonts CDN dependency.

**Layout and spacing:**

```css
--spacing-card-gap: 4px;              /* Gap between bento cards */
--spacing-container-padding: 40px;     /* Page edge padding */
--layout-max-width: 1600px;            /* Max page width */
--layout-min-card-height: 320px;       /* Minimum card height */
```

**Animations:**

```css
--transition-timing: cubic-bezier(0.4, 0, 0.2, 1);   /* Standard easing */
--transition-duration: 300ms;                           /* Hover transitions */
--ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);      /* Card scale animation */
```

### 6. Environment Variables

**File:** `.env.example` → copy to `.env.local`

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Neon Postgres connection string |
| `PUBLIC_SITE_URL` | No | Your domain — controls branding mode and meta tags |
| `PUBLIC_IS_PERSONAL_SITE` | No | Set `'true'` to use personal branding config |
| `PUBLIC_USE_TEMPLATE_BRANDING` | No | Force template branding (for development) |
| `GITHUB_TOKEN` | No | GitHub PAT for higher API rate limits (stats card) |
| `RESEND_API_KEY` | No | Resend API key for newsletter emails |
| `RESEND_FROM_EMAIL` | No | Sender email for newsletter |
| `MCP_API_KEY` | No | API key for the MCP server endpoint |

### Quick Customization Checklist

To make this blog your own:

1. [ ] Edit `productionBranding` in `src/config/branding.ts` — your name and tagline
2. [ ] Edit `socialLinks` in `src/components/layout/Footer.astro` — your links
3. [ ] Edit `site` in `astro.config.mjs` — your domain
4. [ ] Set `PUBLIC_SITE_URL` and `DATABASE_URL` in `.env.local`
5. [ ] Add articles to the database with `"Project"` tag for portfolio
6. [ ] Adjust `variety` in `src/config/portfolio.ts` if you want different card patterns
7. [ ] Update colors in `src/styles/global.css` (both `:root` and `@theme` blocks)

## MCP Server

Built-in MCP server for AI-powered content management. Available tools:

| Tool | Description |
|------|-------------|
| `create_article` | Create new articles |
| `update_article` | Update existing articles |
| `delete_article` | Remove articles |
| `list_articles` | List all articles |
| `get_article` | Get article by slug |

See [MCP Setup Guide](docs/MCP_SETUP_GUIDE.md) for configuration.

## Deployment

### Cloudflare Workers

1. Fork this repository
2. Add GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
3. Set `DATABASE_URL` as a Workers secret in Cloudflare Dashboard
4. Push to `master` — GitHub Actions deploys automatically

### Zeabur

1. Connect your repository on [Zeabur](https://zeabur.com)
2. Set environment variables: `DATABASE_URL`
3. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Testing

```bash
npm run test:unit    # Unit tests
npm run test:e2e     # E2E tests
npm test             # All tests
```

## Roadmap

- [ ] 社交媒体发布工作流（小红书等）— 基于同一数据库，一键将文章发布到社交平台

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License — see [LICENSE](LICENSE). Please don't sell this.

## Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [MCP Server Setup](docs/MCP_SETUP_GUIDE.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Open Source Checklist](docs/OPENSOURCE-CHECKLIST.md)
