---
phase: 04-seo-launch
plan: 05
status: complete
completed: 2026-03-30
wave: 4
gap_closure: true
---

## Summary

### Task Completed
Wired article-specific OG images in `src/pages/articles/[slug].astro` by adding the `image` prop to the BaseLayout component call.

### What Was Done
- Modified `src/pages/articles/[slug].astro` line 41 to add `image={\`/og/${entry.id}.svg\`}` prop to BaseLayout
- This passes the article-specific OG image URL to BaseLayout, which sets the `og:image` meta tag for social sharing

### Key Files Modified
- `src/pages/articles/[slug].astro` — Added `image` prop to BaseLayout

### Verification
- ✅ `grep 'image={\`/og/${entry.id}.svg\`}' src/pages/articles/\[slug\].astro` returns match

### Result
When users share article links on social media, they will now see the article-specific OG image with the article title and KERNEL_PANIC branding, instead of the default OG image.