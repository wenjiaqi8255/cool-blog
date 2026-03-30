# Cool Blog — Bento Grid Portfolio & Technical Writing

## What This Is

A visually striking technical blog and portfolio site with Bento Grid layout. Features two main tabs: **Portfolio** (visual project showcase) and **Articles** (technical writing series). Built with Astro + React, powered by Neon Postgres, deployed on Cloudflare Pages.

The design embraces minimalist brutalism — monochrome palette, terminal aesthetics, Inter + JetBrains Mono typography, subtle hover animations, and a grid-based card system inspired by modern design tools like Linear and Vercel.

## Core Value

**Visual impact meets content depth.** The portfolio tab showcases work through striking visuals and micro-interactions. The articles tab provides deep technical content with excellent readability. Both should feel cohesive yet serve their distinct purposes perfectly.

## Requirements

### Validated

All v1.0 requirements shipped and validated:

- ✅ **PORT-01**: Bento Grid layout with varying card sizes — v1.0
- ✅ **PORT-02**: Dark/light card variants with smooth hover transitions — v1.0
- ✅ **PORT-03**: Image cards with grayscale-to-color effect on hover — v1.0
- ✅ **PORT-04**: Terminal/code block styling within cards — v1.0
- ✅ **PORT-05**: Tab navigation between Portfolio and Articles views — v1.0
- ✅ **ART-01**: Article list with title, excerpt, date, tags — v1.0
- ✅ **ART-02**: Individual article page with full content rendering — v1.0
- ✅ **ART-03**: Markdown content from Git-managed files — v1.0
- ✅ **ART-04**: Syntax highlighting for code blocks — v1.0
- ✅ **ART-05**: Search and filter functionality (by tag, title) — v1.0
- ✅ **NEWS-01**: Newsletter subscription form with email capture — v1.0
- ✅ **NEWS-02**: Email storage in Neon Postgres database — v1.0
- ✅ **NEWS-03**: Subscription confirmation and thank you message — v1.0
- ✅ **NEWS-04**: Resend confirmation email to subscriber — v1.0
- ✅ **DEPLOY-01**: Deployment to Cloudflare Pages — v1.0
- ✅ **DEPLOY-02**: Custom domain support (optional) — v1.0
- ✅ **DEPLOY-03**: Environment variables configuration — v1.0
- ✅ **DEPLOY-04**: HTTPS with Let's Encrypt (SSL certificates auto, custom domain DNS) — v1.0
- ✅ **SEO-01**: Meta tags, Open Graph, Twitter Cards — v1.0
- ✅ **SEO-02**: RSS feed generation — v1.0
- ✅ **SEO-03**: Sitemap.xml for search engines — v1.0
- ✅ **RESP-01**: Fully responsive design (mobile, tablet, desktop) — v1.0
- ✅ **RESP-02**: Touch-friendly interactions on mobile — v1.0

### Active (v1.1 Planning)

Next milestone will address:

- **Analytics**: Page view tracking, article read time, newsletter conversion
- **Enhanced Content**: Table of contents, related articles, article series
- **Social**: Share buttons, comments (third-party), webmentions
- **Performance**: Image lazy loading, critical CSS inlining, service worker

### Out of Scope

- **User authentication** — Newsletter only requires email, no accounts needed
- **Comments system** — Deferred to v2, can add later via third-party service
- **Dark mode toggle** — Site has intentional light theme, dark cards provide contrast
- **Multi-language** — English only for v1
- **Social login** — No OAuth needed for newsletter-only subscription
- **Admin dashboard** — Content managed via Git, no CMS backend needed

## Context

### Current State (After v1.0)

**Shipped:** 2026-03-30
**Tech Stack:**
- Astro 6.1.1 (App Router, Content Collections)
- React 19 (interactive islands)
- Tailwind CSS v4 (CSS-first configuration)
- Neon Postgres + Drizzle ORM (serverless database)
- Resend API (email delivery)
- Cloudflare Pages (deployment)

**Files:**
- 44 files modified
- 4,658 lines added

### Original Context (Pre-v1.0)

**Design Reference**: User provided detailed HTML mockup with:
- Brand: "KERNEL_PANIC / ARCHITECTURE & SYSTEMS"
- Navigation: pill buttons with border, subscribe CTA
- Bento Grid: 4-column layout, 4px gaps, 320px min card height
- Cards: light background (#F7F7F7), dark variant (#111111)
- Typography: Inter (200-600 weights), JetBrains Mono for code
- Colors: Canvas white, ink black, ink gray, ink light
- Animations: cubic-bezier easing, hover transforms, blinking cursor

**Content Focus**:
- Technical writing (AI/ML, systems engineering, terminal aesthetics)
- Machine learning articles and tutorials
- Portfolio showcasing projects and setups
- Resume/work samples integration

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js | Better Cloudflare support, content collections, lighter bundle | ✅ Validated — excellent Cloudflare integration |
| Neon over D1 | Better free tier, more familiar SQL, edge-compatible | ✅ Validated — works well with serverless |
| Markdown files over CMS | Git version control, developer-friendly, no API calls | ✅ Validated — simple content workflow |
| Tabs over separate pages | Keeps users engaged, smooth transitions, single-page feel | ✅ Validated — smooth tab switching |
| Newsletter-only subscription | No auth complexity, captures intent, can add features later | ✅ Validated — simple MVP |
| Tailwind v4 CSS-first | @astrojs/tailwind incompatible with Astro 6 | ✅ Validated — better than planned |
| SVG over PNG for OG images | @vercel/og incompatible with Cloudflare prerender | ✅ Validated — works on Cloudflare |

## Constraints

- **Framework**: Astro required — best for content sites, SSG/SSR flexibility
- **Database**: Neon Postgres required — user preference, edge-compatible
- **Hosting**: Cloudflare Pages required — fast global CDN, edge functions
- **Content**: Markdown + Git — no headless CMS, files in repo
- **Typography**: Inter + JetBrains Mono — defined in design mockup
- **Layout**: Bento Grid with 4-column base, 4px gaps — non-negotiable visual identity

---

*Last updated: 2026-03-30 after v1.0 milestone*