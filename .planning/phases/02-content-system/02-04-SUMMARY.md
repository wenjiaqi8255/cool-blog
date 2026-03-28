---
phase: 02-content-system
plan: 04
subsystem: Article Discovery
tags: [tag-filter, search, fuzzy-search, infinite-scroll]
dependency_graph:
  requires:
    - 02-02 (Article Card & Article Page)
  provides:
    - TagFilter component with OR logic
    - SearchInput with debounce
    - Fuse.js client-side search
    - Infinite scroll on article list
  affects:
    - /articles page
tech_stack:
  added:
    - fuse.js (already in package.json)
  patterns:
    - Client-side Fuse.js search with weighted keys
    - OR logic tag filtering
    - DOM-based infinite scroll
key_files:
  created:
    - src/components/articles/TagFilter.tsx
    - src/components/articles/SearchInput.tsx
    - src/lib/search.ts
  modified:
    - src/components/articles/ArticleList.astro
decisions:
  - Used Fuse.js with weighted keys (title 2x, tags 1.5x, excerpt/content 1x)
  - Implemented OR logic for tag filtering (shows articles with ANY selected tag)
  - Used DOM-based approach: render all articles initially, toggle visibility based on filters
  - Infinite scroll via "load more" button (not intersection observer for simplicity)
---

# Phase 02 Plan 04: Tag Filter & Search Summary

## Summary

Implement client-side search and tag filter functionality with infinite scroll. Users can filter articles by tags (OR logic) and search by title/content using Fuse.js.

## Implementation Details

### Task 1: TagFilter Component

- Created `src/components/articles/TagFilter.tsx`
- Fixed tag set: ['ML', 'Systems', 'Tutorial', 'Project', 'Notes']
- Pill button UI: outline default, filled when selected (#111 bg, white text)
- Label: "按标签筛选" above the pill buttons
- Props: availableTags, selectedTags, onChange callback

### Task 2: SearchInput Component

- Created `src/components/articles/SearchInput.tsx`
- Input placeholder: "搜索文章标题或内容..."
- 300ms debounce delay before triggering search
- Clear button (×) to reset search query
- Props: onSearch callback

### Task 3: Search Utility (Fuse.js)

- Created `src/lib/search.ts`
- createSearchIndex(articles): builds Fuse.js search index
- search(query): performs fuzzy search with weighted keys
- Keys: title (weight 2), excerpt (1), content (1), tags (1.5)
- Threshold: 0.3 for fuzzy matching

### Task 4: ArticleList Integration

- Updated `src/components/articles/ArticleList.astro`
- Added TagFilter and SearchInput at top of list
- Client-side search index initialization on page load
- Tag filter: OR logic (shows articles with ANY selected tag)
- Search: fuzzy match on title, excerpt, content, tags
- Infinite scroll: "load more" button when more articles available
- Empty state: "没有找到匹配的文章" when no results
- Article count display: "{N} 篇文章"

## Verification

- Build passes: `npm run build` completes successfully
- Tag filtering: Selecting ML shows all ML-tagged articles
- Search: Typing "hello" matches articles with "hello" in title/content
- No results: Searching non-existent term shows "没有找到匹配的文章"

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check

- [x] TagFilter.tsx: created with pill buttons and 按标签筛选 label
- [x] SearchInput.tsx: created with 300ms debounce and clear button
- [x] search.ts: created with Fuse.js integration
- [x] ArticleList.astro: integrated search/filter and infinite scroll
- [x] Build passes: npm run build succeeds
- [x] "没有找到匹配的文章" present in ArticleList.astro
- [x] Commits exist: 966ef787, 10c9d4a6, 8e7bf791, 916bdfe8

## Self-Check: PASSED

---

**Duration:** ~3 minutes
**Completed:** 2026-03-28