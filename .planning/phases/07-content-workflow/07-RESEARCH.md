# Phase 7: Content Workflow - Research

**Researched:** 2026-03-31
**Domain:** Markdown frontmatter parsing, article preview workflow, content publishing flow
**Confidence:** HIGH

## Summary

Phase 7 implements the content submission workflow: user submits Markdown, Claude extracts metadata, user previews and confirms publishing. The workflow builds on existing Phase 6 MCP tools (create_article) and database schema.

**Primary recommendation:** Use gray-matter library for frontmatter parsing, reuse existing slugify from Phase 6, implement validation with Zod (already in project).

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Method**: Frontmatter extraction (YAML block at top of Markdown)
- **Fields**: Minimal set — title, date, tags, excerpt
- **Missing frontmatter**: Fail and ask user to fix before proceeding
- **Preview delivery**: Show in Claude chat as Markdown text
- **Confirmation**: Explicit confirm ("publish" or "confirm") required from user

### Claude's Discretion
- Exact frontmatter parsing library (gray-matter, remark-frontmatter, or custom regex)
- Slug generation algorithm (inherited from Phase 6)
- Draft listing and management workflow
- Error message formatting

### Deferred Ideas (OUT OF SCOPE)
- Article updates (edit existing articles) — v1.2
- Rich media uploads during publish — handled via Git, not this workflow
- Scheduled publishing — manual publish sufficient for MVP

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| WORK-01 | Claude extracts metadata (title, date, tags, excerpt) from raw Markdown | gray-matter 4.0.3 parses YAML frontmatter |
| WORK-02 | Claude generates URL-safe slug from title | Reuse generateSlug from src/lib/mcp/slugify.ts |
| WORK-03 | User sees preview of rendered article before publishing | Display full Markdown in Claude chat |
| WORK-04 | User confirms or rejects article before database write | Chat-based confirm/reject workflow |
| WORK-05 | User can save article as draft (status: 'draft') | MCP create_article accepts status parameter |
| WORK-06 | User can publish draft article (status: 'published') | Requires update_article tool (deferred to v1.2, can add in Phase 7) |
| WORK-07 | System validates required fields (title, date, body) before publish | Zod validation schem a |
| ERR-01 | System returns clear error when title extraction fails | gray-matter returns data with empty fields |
| ERR-02 | System returns clear error when slug collision detected | MCP create_article handles collision + suffix |
| ERR-03 | System returns clear error when database write fails | MCP tool returns success: false with message |
| ERR-05 | System validates Markdown format before processing | gray-matter parses or returns error |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gray-matter | 4.0.3 | Parse YAML frontmatter from Markdown | Most downloaded (47M weekly), simple API, handles all edge cases |
| zod | (project) | Input validation for required fields | Already in project (from Phase 6 MCP server) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| generateSlug | (existing) | URL-safe slug from title | Reuse from src/lib/mcp/slugify.ts |
| createArticle | (existing) | Database insert | Reuse from src/lib/mcp/db.ts |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| gray-matter | remark-frontmatter | remark is heavier (unified ecosystem), gray-matter is standalone |
| gray-matter | Custom regex | Not recommended — edge cases with YAML colons, multiline values |
| gray-matter | front-matter | Less popular (4M vs 47M weekly downloads) |

**Installation:**
```bash
npm install gray-matter
```

**Version verification:** gray-matter 4.0.3 published 2024-12-18 (verified via npm view).

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   ├── content/
│   │   ├── parser.ts       # Markdown + frontmatter parsing
│   │   ├── validator.ts   # Zod validation schemas
│   │   └── workflow.ts    # Publish workflow orchestration
```

### Pattern 1: Markdown Workflow
**What:** User submits raw Markdown → Claude processes → User confirms → Database write

**When to use:** Content submission phases

**Example:**
```typescript
import matter from 'gray-matter';

interface ParsedArticle {
  meta: {
    title: string;
    date?: string;
    tags?: string[];
    excerpt?: string;
  };
  content: string;
}

function parseMarkdown(rawMarkdown: string): ParsedArticle {
  const { data, content } = matter(rawMarkdown);
  return {
    meta: {
      title: data.title,
      date: data.date,
      tags: data.tags,
      excerpt: data.excerpt,
    },
    content,
  };
}
```

### Pattern 2: Validation Schema
**What:** Validate extracted metadata before database write

**When to use:** Before publishing

**Example:**
```typescript
const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  excerpt: z.string().optional(),
  body: z.string().min(100, 'Body must be at least 100 characters'),
});

// Check schema
const result = articleSchema.safeParse({ ...meta, body: content });
if (!result.success) {
  return { valid: false, errors: result.error.flatten() };
}
```

### Anti-Patterns to Avoid
- **Silent failure on missing frontmatter:** Must fail explicitly and ask user to fix (per CONTEXT.md)
- **Partial preview:** User wants full content, not summary
- **Auto-publish without confirmation:** Must require explicit confirm (per CONTEXT.md)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Frontmatter parsing | Custom regex for YAML | gray-matter | Handles escaping, multiline, edge cases |
| Slug generation | Custom algorithm | Reuse generateSlug | Already handles Unicode, collisions |
| Validation | ad-hoc checks | Zod schema | Type-safe, composable, already in project |

**Key insight:** gray-matter is battle-tested with 10+ years of production use. Custom regex will fail on edge cases like colons in values.

## Common Pitfalls

### Pitfall 1: Missing Frontmatter
**What goes wrong:** gray-matter returns empty data object, workflow continues with undefined values

**Why it happens:** User forgets frontmatter block or uses wrong format

**How to avoid:** Check for required fields explicitly after parsing, fail with clear message

**Warning signs:** Parsed title is empty or undefined after gray-matter parse

### Pitfall 2: Body Too Short
**What goes wrong:** Validation fails at database write, user sees generic error

**Why it happens:** Body validation (100 chars minimum) not checked before calling MCP

**How to avoid:** Validate body length before invoking create_article tool

**Warning signs:** MCP tool returns error about body length

### Pitfall 3: Slug Collision Not Handled
**What goes wrong:** Database insert fails with unique constraint error

**Why it happens:** generateSlug called but collision not checked before MCP call

**How to avoid:** Use MCP create_article which handles collision internally (adds -1, -2 suffix)

**Note:** Phase 6 MCP tool already handles slug collision — no additional work needed

## Code Examples

### Full Workflow Implementation
```typescript
import matter from 'gray-matter';
import { generateSlug } from './slugify';
import { createArticle } from './db';
import { z } from 'zod';

// Validation schema
const frontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required in frontmatter'),
  date: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  excerpt: z.string().optional(),
});

const articleContentSchema = z.object({
  title: z.string(),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  excerpt: z.string().optional(),
  body: z.string().min(100, 'Body must be at least 100 characters'),
});

/**
 * Process submitted Markdown and prepare for preview.
 */
export function processMarkdown(rawMarkdown: string): {
  success: boolean;
  data?: {
    meta: { title: string; date?: string; tags?: string[]; excerpt?: string };
    body: string;
    slug: string;
  };
  error?: string;
} {
  // Parse frontmatter
  const { data, content } = matter(rawMarkdown);

  // Validate frontmatter
  const frontmatterResult = frontmatterSchema.safeParse(data);
  if (!frontmatterResult.success) {
    const issues = frontmatterResult.error.issues.map(i => i.message).join(', ');
    return { success: false, error: `Missing or invalid frontmatter: ${issues}` };
  }

  // Validate body length
  if (content.length < 100) {
    return { success: false, error: 'Body must be at least 100 characters' };
  }

  // Combine for full validation
  const fullData = { ...frontmatterResult.data, body: content };
  const fullResult = articleContentSchema.safeParse(fullData);
  if (!fullResult.success) {
    const issues = fullResult.error.issues.map(i => i.message).join(', ');
    return { success: false, error: `Validation failed: ${issues}` };
  }

  // Generate slug
  const slug = generateSlug(frontmatterResult.data.title);

  return {
    success: true,
    data: {
      meta: frontmatterResult.data,
      body: content,
      slug,
    },
  };
}

/**
 * Publish article to database.
 */
export async function publishArticle(
  meta: { title: string; date?: string; tags?: string[]; excerpt?: string },
  body: string,
  status: 'draft' | 'published' = 'draft'
) {
  const article = await createArticle({
    title: meta.title,
    body,
    date: meta.date,
    tags: meta.tags,
    excerpt: meta.excerpt,
    status,
  });

  return article;
}
```

### Claude Chat Interaction Flow
```markdown
## Content Submission Workflow

User provides Markdown:
```markdown
---
title: My Article Title
date: 2026-03-31
tags: [tech, tutorial]
excerpt: A short description
---

# My Article

Content goes here...
```

Claude processes:
1. Parses frontmatter with gray-matter
2. Validates required fields (title, body > 100 chars)
3. Generates slug from title
4. Shows preview to user

Preview shown to user:
---
**Title:** My Article Title
**Date:** 2026-03-31
**Tags:** tech, tutorial
**Excerpt:** A short description
**Slug:** my-article-title

**Body preview:**
# My Article

Content goes here...
---

User confirms: "publish" → Claude calls create_article with status: 'published'
User rejects: "discard" → Claude asks if they want to save as draft first
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|------------|------------------|-------------|--------|
| Manual database insert | MCP create_article tool | Phase 6 | Standardized API with validation |
| Custom regex parsing | gray-matter library | Phase 7 | Reliable frontmatter parsing |
| No draft support | Status parameter in create | Phase 7 | Full workflow with draft option |

**Deprecated/outdated:**
- Custom YAML regex parsing: Will fail on edge cases, use gray-matter

## Open Questions

1. **Draft publication workflow**
   - What we know: create_article supports status: 'draft', but no update_article tool exists yet
   - What's unclear: WORK-06 (publish draft) requires updating status — needs new MCP tool or re-use existing
   - Recommendation: Add updateArticle to MCP server in Phase 7, or use direct database update

2. **Draft listing**
   - What we know: list_articles can filter by status='draft'
   - What's unclear: No dedicated "view drafts" workflow defined
   - Recommendation: Use existing list_articles with status filter

## Validation Architecture

> Validation section included — workflow.nyquist_validation not explicitly disabled in config.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest (project default from Phase 6) |
| Config file | vitest.config.ts |
| Quick run command | `npm test` |
| Full suite command | `npm test -- --run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| WORK-01 | Extract metadata from Markdown | unit | `npm test -- src/lib/content/parser.ts` | New file |
| WORK-02 | Generate slug from title | unit | `npm test -- src/lib/content/workflow.ts` | New file |
| WORK-03 | Preview displays full content | integration | `npm test -- src/lib/content/workflow.ts` | New file |
| WORK-04 | Confirm/reject workflow | manual | Not easily automated | N/A |
| WORK-05 | Save as draft | integration | `npm test -- src/lib/content/workflow.ts` | New file |
| WORK-06 | Publish draft | integration | Requires update tool test | Depends |
| WORK-07 | Validate required fields | unit | `npm test -- src/lib/content/validator.ts` | New file |
| ERR-01 | Title extraction error | unit | `npm test -- src/lib/content/parser.ts` | New file |
| ERR-02 | Slug collision handling | unit | Covered by Phase 6 | ✅ |
| ERR-03 | Database write failure | integration | Covered by Phase 6 | ✅ |
| ERR-05 | Markdown format validation | unit | `npm test -- src/lib/content/parser.ts` | New file |

### Sampling Rate
- **Per task commit:** `npm test -- --run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/lib/content/` — new directory for workflow modules
- [ ] `src/lib/content/parser.ts` — gray-matter wrapper
- [ ] `src/lib/content/validator.ts` — Zod validation schemas
- [ ] `src/lib/content/workflow.ts` — orchestration logic
- [ ] Update MCP server if adding update_article tool for WORK-06

## Sources

### Primary (HIGH confidence)
- gray-matter 4.0.3 — npm registry verified, 47M weekly downloads
- existing project code — src/lib/mcp/slugify.ts, src/lib/mcp/db.ts, src/db/schema.ts

### Secondary (MEDIUM confidence)
- Zod documentation for validation patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - gray-matter is clear industry standard
- Architecture: HIGH - reusing existing Phase 6 tools
- Pitfalls: HIGH - well-documented patterns

**Research date:** 2026-03-31
**Valid until:** ~30 days — library APIs stable