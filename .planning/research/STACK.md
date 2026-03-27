# Stack Research

**Domain:** Technical Blog/Portfolio with Bento Grid Layout
**Researched:** 2026-03-27
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Astro** | 5.x | Static Site Generator with SSR capability | Best-in-class content collections, excellent Cloudflare support, island architecture for selective hydration, lightweight output. Astro 5.16+ includes experimental SVG optimization and React 19 support. |
| **React** | 19.x | Interactive components | Required for client-side interactivity (tab switching, hover effects, newsletter form). Astro 5.14+ supports React 19 actions. Use only for islands that need JS. |
| **TypeScript** | 5.x | Type safety | First-class support in Astro, essential for content collection schemas and type-safe database queries with Drizzle. |
| **Tailwind CSS** | 4.x | Styling | Official Bento Grid components, utility-first approach matches design system requirements. v4 uses new Vite plugin architecture (`@tailwindcss/vite`) for better performance. |
| **Neon Postgres** | Serverless | Database for newsletter emails | Edge-compatible, generous free tier, instant branching for development. Pooled connections (`-pooler.region.aws.neon.tech`) essential for serverless environments. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@astrojs/react** | 4.x | React integration for Astro | Required for React island components |
| **@astrojs/cloudflare** | 12.x | Cloudflare adapter | Required for SSR/hybrid deployment on Cloudflare Pages |
| **@neondatabase/serverless** | 0.10.x | Neon serverless driver | Required for database connections from Cloudflare Workers |
| **drizzle-orm** | 0.40.x | TypeScript ORM | Type-safe database queries, schema management, migrations |
| **drizzle-kit** | 0.30.x | Schema migrations | Running migrations against Neon database |
| **@fontsource/inter** | 5.x | Self-hosted Inter font | Primary body font, variable weight support |
| **@fontsource/jetbrains-mono** | 5.x | Self-hosted JetBrains Mono font | Code blocks, terminal aesthetics |
| **astro-icon** | 1.x | SVG icon system | Navigation icons, social icons. Supports Iconify (275k+ icons) |
| **@astrojs/rss** | 4.x | RSS feed generation | Required for SEO-02 requirement |
| **Motion** (formerly Framer Motion) | 12.x | React animations | Optional: for advanced hover transitions and micro-interactions. Overkill if only simple CSS transitions needed. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **Vite** | Build tool (bundled with Astro) | Already included, configured via astro.config.mjs |
| **Wrangler** | Cloudflare CLI | For local development with D1/Workers, deploy configuration |
| **ESLint** | Code linting | Configure with `@typescript-eslint` and `eslint-plugin-astro` |
| **Prettier** | Code formatting | Configure with `prettier-plugin-astro` and `prettier-plugin-tailwindcss` |

## Installation

```bash
# Create project
npm create astro@latest

# Core integrations
npx astro add react
npx astro add cloudflare
npx astro add tailwind

# Database
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit

# Fonts (self-hosted for best performance)
npm install @fontsource/inter @fontsource/jetbrains-mono

# Icons
npm install astro-icon

# RSS
npm install @astrojs/rss

# Optional: Advanced animations
npm install motion

# Dev dependencies
npm install -D @types/node
npm install -D prettier prettier-plugin-astro prettier-plugin-tailwindcss
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Astro | Next.js | When you need heavy client-side routing, complex auth flows, or are already in Next.js ecosystem. Astro is better for content-first sites. |
| Neon Postgres | Cloudflare D1 | When you want everything in Cloudflare ecosystem. D1 has smaller free tier and is SQLite-based. Neon has better tooling, larger free tier, and full Postgres. |
| Tailwind CSS | CSS Modules + SASS | When you prefer scoped styles and traditional CSS. Tailwind is better for Bento Grid due to official components and rapid prototyping. |
| Drizzle ORM | Prisma | When you prefer graphical schema viewer and more ORM features. Drizzle is lighter, edge-native, and has better TypeScript inference. |
| astro-icon | Lucide React | When you only need one icon set and prefer React components. astro-icon is better for Astro-first approach and multiple icon sets. |
| Self-hosted fonts | Google Fonts CDN | When you don't care about privacy or slight performance hit. Self-hosting eliminates external requests and is recommended by Astro. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Next.js** for this project | Heavier bundle, overkill for content site, Cloudflare support requires extra configuration | **Astro** - purpose-built for content sites, native Cloudflare adapter |
| **Prisma** with Neon | Edge runtime compatibility issues, heavier client, slower cold starts | **Drizzle ORM** - edge-native, tree-shakeable, zero runtime overhead |
| **Cloudflare D1** (for this use case) | SQLite limitations, smaller free tier (5GB), less mature tooling | **Neon Postgres** - full Postgres, larger free tier (10GB), better ecosystem |
| **Non-pooled Neon connections** in serverless | Connection exhaustion under load, failed requests | **Pooled connections** (`-pooler.region.aws.neon.tech`) - handles serverless scaling |
| **Google Fonts CDN** | External dependency, privacy concerns, adds DNS/HTTP overhead | **@fontsource/* packages** - self-hosted, zero external requests, FOUT-free |
| **CSS-in-JS (styled-components, emotion)** | Not optimized for Astro SSR, runtime overhead | **Tailwind CSS** - build-time generation, zero runtime cost |
| **MDX for all content** | Overkill for simple articles, adds complexity | **Markdown with Astro Content Collections** - simpler, type-safe, sufficient for blog |

## Stack Patterns by Variant

**For Static Site Generation (SSG) - Default:**
- Use `output: 'static'` in astro.config.mjs
- Pre-render all pages at build time
- Newsletter form calls serverless function endpoint
- Best performance, lowest cost

**For Hybrid Rendering:**
- Use `output: 'hybrid'` with `prerender: true` default
- Only newsletter API route is server-rendered
- Good balance of static performance + dynamic features

**For Full SSR:**
- Use `output: 'server'`
- All pages rendered on request
- Only needed for real-time data or user-specific content (not this project)

**For Animation Complexity:**

| Complexity Level | Recommendation |
|-----------------|----------------|
| Simple hovers/transitions | CSS transitions + Tailwind utilities |
| Card animations | CSS transforms + Tailwind `transition-all` |
| Advanced micro-interactions | Motion library for React components |

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Astro 5.x | React 18.x, 19.x | React 19 actions support added in Astro 5.14 |
| @astrojs/cloudflare 12.x | Astro 5.x, Wrangler 4.x | Use with `output: 'server'` or `output: 'hybrid'` |
| Tailwind CSS 4.x | Vite 6.x, Astro 5.x | Requires `@tailwindcss/vite` plugin, not the old integration |
| drizzle-orm 0.40.x | @neondatabase/serverless 0.10.x | Use `neon()` driver, not `postgres-js` |
| Motion 12.x | React 18.x, 19.x | Framer Motion renamed to Motion in v12 |

## Architecture-Specific Notes

### Bento Grid Implementation

```css
/* Core Bento Grid CSS (use with Tailwind) */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-flow: dense; /* Key for auto-packing */
  gap: 4px;
  min-height: 320px;
}

/* Card variants */
.card-span-2 { grid-column: span 2; }
.card-span-4 { grid-column: span 4; }
.card-row-2 { grid-row: span 2; }
```

### Neon Connection Pattern

```typescript
// lib/db.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Use pooled connection string for serverless
const sql = neon(process.env.DATABASE_URL!); // Should be -pooler URL
export const db = drizzle(sql);
```

### Content Collections Structure

```typescript
// content.config.ts (Astro 5.x format)
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  }),
});

export const collections = { articles };
```

## Sources

- [Astro Documentation](https://docs.astro.build) - Official docs for Astro 5.x features, content collections, integrations (HIGH confidence)
- [Tailwind CSS + Astro Guide](https://tailwindcss.com/docs/installation/framework-guides/astro) - Official integration guide (HIGH confidence)
- [Neon Documentation](https://neon.com/docs) - Serverless driver, connection pooling best practices (HIGH confidence)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs) - Neon integration patterns (HIGH confidence)
- [Cloudflare Adapter Docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) - @astrojs/cloudflare configuration (HIGH confidence)
- [astro-icon Documentation](https://astroicon.dev) - Icon system for Astro (HIGH confidence)
- [Motion.dev](https://motion.dev/docs/react) - React animation library, formerly Framer Motion (HIGH confidence)
- [What's new in Astro - December 2025](https://astro.build/blog/whats-new-december-2025/) - Astro 6.0-alpha, v5 to v6 upgrade preview (HIGH confidence)
- [Neon + Drizzle Guide](https://neon.com/guides/drizzle-local-vercel) - Setting up Drizzle with serverless Postgres (HIGH confidence)
- [Expressive Code Docs](https://expressive-code.com/key-features/syntax-highlighting/) - Syntax highlighting with Shiki for Astro (HIGH confidence)

---
*Stack research for: Technical Blog/Portfolio with Bento Grid Layout*
*Researched: 2026-03-27*
