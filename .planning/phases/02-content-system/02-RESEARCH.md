# Phase 02: Content System - Research

**Researched:** 2026-03-28
**Domain:** Astro Content Collections, Markdown rendering, Client-side search
**Confidence:** HIGH

## Summary

Phase 2 implements the articles system for the blog using Astro's native Content Collections API. The phase includes article list with Bento cards, individual article pages with Markdown rendering, Shiki syntax highlighting matching Terminal card aesthetic, and client-side search with Fuse.js. Key decisions from CONTEXT.md lock in the frontmatter schema (Zod), Terminal-style code blocks (#111 background), and infinite scroll loading.

**Primary recommendation:** Use Astro 6.1.1's built-in Content Collections with Zod schema validation, Shiki for syntax highlighting (zero-config), and Fuse.js for client-side search. Create article content in `src/content/articles/` with frontmatter matching the defined schema.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Content width:** 800-900px for article pages
- **Typography:** Inter for body, JetBrains Mono for code
- **Code blocks:** Match Terminal card style (#111 background, monochrome colors)
- **Code block features:** Copy button on every code block
- **Article metadata:** Reading time + date + tags below title
- **No cover image in article header**
- **Folder structure:** Flat — all articles in `src/content/articles/`
- **Frontmatter schema:** title (string), date (date), tags (array), excerpt (optional), coverImage (optional), draft (optional)
- **Tag set:** Fixed — ML, Systems, Tutorial, Project, Notes
- **Search:** Client-side with Fuse.js, OR logic for tags, infinite scroll
- **Empty states:** "暂无文章" and "没有找到匹配的文章"

### Deferred Ideas (OUT OF SCOPE)
- Table of contents for long articles (v2)
- Related articles suggestions (v2)
- Article series/grouping (v2)
- Comments system (v2)
- Reading progress indicator (v2)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ART-01 | Article list with title, excerpt, date, and tags | Astro Content Collections + Bento card components |
| ART-02 | Individual article page with full content rendering | Astro Dynamic Routes + Markdown rendering |
| ART-03 | Markdown content from Git-managed files | Astro Content Collections with MD/MDX |
| ART-04 | Syntax highlighting for code blocks | Shiki (built into Astro) |
| ART-05 | Search and filter functionality (by tag, title) | Fuse.js client-side search + tag filters |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | ^6.1.1 | Framework | Already in project, built-in Content Collections |
| @astrojs/react | ^5.0.2 | React integration | Already in project for interactive components |
| zod | ^3.x | Schema validation | Astro's recommended validation library for Content Collections |
| shiki | (built-in) | Syntax highlighting | Astro default, zero-config, matches Terminal aesthetic |
| fuse.js | ^latest | Client-side search | Lightweight fuzzy search for article filtering |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/mdx | ^latest | Extended markdown | If articles need components in markdown |
| reading-time | ^latest | Reading time calculation | Auto-calculate read time from content |

**Installation:**
```bash
npm install zod fuse.js
```

**Version verification:**
- astro: 6.1.1 (latest stable, published March 2025)
- zod: ^3.x (latest)
- fuse.js: latest from npm

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── content/
│   ├── config.ts           # Content Collection schema definition
│   └── articles/           # Flat article directory
│       ├── article-1.md
│       ├── article-2.md
│       └── ...
├── components/
│   ├── articles/
│   │   ├── ArticleCard.astro      # Bento card for article list
│   │   ├── ArticleList.astro      # Grid container with filters
│   │   ├── TagFilter.tsx          # React tag pill buttons
│   │   ├── SearchInput.tsx        # React search component
│   │   └── CodeBlock.astro         # Code block with copy button
│   └── cards/
│       └── ...                     # Reuse existing Bento cards
├── pages/
│   ├── articles.astro              # Article list page
│   └── articles/[slug].astro      # Individual article page
└── lib/
    └── search.ts                   # Fuse.js search logic
```

### Pattern 1: Astro Content Collections with Zod
**What:** Define Content Collection schema for type-safe article frontmatter
**When to use:** Every article-based Astro site
**Example:**
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.enum(['ML', 'Systems', 'Tutorial', 'Project', 'Notes'])),
    excerpt: z.string().optional(),
    coverImage: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { articles };
```

### Pattern 2: Dynamic Routes for Individual Articles
**What:** Use `[slug].astro` for dynamic article pages
**When to use:** Creating individual article pages from Content Collection
**Example:**
```typescript
// src/pages/articles/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
```

### Pattern 3: Client-Side Search with Fuse.js
**What:** Load article metadata client-side, search with Fuse.js
**When to use:** Need search without server-side infrastructure
**Example:**
```typescript
// Generate search index at build time
const articles = await getCollection('articles');
const searchIndex = articles.map(a => ({
  slug: a.slug,
  title: a.data.title,
  content: a.body, // raw body for full-text search
  tags: a.data.tags,
}));
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown parsing | Custom markdown parser | Astro Content Collections | Built-in, handles frontmatter, MDX support |
| Syntax highlighting | Prism.js or highlight.js | Shiki (Astro default) | Zero-config, VS Code themes, no JS runtime |
| Fuzzy search | Custom algorithm | Fuse.js | Lightweight, handles typos, configurable |
| Reading time | Calculate manually | reading-time package | Accurate WPM-based calculation |

**Key insight:** Astro's Content Collections provide type-safe content management out of the box. Shiki integrates at build time with zero runtime JavaScript. Fuse.js is the lightest client-side search library.

---

## Common Pitfalls

### Pitfall 1: Content Collection Not Configured
**What goes wrong:** `getCollection` fails with "Collection 'articles' does not exist"
**Why it happens:** Forgetting to define the collection in `src/content/config.ts`
**How to avoid:** Always create `src/content/config.ts` with schema definition
**Warning signs:** Build errors about missing collection

### Pitfall 2: Schema Validation Errors
**What goes wrong:** Articles fail to build due to frontmatter validation errors
**Why it happens:** Frontmatter doesn't match Zod schema (wrong types, missing required fields)
**How to avoid:** Test frontmatter against schema, use optional for non-required fields
**Warning signs:** `ZodError` in build output

### Pitfall 3: Shiki Theme Not Matching Terminal Aesthetic
**What goes wrong:** Code blocks look different from Terminal cards
**Why it happens:** Default Shiki theme doesn't match #111 background
**How to avoid:** Configure Shiki theme or create custom theme matching Terminal colors
**Warning signs:** Code blocks have light background or different color scheme

### Pitfall 4: Large Search Index
**What goes wrong:** Slow page loads due to large search index
**Why it happens:** Including full article content in search index
**How to avoid:** Index only title and excerpt, lazy-load full content search
**Warning signs:** Bundle size > 500KB, slow initial render

---

## Code Examples

### Article Frontmatter (Markdown)
```markdown
---
title: "Understanding Transformer Attention"
date: 2026-03-28
tags: ["ML", "Tutorial"]
excerpt: "A deep dive into the attention mechanism that powers modern language models."
draft: false
---

# Understanding Transformer Attention

The attention mechanism is the core innovation...
```

### Article Card Component (Bento Style)
```astro
---
// src/components/articles/ArticleCard.astro
import type { CollectionEntry } from 'astro:content';

interface Props {
  article: CollectionEntry<'articles'>;
}

const { article } = Astro.props;
const { title, date, tags, excerpt, coverImage } = article.data;
---

<article class="article-card">
  {coverImage && <img src={coverImage} alt={title} class="card-image" />}
  <div class="card-content">
    <h3 class="card-title">{title}</h3>
    <p class="card-excerpt">{excerpt}</p>
    <div class="card-meta">
      <time datetime={date.toISOString()}>
        {date.toISOString().split('T')[0]}
      </time>
      <div class="card-tags">
        {tags.map(tag => <span class="tag">{tag}</span>)}
      </div>
    </div>
  </div>
</article>

<style>
  .article-card {
    background: var(--color-card-light);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.2s ease;
  }
  .article-card:hover {
    transform: translateY(-4px);
  }
</style>
```

### Copy Button for Code Blocks
```astro
---
// src/components/articles/CodeBlock.astro
---
<div class="code-block-wrapper">
  <button class="copy-button" data-code={Astro.props.code}>
    Copy
  </button>
  <slot />
</div>

<script>
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(
        button.getAttribute('data-code')
      );
      button.textContent = 'Copied!';
      setTimeout(() => button.textContent = 'Copy', 2000);
    });
  });
</script>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom markdown parsing | Astro Content Collections | Astro 2.0+ | Type-safe frontmatter, built-in validation |
| Client-side Prism.js | Shiki (build-time) | Astro 3.0+ | Zero runtime JS, better themes |
| Page-based pagination | Infinite scroll | Current | Better mobile UX, no page breaks |
| Server-side search | Client-side Fuse.js | Current | No server needed, works on static site |

**Deprecated/outdated:**
- `@astrojs/markdown-remark` - Replaced by Content Collections
- Prism.js - Replaced by Shiki (built-in)
- Server-side search - Unnecessary for static blog

---

## Open Questions

1. **Should articles use MDX or plain Markdown?**
   - What we know: MDX allows components in markdown, adds complexity
   - What's unclear: Whether articles need embedded components
   - Recommendation: Start with plain Markdown, upgrade to MDX if needed

2. **How to implement infinite scroll?**
   - What we know: CONTEXT.md specifies infinite scroll, not pagination
   - What's unclear: Use Intersection Observer or virtual scrolling?
   - Recommendation: Use Intersection Observer for simplicity, load batches of 6-10 articles

3. **Where to store search index?**
   - What we know: Client-side search needs index loaded in browser
   - What's unclear: Embed in page or fetch on demand?
   - Recommendation: Generate JSON at build time, fetch on first search interaction

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest + Testing Library (already installed) |
| Config file | vitest.config.ts (exists in project) |
| Quick run command | `npm run test:unit` |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|---------------|
| ART-01 | Article list renders with title, excerpt, date, tags | Unit | `npm run test:unit` | YES - src/tests/unit/ exists |
| ART-02 | Individual article page renders markdown | Unit | `npm run test:unit` | YES - src/tests/unit/ exists |
| ART-03 | Frontmatter validates against Zod schema | Unit | `npm run test:unit` | YES - src/tests/unit/ exists |
| ART-04 | Code blocks have syntax highlighting + copy button | Unit | `npm run test:unit` | YES - src/tests/unit/ exists |
| ART-05 | Search returns filtered results | Unit | `npm run test:unit` | YES - src/tests/unit/ exists |

### Sampling Rate
- **Per task commit:** `npm run test:unit`
- **Per wave merge:** `npm run test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/tests/unit/articles/` — tests for ArticleCard, ArticleList, TagFilter, SearchInput components
- [ ] `src/tests/unit/content/` — tests for Content Collection schema validation
- [ ] `src/tests/setup.ts` — already exists, may need article-specific fixtures
- None — existing test infrastructure covers framework, need article-specific tests

---

## Sources

### Primary (HIGH confidence)
- Astro Content Collections official docs - https://docs.astro.build/en/guides/content-collections/
- Astro 6.1.1 release notes - https://github.com/withastro/astro/releases
- Shiki integration in Astro - https://docs.astro.build/en/guides/markdown/#syntax-highlighting

### Secondary (MEDIUM confidence)
- Fuse.js documentation - https://www.fusejs.com/
- Zod documentation - https://zod.dev/

### Tertiary (LOW confidence)
- Web search for "Astro infinite scroll pattern" - needs validation

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH - Astro 6.1.1 verified, libraries confirmed in project
- Architecture: HIGH - Content Collections pattern well-established
- Pitfalls: MEDIUM - Common pitfalls identified from Astro docs and community

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (30 days for stable stack)