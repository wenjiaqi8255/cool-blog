# Cool Blog — Bento Grid Portfolio & Technical Writing

## What This Is

A visually striking technical blog and portfolio site with Bento Grid layout. Features two main tabs: **Portfolio** (visual project showcase) and **Articles** (technical writing series). Built with Astro + React, powered by Neon Postgres, deployed on Cloudflare Pages.

The design embraces minimalist brutalism — monochrome palette, terminal aesthetics, Inter + JetBrains Mono typography, subtle hover animations, and a grid-based card system inspired by modern design tools like Linear and Vercel.

## Core Value

**Visual impact meets content depth.** The portfolio tab showcases work through striking visuals and micro-interactions. The articles tab provides deep technical content with excellent readability. Both should feel cohesive yet serve their distinct purposes perfectly.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **PORT-01**: Bento Grid layout with varying card sizes (span-2, span-4, row-2)
- [ ] **PORT-02**: Dark/light card variants with smooth hover transitions
- [ ] **PORT-03**: Image cards with grayscale-to-color effect on hover
- [ ] **PORT-04**: Terminal/code block styling within cards
- [ ] **PORT-05**: Tab navigation between Portfolio and Articles views
- [ ] **ART-01**: Article list with title, excerpt, date, tags
- [ ] **ART-02**: Individual article page with full content rendering
- [ ] **ART-03**: Markdown content from Git-managed files
- [ ] **ART-04**: Syntax highlighting for code blocks
- [ ] **ART-05**: Search and filter functionality (by tag, title)
- [ ] **NEWS-01**: Newsletter subscription form with email capture
- [ ] **NEWS-02**: Email storage in Neon Postgres database
- [ ] **DEPLOY-01**: Deployment to Cloudflare Pages
- [ ] **DEPLOY-02**: Custom domain support (optional)
- [ ] **SEO-01**: Meta tags, Open Graph, Twitter Cards
- [ ] **SEO-02**: RSS feed generation
- [ ] **RESP-01**: Fully responsive design (mobile, tablet, desktop)
- [ ] **RESP-02**: Touch-friendly interactions on mobile

### Out of Scope

- **User authentication** — Newsletter only requires email, no accounts needed
- **Comments system** — Deferred to v2, can add later via third-party service
- **Dark mode toggle** — Site has intentional light theme, dark cards provide contrast
- **Multi-language** — English only for v1
- **Social login** — No OAuth needed for newsletter-only subscription
- **Admin dashboard** — Content managed via Git, no CMS backend needed

## Context

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

**Technical Environment**:
- Astro framework (excellent Cloudflare support, content collections)
- React for interactive components
- Neon Postgres (serverless, edge-compatible, generous free tier)
- Cloudflare Pages deployment
- Markdown content files in Git

## Constraints

- **Framework**: Astro required — best for content sites, SSG/SSR flexibility
- **Database**: Neon Postgres required — user preference, edge-compatible
- **Hosting**: Cloudflare Pages required — fast global CDN, edge functions
- **Content**: Markdown + Git — no headless CMS, files in repo
- **Typography**: Inter + JetBrains Mono — defined in design mockup
- **Layout**: Bento Grid with 4-column base, 4px gaps — non-negotiable visual identity

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js | Better Cloudflare support, content collections, lighter bundle | — Pending |
| Neon over D1 | Better free tier, more familiar SQL, edge-compatible | — Pending |
| Markdown files over CMS | Git version control, developer-friendly, no API calls | — Pending |
| Tabs over separate pages | Keeps users engaged, smooth transitions, single-page feel | — Pending |
| Newsletter-only subscription | No auth complexity, captures intent, can add features later | — Pending |

---
*Last updated: 2026-03-27 after initialization*
