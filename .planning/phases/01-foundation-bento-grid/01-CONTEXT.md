# Phase 1: Foundation & Bento Grid - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the visual foundation: a responsive Bento Grid layout with configurable card templates, deployed to Cloudflare Pages. This phase delivers the visual identity, layout system, and navigation structure. Content (articles) comes in Phase 2; newsletter backend comes in Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Card Template System
- **4 card types** to support: Image card, Text card, Terminal card, Stats card
- Each card type is a reusable component with props for content
- **Config-driven placement**: Card positions and sizes defined in a configuration file (not auto-placement algorithm)
- Size hints in config: `span-1`, `span-2`, `span-4`, `row-2` values respected by grid

### Card Content (Phase 1)
- Use mockup content structure as baseline (12 cards)
- Images: Use Unsplash URLs from mockup for now (swap later with real portfolio images)
- Stats card (Weekly Commits): **Live GitHub API** — fetch real commit count
- Cards link to detail pages (routing structure ready for Phase 2 content)

### Navigation
- **Header links**: Only "Articles" tab — remove Setups/Repo from nav
- Articles tab switches view to Articles list (Phase 2 will populate)
- **Subscribe button**: Opens modal overlay with email capture form
- Newsletter card in grid also has email input (Phase 3 backend)

### Responsive Layout
- **Breakpoint strategy**: 4 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- Cards reflow proportionally while respecting span values
- **Touch-friendly**: 44px minimum tap targets on all interactive elements

### Animations & Hover Effects (All Required)
1. **Card background shift**: Light cards #F7F7F7 → #F0F0F0 on hover
2. **Arrow icon nudge**: ↗ moves 4px up-right on card hover
3. **Image grayscale-to-color**: grayscale(100%) → grayscale(0%) + scale(1.02)
4. **Cursor blink**: Terminal blocks show CSS keyframe blinking cursor

### Typography (From Design Mockup)
- Sans: Inter (weights 200-600)
- Mono: JetBrains Mono (weights 300-400)
- Headlines: Light weight (200-300), tight letter-spacing (-0.02em to -0.04em)
- Meta tags: 9px uppercase with 0.1em letter-spacing

### Color Palette (From Design Mockup)
- Canvas white: #FFFFFF
- Card light: #F7F7F7
- Card hover: #F0F0F0
- Ink black: #111111
- Ink gray: #666666
- Ink light: #999999
- Dark card background: #111111
- Dark card hover: #000000

### Grid System
- 4-column base layout
- 4px gaps between cards
- Min card height: 320px (auto-rows: minmax(320px, auto))
- Max layout width: 1600px, centered with 40px padding

### Claude's Discretion
- Exact card configuration file structure (JSON/YAML/TS)
- How to structure the GitHub API integration (endpoint, caching, error handling)
- Subscribe modal component implementation details
- Exact breakpoint pixel values for responsive grid
- Footer implementation (full mockup footer or simplified for Phase 1)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System
- `.planning/PROJECT.md` — Brand identity, typography, color palette, constraints
- `.planning/REQUIREMENTS.md` — PORT-01 through PORT-05, RESP-01, RESP-02, DEPLOY-01 through DEPLOY-04

### Technical Stack
- `.planning/STATE.md` — Key decisions: Astro over Next.js, Neon Postgres, Cloudflare Pages

No external ADRs or spec documents — requirements captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
None yet — greenfield project. Phase 1 creates the foundational components.

### Established Patterns
None yet — this phase establishes patterns for:
- Card component architecture
- Configuration-driven layout
- Responsive grid system
- Animation/transition utilities

### Integration Points
- **GitHub API**: For live commit stats (public endpoint, no auth needed)
- **Cloudflare Pages**: Deployment target with edge functions support
- **Astro framework**: SSG/SSR hybrid, React islands for interactive components

</code_context>

<specifics>
## Specific Ideas

- User provided complete HTML mockup with exact visual specifications
- Brand: "KERNEL_PANIC / ARCHITECTURE & SYSTEMS"
- "Computing as craft" manifesto concept
- Terminal aesthetics with blinking cursor
- Monochrome workflow theme
- Card templates should be configurable for future content changes
- User interested in auto-placement algorithm as future enhancement (not Phase 1)

</specifics>

<deferred>
## Deferred Ideas

- Auto-placement algorithm for cards (interesting but complex — defer to future exploration)
- Dark mode toggle (explicitly out of scope per PROJECT.md)
- Comments system (v2+)
- Table of contents for articles (v2+)
- Service worker for offline reading (v2+)

</deferred>

---

*Phase: 01-foundation-bento-grid*
*Context gathered: 2026-03-27*
