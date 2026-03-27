# Roadmap: Cool Blog — Bento Grid Portfolio

## Overview

Build a visually striking technical blog and portfolio site with Bento Grid layout. The journey progresses from establishing the visual foundation with responsive Bento Grid, through building the content system for articles, adding newsletter functionality with database integration, and finally polishing with SEO for launch.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Bento Grid** - Project setup, Cloudflare deployment, responsive Bento Grid with card variants
- [ ] **Phase 2: Content System** - Articles system with markdown, syntax highlighting, search/filter, and tab navigation
- [ ] **Phase 3: Newsletter & Backend** - Newsletter subscription with Neon Postgres integration
- [ ] **Phase 4: SEO & Launch** - Meta tags, RSS, sitemap, and final deployment polish

## Phase Details

### Phase 1: Foundation & Bento Grid
**Goal**: Users see a visually striking responsive Bento Grid layout deployed to Cloudflare Pages with the core visual identity established.
**Depends on**: Nothing (first phase)
**Requirements**: PORT-01, PORT-02, PORT-03, PORT-04, PORT-05, RESP-01, RESP-02, DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04
**Success Criteria** (what must be TRUE):
  1. User can view the site on mobile, tablet, and desktop with layout adapting gracefully
  2. User can see Bento Grid cards with varying sizes (span-2, span-4, row-2) displayed correctly
  3. User can interact with dark/light card variants that respond smoothly to hover
  4. User can see image cards transition from grayscale to color on hover
  5. User can navigate between Portfolio and Articles views via tab navigation
**Plans**: TBD

Plans:
- [ ] 01-01: Project scaffolding with Astro, Cloudflare adapter, and Tailwind CSS
- [ ] 01-02: Bento Grid component with card variants and hover animations
- [ ] 01-03: Responsive layout and touch-friendly interactions
- [ ] 01-04: Tab navigation between Portfolio and Articles
- [ ] 01-05: Cloudflare Pages deployment with environment configuration

### Phase 2: Content System
**Goal**: Users can browse, read, and search technical articles with excellent readability and code syntax highlighting.
**Depends on**: Phase 1
**Requirements**: ART-01, ART-02, ART-03, ART-04, ART-05
**Success Criteria** (what must be TRUE):
  1. User can view a list of articles showing title, excerpt, date, and tags
  2. User can click an article to read the full content rendered from Markdown
  3. User can see code blocks with syntax highlighting in articles
  4. User can search articles by title and filter by tag
  5. Content is managed through Git-based Markdown files
**Plans**: TBD

Plans:
- [ ] 02-01: Astro Content Collections with Zod schemas for articles
- [ ] 02-02: Article list and individual article pages with layouts
- [ ] 02-03: Syntax highlighting with Shiki
- [ ] 02-04: Search and filter functionality (client-side)

### Phase 3: Newsletter & Backend
**Goal**: Users can subscribe to the newsletter and receive confirmation, with emails stored securely in Neon Postgres.
**Depends on**: Phase 2
**Requirements**: NEWS-01, NEWS-02, NEWS-03, NEWS-04
**Success Criteria** (what must be TRUE):
  1. User can enter email in a subscription form with client-side validation
  2. User receives a confirmation message after successful subscription
  3. User can request a resend of confirmation email
  4. Subscriber emails are stored in Neon Postgres database with duplicate prevention
**Plans**: TBD

Plans:
- [ ] 03-01: Neon Postgres database setup with Drizzle ORM
- [ ] 03-02: Newsletter subscription form (React island)
- [ ] 03-03: Subscribe API endpoint with error handling
- [ ] 03-04: Confirmation and resend email functionality

### Phase 4: SEO & Launch
**Goal**: The site is discoverable by search engines and social platforms with proper metadata and feeds.
**Depends on**: Phase 3
**Requirements**: SEO-01, SEO-02, SEO-03
**Success Criteria** (what must be TRUE):
  1. User sharing a link on social media sees proper Open Graph and Twitter Card previews
  2. User can subscribe to an RSS feed of articles
  3. Search engines can crawl the site via sitemap.xml
**Plans**: TBD

Plans:
- [ ] 04-01: Meta tags, Open Graph, and Twitter Cards
- [ ] 04-02: RSS feed generation
- [ ] 04-03: Sitemap and robots.txt
- [ ] 04-04: Final launch verification

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Bento Grid | 0/5 | Not started | - |
| 2. Content System | 0/4 | Not started | - |
| 3. Newsletter & Backend | 0/4 | Not started | - |
| 4. SEO & Launch | 0/4 | Not started | - |

---
*Roadmap created: 2026-03-27*
*Granularity: coarse*
