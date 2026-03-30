# Phase 4: SEO & Launch - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the site discoverable by search engines and social platforms with proper metadata and feeds. This includes:
- Meta tags, Open Graph, and Twitter Cards for social sharing
- RSS feed for article subscriptions
- Sitemap.xml and robots.txt for search engine crawling

This does NOT include: analytics, performance optimization, or deployment changes.

</domain>

<decisions>
## Implementation Decisions

### Open Graph & Social Sharing
- Use dynamic OG image (generated branded card with title and site branding)
- Page titles: "Site Name + Page Title" format (e.g., "KERNEL_PANIC / ... | Your Page Title")
- Twitter Card type: summary_large_image
- Article-specific OG images (each article gets its own preview)
- Article OG images: extracted from article content (first image in markdown)

### RSS Feed Structure
- Include full article content in RSS feed (not just excerpts)
- Include article images as media:content in feed

### Sitemap Configuration
- Include all public pages: /, /articles, and individual /articles/[slug]
- Use priority by page type: homepage 1.0, articles 0.8, other pages 0.5
- Include image metadata for articles in sitemap

### Robots.txt & Crawling
- Allow all pages + reference sitemap location (standard for public blogs)

### Claude's Discretion
- Exact OG image generation implementation (Satori vs manual HTML-to-image)
- RSS feed URL path (/rss.xml vs /feed.xml vs /blog/feed)
- Sitemap index vs single sitemap structure
- Frequency changefreq values in sitemap

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- BaseLayout.astro: Existing meta tag structure that can be extended for OG/twitter tags
- Article content in src/content/: Markdown files that can be processed for OG image extraction

### Established Patterns
- Astro framework: Has built-in support for sitemap generation
- Content Collections: Articles are already structured with frontmatter for metadata extraction

### Integration Points
- BaseLayout.astro: Where meta tags and OG properties will be added
- Articles route: /pages/articles/[slug].astro for article-specific metadata
- Static pages: index.astro, /articles/index.astro for page-level metadata

</code_context>

<specifics>
## Specific Ideas

- "KERNEL_PANIC / ARCHITECTURE & SYSTEMS" — brand identity should appear in OG images
- Terminal/brutalist aesthetic should carry through to social previews
- Article images extracted from markdown should be used for article-specific OG

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-seo-launch*
*Context gathered: 2026-03-30*