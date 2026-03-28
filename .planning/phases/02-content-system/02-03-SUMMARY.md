---
phase: 02-content-system
plan: 03
subsystem: Content Display
tags: [code-blocks, syntax-highlighting, shiki, copy-button]
dependency_graph:
  requires:
    - 02-02 (Article Card & Article Page)
  provides:
    - Shiki syntax highlighting configured
    - Copy button on all code blocks
    - Code block styling matching Terminal card
  affects:
    - Article pages (/articles/[slug])
tech_stack:
  added: []
  patterns:
    - Shiki markdown rendering via Astro config
    - Client-side copy functionality with clipboard API
key_files:
  created:
    - src/components/articles/CodeBlock.astro
  modified:
    - astro.config.mjs (added shikiConfig)
    - src/pages/articles/[slug].astro (added copy button script and styles)
    - src/styles/global.css (added code block styles)
decisions:
  - Used github-dark Shiki theme (closest to Terminal card #111 aesthetic)
  - Implemented copy button via client-side script (not pre-rendered)
  - Used textContent instead of innerHTML for security (XSS prevention)
---

# Phase 02 Plan 03: Code Blocks with Syntax Highlighting

## Summary

Configure Shiki syntax highlighting with Terminal card aesthetic (#111 background) and add copy button to all code blocks in articles.

## Implementation Details

### Task 1: Configure Shiki theme in Astro config

- Added `shikiConfig` to astro.config.mjs
- Theme: `github-dark` (closest to Terminal card #111 aesthetic)
- Enabled line wrapping with `wrap: true`

### Task 2: Create CodeBlock component (reference)

- Created src/components/articles/CodeBlock.astro as reference component
- Actual copy button functionality implemented inline in [slug].astro for simpler integration

### Task 3: Add copy button to article pages

- Added client-side script to [slug].astro that:
  - Finds all `.article-body pre` blocks
  - Wraps each in `.code-block-wrapper`
  - Adds copy button with click handler
  - Shows "Copied!" for 2 seconds after copying

### Task 4: Add code block styling

- Added styles to global.css:
  - `pre`: #111 background, 8px border-radius, 16px padding
  - `code`: JetBrains Mono, 14px
  - `.copy-button`: positioned top-right, semi-transparent background

- Added scoped styles in [slug].astro for article-specific overrides

## Verification

- Build passes: `npm run build` completes successfully
- Code blocks in articles have #111 background
- Copy button is injected via JavaScript on page load

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check

- [x] astro.config.mjs: shikiConfig with github-dark theme
- [x] CodeBlock.astro: created (reference component)
- [x] [slug].astro: copy button script added
- [x] global.css: code block styles added
- [x] Build passes: npm run build succeeds
- [x] Commit exists: 83d8b459

## Self-Check: PASSED

---

**Duration:** ~2 minutes
**Completed:** 2026-03-28