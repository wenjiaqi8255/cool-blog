---
phase: 02-content-system
plan: 02
subsystem: Content Display
tags: [article-list, article-page, bento-grid, markdown-rendering]
dependency_graph:
  requires:
    - 02-01 (Content Collections Setup)
  provides:
    - ArticleCard.astro component
    - ArticleList.astro component
    - /articles/ page
    - /articles/[slug] dynamic route
  affects:
    - Navigation (links to articles)
tech_stack:
  added: []
  patterns:
    - Astro dynamic routing with getStaticPaths
    - Astro content rendering with render() function
    - Bento Grid for article list layout
key_files:
  created:
    - src/components/articles/ArticleCard.astro
    - src/components/articles/ArticleList.astro
    - src/pages/articles/index.astro
    - src/pages/articles/[slug].astro
  modified:
    - src/pages/articles.astro (removed - duplicate route)
decisions:
  - Used article.id instead of article.slug for dynamic route params (Astro 6 glob loader compatibility)
  - Removed duplicate articles.astro page causing route collision
  - Used render() from astro:content for markdown rendering instead of entry.render()
---

# Phase 02 Plan 02: Article Card & Article Page

## Summary

Create article list and individual article pages with Bento Grid layout matching portfolio visual language. Article pages render full markdown content with proper typography and code styling.

## Implementation Details

### Task 1: Create ArticleCard component

- Created `src/components/articles/ArticleCard.astro`
- Props: `article: CollectionEntry<'articles'>`
- Displays: cover image (if available), title, excerpt, reading time, date (YYYY-MM-DD), tags
- Bento card styling with hover animation (translateY -4px)
- Tags: pill style with outline (not filled)
- Card min-height: 200px

### Task 2: Create ArticleList component

- Created `src/components/articles/ArticleList.astro`
- Fetches all articles via `getCollection('articles')`
- Filters out drafts (draft: true)
- Sorts by date descending (newest first)
- Renders BentoGrid container with ArticleCard components
- Empty state: "暂无文章" (per UI-SPEC.md)

### Task 3: Create article list page

- Created `src/pages/articles/index.astro`
- Extends BaseLayout
- Page title: "Articles" with description
- Imports and renders ArticleList component
- Shows article count in metadata

### Task 4: Create individual article page

- Created `src/pages/articles/[slug].astro`
- Dynamic route with `getStaticPaths`
- Content width: 800px centered
- Article header: title, reading time, date, tags (no cover image)
- Body: Inter 16px, 1.5 line-height, code blocks with #111 background
- Markdown rendering via `render()` from astro:content

### Deviation: Fix route collision

- **Found during:** Build verification
- **Issue:** Route "/articles" defined in both articles/index.astro and articles.astro
- **Fix:** Removed src/pages/articles.astro (duplicate)
- **Files modified:** Removed src/pages/articles.astro

### Deviation: Fix dynamic route param

- **Found during:** Build verification
- **Issue:** article.slug was empty/undefined in glob loader mode
- **Fix:** Used article.id instead of article.slug for params
- **Files modified:** src/pages/articles/[slug].astro

### Deviation: Fix render method

- **Found during:** Build verification
- **Issue:** entry.render() is not a function in Astro 6 with glob loader
- **Fix:** Used render() function from astro:content
- **Files modified:** src/pages/articles/[slug].astro

## Verification

- Build passes: `npm run build` completes successfully
- Articles page accessible: `/articles/` renders
- Article page accessible: `/articles/hello-world/` renders
- Content rendered: Markdown with code blocks displayed

## Self-Check

- [x] ArticleCard.astro: CollectionEntry import, min-height 200px
- [x] ArticleList.astro: getCollection, BentoGrid used
- [x] Article page: getStaticPaths, render() function
- [x] Files created: 4 new files
- [x] Commit exists: beb279eb

## Self-Check: PASSED