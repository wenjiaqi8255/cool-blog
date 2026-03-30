# Phase 4: SEO & Launch - Research

**Researched:** 2026-03-30
**Domain:** SEO, social sharing, RSS feeds, sitemaps
**Confidence:** HIGH

## Summary

Phase 4 implements discoverability features for the blog: meta tags for social sharing (Open Graph, Twitter Cards), RSS feed for article subscriptions, and sitemap.xml + robots.txt for search engine crawling. The project uses Astro 6.1 with Cloudflare Pages adapter, so the implementation must work within a static site generation context while supporting dynamic OG images.

**Primary recommendation:** Use `@astrojs/sitemap` for sitemap generation (v3.7.2), `@astrojs/rss` for RSS feed (v4.0.18), and extend BaseLayout.astro with OG/twitter meta tags. For dynamic OG image generation, use `satori` (v0.26.0) to generate branded cards matching the terminal/brutalist aesthetic.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use dynamic OG image (generated branded card with title and site branding)
- Page titles: "Site Name + Page Title" format (e.g., "KERNEL_PANIC / ... | Your Page Title")
- Twitter Card type: summary_large_image
- Article-specific OG images (each article gets its own preview)
- Article OG images: extracted from article content (first image in markdown)
- Include full article content in RSS feed (not just excerpts)
- Include article images as media:content in feed
- Include all public pages: /, /articles, and individual /articles/[slug]
- Use priority by page type: homepage 1.0, articles 0.8, other pages 0.5
- Include image metadata for articles in sitemap
- Allow all pages + reference sitemap location in robots.txt

### Claude's Discretion
- Exact OG image generation implementation (Satori vs manual HTML-to-image)
- RSS feed URL path (/rss.xml vs /feed.xml vs /blog/feed)
- Sitemap index vs single sitemap structure
- Frequency changefreq values in sitemap

### Deferred Ideas (OUT OF SCOPE)
- Analytics
- Performance optimization beyond SEO fundamentals
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | Meta tags, Open Graph, Twitter Cards | Extend BaseLayout.astro with OG/twitter meta, use Satori for dynamic image generation |
| SEO-02 | RSS feed generation | Use @astrojs/rss v4.0.18 with full content + media:content |
| SEO-03 | Sitemap.xml for search engines | Use @astrojs/sitemap v3.7.2, configure priority by page type |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @astrojs/sitemap | 3.7.2 | Sitemap generation | Official Astro integration, supports all sitemap features |
| @astrojs/rss | 4.0.18 | RSS feed generation | Official Astro package, works with content collections |
| satori | 0.26.0 | OG image generation | Vercel-maintained, generates images from JSX/HTML |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @resvg/resvg-js | latest | Convert SVG to PNG | After Satori generates SVG OG image |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| satori | @vercel/og (Vercel-only) | Vercel-only, not suitable for Cloudflare Pages |
| satori | html-to-image | Less flexible for branding, fewer font options |

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── layouts/
│   └── BaseLayout.astro      # Add OG/twitter meta tags here
├── pages/
│   ├── index.astro           # Homepage - OG meta
│   ├── articles/
│   │   ├── index.astro      # Articles list - OG meta
│   │   ├── [slug].astro     # Article page - article-specific OG
│   │   └── rss.xml.js       # RSS feed endpoint
│   └── robots.txt.ts         # Robots.txt endpoint
└── components/
    └── og-image/            # OG image generation logic
        └── generate.ts       # Satori-based image generation
```

### Pattern 1: OG Meta Tags in BaseLayout
**What:** Extend existing BaseLayout.astro to include Open Graph and Twitter Card meta tags
**When to use:** Every page that needs social sharing preview
**Example:**
```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title?: string;
  description?: string;
  image?: string; // Optional og:image
  type?: 'website' | 'article';
}

const {
  title = 'KERNEL_PANIC / ARCHITECTURE & SYSTEMS',
  description = 'Computing as craft — Technical writing and portfolio',
  image,
  type = 'website'
} = Astro.props;

const siteUrl = 'https://your-domain.com';
const ogImageUrl = image || `${siteUrl}/og-default.png`;
const canonicalUrl = new URL(Astro.url.pathname, siteUrl).toString();
---
<head>
  <!-- Existing tags -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImageUrl} />
  <meta property="og:type" content={type} />
  <meta property="og:url" content={canonicalUrl} />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImageUrl} />

  <!-- Canonical -->
  <link rel="canonical" href={canonicalUrl} />
</head>
```

### Pattern 2: Dynamic OG Image with Satori
**What:** Generate branded OG images at build time using Satori
**When to Use:** Each article needs a unique OG image, or want branded default image
**Example:**
```typescript
// src/pages/og/[slug].png.ts
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((article) => ({
    params: { slug: article.id },
    props: { article }
  }));
}

export const GET = async ({ props }) => {
  const { article } = props;
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: '#111',
          color: '#fff',
          padding: '60px',
          justifyContent: 'center',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { fontSize: '48px', fontFamily: 'JetBrains Mono' },
              children: 'KERNEL_PANIC / ARCHITECTURE & SYSTEMS'
            }
          },
          {
            type: 'div',
            props: {
              style: { fontSize: '64px', marginTop: '20px' },
              children: article.data.title
            }
          }
        ]
      }
    },
    {
      width: 1200,
      height: 630,
      fonts: [/* loaded fonts */]
    }
  );

  const resvg = new Resvg(svg);
  return new Response(resvg.render().asPng(), {
    headers: { 'Content-Type': 'image/png' }
  });
};
```

### Pattern 3: RSS Feed with Full Content
**What:** Generate RSS feed including full article content and images
**When to Use:** Article subscriptions via RSS readers
**Example:**
```javascript
// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = await getCollection('articles', ({ data }) => !data.draft);

  return rss({
    title: 'KERNEL_PANIC / ARCHITECTURE & SYSTEMS',
    description: 'Computing as craft — Technical writing and portfolio',
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.excerpt,
      link: `/articles/${article.id}/`,
      content: article.body, // Full markdown content
      customData: `
        <media:content
          type="image/jpeg"
          width="1200"
          height="630"
          url="${article.data.image || ''}"
        />
      `.trim(),
    })),
  });
}
```

### Pattern 4: Sitemap with Priority
**What:** Generate sitemap with different priorities for different page types
**When to Use:** SEO optimization for search engines
**Example:**
```javascript
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://your-domain.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      customPages: ['/articles/'],
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en' }
      }
    })
  ]
});
```

### Anti-Patterns to Avoid
- **Static OG images only:** Each article should have its own preview image for better social sharing
- **RSS with excerpts only:** Users prefer full content in RSS readers
- **Missing canonical URLs:** Can cause SEO duplicate content issues
- **No sitemap:** Search engines will still crawl but won't understand site structure as well
- **OG images without brand identity:** OG images should match the terminal/brutalist aesthetic

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap generation | Manual XML generation | @astrojs/sitemap | Handles all edge cases, auto-updates, SEO best practices |
| RSS feed | Manual XML feed | @astrojs/rss | Proper RSS spec compliance, works with content collections |
| OG image conversion | Canvas API | satori + @resvg/resvg-js | Reliable cross-platform SVG-to-PNG, better font support |

**Key insight:** Astro ecosystem has well-maintained official packages for all these requirements. Hand-rolling risks missing SEO best practices and compatibility issues.

---

## Common Pitfalls

### Pitfall 1: Missing site configuration
**What goes wrong:** Sitemap and RSS fail to generate without `site` in astro.config.mjs
**Why it happens:** Both packages require a base URL to generate absolute URLs
**How to avoid:** Always add `site: 'https://your-domain.com'` in config
**Warning signs:** Build warnings about missing site URL

### Pitfall 2: OG image not accessible
**What goes wrong:** Social platforms can't fetch OG images due to authentication or blocking
**Why it happens:** Images behind auth, not publicly accessible, or wrong content-type
**How to avoid:** Ensure images are statically generated and publicly accessible
**Warning signs:** Facebook Debugger shows "Could not resolve URL" or "Blank response"

### Pitfall 3: Content collection type mismatch
**What goes wrong:** RSS feed fails because collection type not properly typed
**Why it happens:** Using wrong collection reference in getCollection call
**How to avoid:** Use proper generic type: `getCollection<'articles'>`
**Warning signs:** TypeScript errors in rss.xml.js

### Pitfall 4: Image extraction from markdown
**What goes wrong:** Article OG image extraction fails or uses wrong image
**Why it happens:** First image in markdown might be a diagram, not the hero image
**How to avoid:** Add dedicated `image` field to article frontmatter as primary image
**Warning signs:** Social previews show unrelated images

---

## Code Examples

### Extending BaseLayout for OG/Twitter
Source: [Astro SEO docs](https://docs.astro.build/en/guides/seo/)

```astro
---
// Add to src/layouts/BaseLayout.astro
const {
  title,
  description,
  image = '/og-default.png',
  type = 'website'
} = Astro.props;
const siteUrl = 'https://your-domain.com';
---
<head>
  <!-- Basic meta -->
  <meta name="description" content={description} />
  <title>{title}</title>

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={`${siteUrl}${image}`} />
  <meta property="og:type" content={type} />
  <meta property="og:url" content={Astro.url.href} />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={`${siteUrl}${image}`} />

  <!-- RSS auto-discovery -->
  <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/rss.xml" />
</head>
```

### RSS with content collections
Source: [@astrojs/rss docs](https://docs.astro.build/en/guides/rss/)

```javascript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('articles');
  return rss({
    title: 'KERNEL_PANIC',
    description: 'Technical writing and portfolio',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/articles/${post.id}/`,
    })),
  });
}
```

### Sitemap configuration
Source: [@astrojs/sitemap docs](https://docs.astro.build/en/guides/sitemap/)

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://your-domain.com',
  integrations: [sitemap()],
});
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual XML sitemap | @astrojs/sitemap integration | 2023+ | Auto-generates, better SEO |
| Custom RSS implementation | @astrojs/rss package | 2023+ | Proper spec compliance |
| Static OG images only | Dynamic Satori generation | 2022+ | Each article gets unique preview |
| No image metadata in sitemap | Image sitemap extension | 2021+ | Google Images indexing |

**Deprecated/outdated:**
- Cloudflare Workers-based sitemap: Now handled natively by Astro
- Canvas API for OG images: Replaced by Satori (better font support, SVG output)

---

## Open Questions

1. **OG image generation on Cloudflare Pages**
   - What we know: Satori works with JavaScript, Cloudflare Pages supports Workers
   - What's unclear: Whether @resvg/resvg-js works in Workers environment (WASM)
   - Recommendation: Test in build pipeline first; fallback to static images if WASM fails

2. **Article image extraction**
   - What we know: Markdown content contains images
   - What's unclear: Should we extract first image or require explicit frontmatter?
   - Recommendation: Require explicit `image` frontmatter for clarity and control

3. **RSS vs Atom**
   - What we know: @astrojs/rss generates RSS 2.0 by default
   - What's unclear: Does project need Atom or RSS?
   - Recommendation: RSS 2.0 is sufficient for blog; defer Atom if needed

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.0 + Playwright 1.50 |
| Config file | vitest.config.ts / playwright.config.ts |
| Quick run command | `npm run test:unit` |
| Full suite command | `npm run test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|---------|----------|-----------|-------------------|-------------|
| SEO-01 | Meta tags rendered | e2e | `npx playwright test tests/e2e/seo.spec.ts` | ❌ Needs creation |
| SEO-01 | OG image accessible | e2e | `npx playwright test tests/e2e/og-image.spec.ts` | ❌ Needs creation |
| SEO-02 | RSS feed returns 200 | e2e | `npx playwright test tests/e2e/rss.spec.ts` | ❌ Needs creation |
| SEO-02 | RSS feed valid XML | unit | `npm run test:unit -- tests/unit/rss-validator.test.ts` | ❌ Needs creation |
| SEO-03 | sitemap.xml returns 200 | e2e | `npx playwright test tests/e2e/sitemap.spec.ts` | ❌ Needs creation |
| SEO-03 | robots.txt exists | e2e | `npx playwright test tests/e2e/robots.spec.ts` | ❌ Needs creation |

### Sampling Rate
- **Per task commit:** `npm run test:unit`
- **Per wave merge:** `npm run test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/e2e/seo.spec.ts` — covers SEO-01 meta tags
- [ ] `tests/e2e/og-image.spec.ts` — covers SEO-01 OG image accessibility
- [ ] `tests/e2e/rss.spec.ts` — covers SEO-02 RSS feed endpoint
- [ ] `tests/unit/rss-validator.test.ts` — covers SEO-02 RSS XML validity
- [ ] `tests/e2e/sitemap.spec.ts` — covers SEO-03 sitemap endpoint
- [ ] `tests/e2e/robots.spec.ts` — covers SEO-03 robots.txt endpoint

---

## Sources

### Primary (HIGH confidence)
- [Astro Sitemap Integration](https://docs.astro.build/en/guides/sitemap/) - Official sitemap docs
- [Astro RSS Guide](https://docs.astro.build/en/guides/rss/) - Official RSS docs
- [npm: @astrojs/sitemap](https://www.npmjs.com/package/@astrojs/sitemap) - Package version 3.7.2
- [npm: @astrojs/rss](https://www.npmjs.com/package/@astrojs/rss) - Package version 4.0.18

### Secondary (MEDIUM confidence)
- [Satori GitHub](https://github.com/vercel/satori) - OG image generation library
- [npm: satori](https://www.npmjs.com/package/satori) - Package version 0.26.0

### Tertiary (LOW confidence)
- WebSearch for "Astro SEO best practices" - Verified against official docs

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH - Official Astro packages, verified versions
- Architecture: HIGH - Based on existing project patterns (BaseLayout, content collections)
- Pitfalls: HIGH - Common SEO issues documented in official guides

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (30 days for stable SEO patterns)