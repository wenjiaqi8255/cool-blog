# Phase 9: UI/UX Polish and Content Management - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Polish UI styling, fix layout issues, implement variable-driven content management, and enhance interactions. This phase delivers:
- Header displays frosted glass effect on scroll
- Code blocks have gray background with black text (readable)
- Images display correctly in article content
- Tags appear as capsules with borders
- Articles page has proper margins and consistent left alignment
- Page titles and descriptions are variable-driven (config file)
- Portfolio data sourced from Articles database
- Tab selection state (black background, white text)
- Portfolio detail modal instead of page navigation
- Modular Portfolio component with parameters (image, size, etc.)
- Photo-based card variant with parameter control

This does NOT include: Search/filter improvements (Phase 2 covered basic filters), new content types, or backend changes.

</domain>

<decisions>
## Implementation Decisions

### Header Styling
- **Frosted glass effect on scroll**: When user scrolls down, header gets backdrop-blur with semi-transparent background
- **Implementation**: CSS backdrop-filter + transparent background, triggered by scroll event
- **Mobile**: Same effect applies on mobile

### Code Block Styling
- **Theme**: Dark theme for ALL code blocks (matches TerminalCard.astro pattern)
- **Colors**: #1f1f1f background + #111111 text (gray bg, black text for readability)
- **Applies to**: All code blocks in article content, not just TerminalCard
- **Copy button**: Keep existing copy functionality

### Image Display in Articles
- **Responsive width**: Images scale to fit article width, maintain aspect ratio
- **Styling**: Rounded corners, subtle shadow
- **Alt text**: Required for accessibility

### Tag Styling
- **Capsule shape**: Rounded pill/badge style with border
- **Appearance**: Border (not filled), text inside
- **Colors**: Use existing color palette (ink-gray border, ink-black text)
- **Size**: Consistent with existing tag styles

### Articles Page Layout
- **Margins**: Consistent left/right margins matching rest of site
- **Alignment**: Left-aligned content, consistent with overall layout
- **Grid**: Maintain existing bento card grid system
- **Spacing**: 4px gaps between cards (from Phase 1)

### Content Management (Variable-Driven)
- **Page titles**: Single config file for all page titles and descriptions
- **Config location**: `src/config/content.ts` or similar
- **Structure**: Export objects with title/description per page
- **Fallbacks**: Default values if config missing

### Portfolio Data Source
- **Source**: Articles database (Neon Postgres)
- **Filter**: Query articles with 'portfolio' tag or similar marker
- **Reuse**: Use existing article query patterns from Phase 8

### Tab Selection State
- **Active tab**: Black background, white text
- **Inactive tab**: Default styling (transparent/white bg, black text)
- **Transition**: Smooth color transition on state change
- **Component**: Update TabNavigation.tsx

### Portfolio Detail View
- **Mechanism**: Modal overlay (not page navigation)
- **Behavior**: Click portfolio card → modal opens with full details
- **Modal content**: Full article/project details, images, links
- **Close**: Click outside modal or X button to close
- **Mobile**: Full-screen modal on mobile

### Portfolio Component Structure
- **Single modular component**: `PortfolioCard.astro` or similar
- **Props**: image, size, title, description, tags, link (all configurable)
- **Variants**: Standard card, photo-based card (controlled by props)
- **Size parameter**: Control card dimensions (small, medium, large)
- **Reusability**: Can be used in different contexts (homepage, portfolio page)

### Claude's Discretion
- Exact scroll threshold for header glass effect
- Modal animation/transition timing
- Portfolio card hover effects
- Exact image border radius and shadow values
- Tag font size and padding

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — UI-01 through UI-11 requirements
- `.planning/PROJECT.md` — Brand identity, typography, color palette, constraints

### Prior Context (Design Patterns)
- `.planning/phases/01-foundation-bento-grid/01-CONTEXT.md` — Bento Grid patterns, Terminal card aesthetic, animations, color palette
- `.planning/phases/02-content-system/02-CONTEXT.md` — Code block styling, Shiki syntax highlighting
- `.planning/phases/08-astro-integration/08-CONTEXT.md` — Database query patterns, article rendering

### Existing Components (Reuse Patterns)
- `src/components/cards/TerminalCard.astro` — Dark theme card pattern (#111 bg, white text)
- `src/components/articles/ArticleCard.astro` — Article card structure, tag display
- `src/components/interactive/TabNavigation.tsx` — Existing tab component to update
- `src/components/layout/Header.astro` — Header structure for glass effect
- `src/lib/articles.ts` — Database query functions (extend for portfolio filter)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **TerminalCard.astro**: Dark theme pattern with #111 background, white text — replicate for code blocks
- **ArticleCard.astro**: Card structure, tag display, hover effects — adapt for portfolio cards
- **TabNavigation.tsx**: Tab component already exists — update selection state styling
- **Header.astro**: Header structure in place — add scroll listener and glass effect
- **Article queries**: `listPublishedArticles()` and `getArticleBySlug()` — extend with portfolio filter

### Established Patterns
- **Tailwind CSS v4**: Color palette via `@theme` directive in global.css
- **Bento grid**: 4-column layout, 4px gaps, responsive breakpoints
- **Terminal aesthetic**: Dark cards with blinking cursor animation
- **Color palette**: Canvas white, ink black, ink gray, card light, card hover

### Integration Points
- **Header**: Add scroll event listener, backdrop-filter CSS
- **TabNavigation.tsx**: Update active tab styling (black bg, white text)
- **Article content**: Apply dark theme to code blocks via CSS or component wrapper
- **Portfolio section**: Query articles with portfolio tag, render in modal
- **Config file**: Create `src/config/content.ts` for page titles/descriptions

</code_context>

<specifics>
## Specific Ideas

- "Frosted glass effect" on header when scrolling — modern, sleek
- Code blocks should be readable: gray background, black text (not dark-on-dark)
- Portfolio details should open in modal, not navigate to new page
- Single modular Portfolio component with configurable props (image, size, title, etc.)
- Photo-based cards as variant of portfolio component
- Page titles and descriptions from config file — single source of truth

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-ui-ux-polish-and-content-management*
*Context gathered: 2026-03-31*
