# Requirements: Cool Blog — Bento Grid Portfolio & Technical Writing

**Defined:** 2026-03-27
**Core Value:** Visual impact meets content depth — striking portfolio showcase paired with deep technical articles

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Layout & Design

- [ ] **LAY-01**: Bento Grid layout with 4-column base and 4px gaps
- [ ] **LAY-02**: Card variants: span-2, span-4, row-2 for visual hierarchy
- [ ] **LAY-03**: Light cards (#F7F7F7) with dark variant (#111111)
- [ ] **LAY-04**: Smooth hover transitions (background, arrow transform)
- [ ] **LAY-05**: Image cards with grayscale-to-color effect on hover
- [ ] **LAY-06**: Terminal/code block styling with JetBrains Mono
- [ ] **LAY-07**: Fully responsive (mobile, tablet, desktop)

### Navigation & Structure

- [ ] **NAV-01**: Tab navigation between Portfolio and Articles views
- [ ] **NAV-02**: Header with brand, menu pills, and subscribe CTA
- [ ] **NAV-03**: Footer with sitemap, topics, social links
- [ ] **NAV-04**: URL routing: `/` (portfolio), `/articles`, `/articles/[slug]`

### Portfolio Tab

- [ ] **PORT-01**: Manifesto/hero card with large headline
- [ ] **PORT-02**: Project showcase cards with images
- [ ] **PORT-03**: Stats card (e.g., commit count, metrics)
- [ ] **PORT-04**: Clickable cards linking to project details or external URLs
- [ ] **PORT-05**: Arrow icon animation on card hover

### Articles Tab

- [ ] **ART-01**: Article list with title, excerpt, date, tags
- [ ] **ART-02**: Individual article page with full Markdown rendering
- [ ] **ART-03**: Syntax highlighting for code blocks (Shiki)
- [ ] **ART-04**: Article content from Git-managed Markdown files
- [ ] **ART-05**: Reading time estimate

### Search & Filter

- [ ] **SRCH-01**: Full-text search across article titles and content
- [ ] **SRCH-02**: Tag-based filtering
- [ ] **SRCH-03**: Search results displayed in article list format
- [ ] **SRCH-04**: Clear search/reset functionality

### Newsletter

- [ ] **NEWS-01**: Email subscription form in portfolio grid
- [ ] **NEWS-02**: Email validation before submission
- [ ] **NEWS-03**: Store emails in Neon Postgres database
- [ ] **NEWS-04**: Success/error feedback on submission
- [ ] **NEWS-05**: Retry logic with exponential backoff for Neon cold starts

### Content Management

- [ ] **CONT-01**: Markdown content files in `/content/` directory
- [ ] **CONT-02**: Astro content collections for type-safe content
- [ ] **CONT-03**: Frontmatter schema (title, date, tags, excerpt, image)
- [ ] **CONT-04**: Draft/published status via frontmatter

### Deployment & Infrastructure

- [ ] **DEP-01**: Deployment to Cloudflare Pages
- [ ] **DEP-02**: Hybrid rendering (static pages + serverless newsletter)
- [ ] **DEP-03**: Cloudflare image service binding (not Sharp)
- [ ] **DEP-04**: `nodejs_compat` flag enabled
- [ ] **DEP-05**: Environment variables via Cloudflare secrets

### SEO & Meta

- [ ] **SEO-01**: Meta tags (title, description, author)
- [ ] **SEO-02**: Open Graph tags for social sharing
- [ ] **SEO-03**: Twitter Card meta tags
- [ ] **SEO-04**: RSS feed generation
- [ ] **SEO-05**: Sitemap generation

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Analytics

- **ANAL-01**: Page view tracking
- **ANAL-02**: Article read time analytics
- **ANAL-03**: Newsletter conversion rate

### Enhanced Content

- **CONT-05**: Table of contents for long articles
- **CONT-06**: Related articles suggestions
- **CONT-07**: Article series/grouping

### Social

- **SOC-01**: Social share buttons
- **SOC-02**: Comment system integration (third-party)
- **SOC-03**: Webmentions support

### Performance

- **PERF-01**: Image lazy loading optimization
- **PERF-02**: Critical CSS inlining
- **PERF-03**: Service worker for offline reading

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User authentication | Newsletter only requires email, no accounts |
| Comments system | Deferred to v2, adds moderation complexity |
| Dark mode toggle | Intentional light theme, dark cards provide contrast |
| Multi-language | English only for v1 |
| Admin dashboard | Content managed via Git, no CMS backend |
| Social login | No OAuth needed for newsletter-only |
| Real-time features | Static site with serverless functions sufficient |
| Member-only content | Public blog, no paywall |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (To be populated during roadmap creation) | — | Pending |

**Coverage:**
- v1 requirements: 35 total
- Mapped to phases: 0
- Unmapped: 35 ⚠️

---
*Requirements defined: 2026-03-27*
*Last updated: 2026-03-27 after initial definition*
