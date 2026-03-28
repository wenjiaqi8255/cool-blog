# Phase 2: Content System - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can browse, read, and search technical articles with excellent readability and code syntax highlighting. This phase delivers: article list with Bento cards, individual article pages with markdown rendering, syntax highlighting, and client-side search/filter. Newsletter backend (Phase 3) and SEO (Phase 4) are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Article Reading Experience (Layout & Typography)
- **Content width:** 800-900px (medium — balances readability with space for code/screenshots)
- **Typography:** Inter for body text, JetBrains Mono for code
- **Code blocks:** Match Terminal card style — dark background (#111), monochrome colors, consistent with Portfolio visual identity
- **Code block features:** Copy button on every code block
- **Article metadata:** Reading time estimate + date + tags displayed below article title
- **No cover image in article header** — keep it minimal and fast

### Content Organization (Markdown Structure)
- **Folder structure:** Flat — all articles in `src/content/articles/` sorted by `date` frontmatter field
- **Frontmatter schema (Zod):**
  - `title` (string, required) — article title
  - `date` (date, required) — publication date
  - `tags` (array of strings, required) — fixed tag set
  - `excerpt` (string, optional) — short description for article cards; auto-generate from first paragraph if omitted
  - `coverImage` (string, optional) — URL/path to cover image
  - `draft` (boolean, optional) — draft articles not published
- **Tag set (fixed):** Define a constrained list (e.g., ML, Systems, Tutorial, Project, Notes) — prevent tag sprawl
- **Reference:** Aligned with user's existing Notion blog field structure (title, status/draft, date, tags, cover image, body)

### Article List Presentation
- **Layout:** Bento cards — consistent with Portfolio tab visual language
- **Card info shown:** Cover image (if available), title, excerpt, date, tags
- **No pagination** — use infinite scroll instead (see Search & Filter)
- **Empty state:** Simple text "暂无文章" — minimalist

### Search & Filter Behavior
- **Filter mechanism:** Tag pill buttons at top of article list
- **Tag logic:** OR — selecting multiple tags shows articles with ANY of those tags (not all)
- **Search box:** Optional search input alongside tag filters
- **Search scope:** Client-side search — search article title and content (Fuse.js or similar, no server needed)
- **Loading:** Infinite scroll — load more articles as user scrolls
- **No results:** Simple text "没有找到匹配的文章"

### Syntax Highlighting
- **Library:** Shiki (Astro's built-in, zero-config)
- **Theme:** Dark theme matching Terminal card aesthetic
- **Copy button:** Required on all code blocks

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System
- `.planning/PROJECT.md` — Brand identity, typography (Inter + JetBrains Mono), color palette, constraints
- `.planning/REQUIREMENTS.md` — ART-01 through ART-05 requirements
- `.planning/phases/01-foundation-bento-grid/01-CONTEXT.md` — Bento Grid patterns, card system, Terminal card aesthetic, animations, color palette

### Technical Stack
- `.planning/STATE.md` — Key decisions: Astro, Cloudflare Pages, Tailwind CSS v4
- `astro.config.mjs` — Current Astro config with Cloudflare adapter and React integration

No external ADRs or spec documents — requirements captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Card components** (`src/cards/`) — Bento card system with hover animations available; adapt for article cards
- **Tailwind v4 theme** — Colors and typography tokens already defined via `@theme` directive; reuse for article styles
- **Terminal card** — Dark theme (#111 background) already implemented; reuse for code block styling
- **Navigation** — Tab system already in place, Articles tab ready to populate

### Established Patterns
- **Bento Grid responsive layout** — 4-col → 2-col → 1-col breakpoints; reuse for article list
- **Configuration-driven approach** — Card placements defined in TS config files; article data through Astro Content Collections
- **Hover animations** — Card hover transitions established; apply consistent animation patterns

### Integration Points
- **Astro Content Collections** — New `articles` collection with Zod schema validation
- **Tab navigation** — Articles tab on index page already wired; connects to article list route
- **Portfolio/Articles transition** — Same Bento Grid container, different card templates

</code_context>

<specifics>
## Specific Ideas

- User has existing Notion blog — field structure (title, status/draft, date, tags, cover, body) maps directly to Astro frontmatter
- "Terminal aesthetic" is a core brand identity — code blocks must feel native to this theme, not like a generic blog
- Bento cards for articles should feel like natural extension of portfolio cards — same grid, different content density
- Reading time estimate should be auto-calculated (words / 200 WPM)

</specifics>

<deferred>
## Deferred Ideas

- Table of contents for long articles (v2)
- Related articles suggestions (v2)
- Article series/grouping (v2)
- Comments system (v2)
- Reading progress indicator (v2)

</deferred>

---

*Phase: 02-content-system*
*Context gathered: 2026-03-28*
