# Phase 9: UI/UX Polish and Content Management - Research

**Researched:** 2026-03-31
**Domain:** Frontend styling, component patterns, content management
**Confidence:** HIGH

## Summary

This phase focuses on polishing UI/UX across the blog: header frosted glass effect, code block readability, image display, tag styling, articles page layout, variable-driven content management, portfolio data from database, tab states, and modular portfolio components. The existing codebase already has several patterns that can be extended (TerminalCard dark theme, ArticleCard tag styling, TabNavigation active state).

**Primary recommendation:** Extend existing components with new styling, create a content config file for page titles/descriptions, and build a modular Portfolio component that queries articles with a 'portfolio' tag filter.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Header glass effect**: CSS backdrop-filter with semi-transparent background, triggered by scroll event
- **Code block styling**: Dark theme with #1f1f1f background + #111111 text (gray bg, black text)
- **Image display**: Responsive width, rounded corners, subtle shadow
- **Tag styling**: Capsule shape with border (not filled), ink-gray border, ink-black text
- **Articles page**: Consistent margins, left-aligned, 4px bento grid gaps
- **Content management**: Single config file at `src/config/content.ts` with title/description per page
- **Portfolio data**: Source from Articles database, filter by 'portfolio' tag
- **Tab selection**: Black background, white text for active tab
- **Portfolio detail**: Modal overlay (not page navigation), click outside or X to close
- **Portfolio component**: Single modular component with props (image, size, title, description, tags, link)
- **Photo card variant**: Controlled by props

### Claude's Discretion
- Exact scroll threshold for header glass effect
- Modal animation/transition timing
- Portfolio card hover effects
- Exact image border radius and shadow values
- Tag font size and padding

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| UI-01 | Header with frosted glass effect on scroll | Extend Header.astro with scroll listener + backdrop-filter CSS |
| UI-02 | Code block styling (gray background, black text) | Extend global.css code block styles |
| UI-03 | Image display in article content | Add img styles to article detail page |
| UI-04 | Tag styling with capsule shape and border | ArticleCard.astro already has border tags |
| UI-05 | Articles page margin and spacing consistency | Check against index.astro layout wrapper |
| UI-06 | Variable-driven content management | Create src/config/content.ts for page metadata |
| UI-07 | Portfolio data sourced from Articles database | Extend listPublishedArticles with tag filter |
| UI-08 | Tab selection state (black bg, white text) | TabNavigation.tsx already has active state |
| UI-09 | Portfolio detail modal instead of page | Create Modal component + portfolio detail view |
| UI-10 | Modular Portfolio component with parameters | Create PortfolioCard.astro with typed props |
| UI-11 | Photo-based card variant with parameter control | Add variant prop to PortfolioCard |

</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | v5 | Framework | Project uses Astro v5 with hybrid rendering |
| Tailwind CSS | v4 | Styling | CSS-first config via @theme directive |
| TypeScript | latest | Type safety | Full TypeScript throughout project |
| Drizzle ORM | latest | Database | Used in Phase 8 for article queries |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React | v19 | Interactive islands | TabNavigation, SubscribeModal, PortfolioModal |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|-----------|-----------|----------|
| CSS-in-JS | Tailwind CSS v4 @theme | Already using Tailwind v4 with @theme |
| Custom modal | Native dialog element | Better accessibility, lighter |

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── config/
│   └── content.ts         # Page titles, descriptions (NEW)
├── components/
│   ├── layout/
│   │   └── Header.astro   # Add glass effect (UPDATE)
│   ├── interactive/
│   │   └── PortfolioModal.tsx  # Portfolio detail modal (NEW)
│   └── portfolio/
│       └── PortfolioCard.astro # Modular portfolio component (NEW)
├── lib/
│   └── articles.ts        # Add portfolio filter query (UPDATE)
└── pages/
    ├── index.astro        # Use content config (UPDATE)
    └── articles/
        └── index.astro    # Fix margins, use content config (UPDATE)
```

### Pattern 1: Frosted Glass Header
**What:** Header gains backdrop-blur + semi-transparent background on scroll
**When to use:** UI-01 requirement
**Example:**
```astro
<!-- src/components/layout/Header.astro -->
<script>
  // Add scroll listener
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
</script>

<style>
  .header.scrolled {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(238, 238, 238, 0.5);
  }
</style>
```

### Pattern 2: Variable-Driven Content
**What:** Single config file exports page metadata
**When to use:** UI-06 requirement
**Example:**
```typescript
// src/config/content.ts
export const pageContent = {
  home: {
    title: 'KERNEL_PANIC / ARCHITECTURE & SYSTEMS',
    description: 'Computing as craft — Technical writing and portfolio'
  },
  articles: {
    title: 'ARTICLES | Articles',
    description: 'Deep dives into machine learning, distributed systems...'
  },
  portfolio: {
    title: 'PORTFOLIO | Projects',
    description: 'Visual showcase of projects and experiments'
  }
} as const;
```

### Pattern 3: Portfolio Article Filter
**What:** Extend article query to filter by tag
**When to use:** UI-07 requirement
**Example:**
```typescript
// src/lib/articles.ts
export async function listPortfolioArticles(): Promise<Article[]> {
  const articles = await db.query.articles.findMany({
    where: and(
      eq(articlesTable.status, 'published'),
      isNull(articlesTable.deletedAt),
      sql`${articlesTable.tags} @> '{"portfolio"}'`
    ),
    orderBy: desc(articlesTable.date)
  });
  return articles;
}
```

### Pattern 4: Modular Portfolio Card
**What:** Single component with typed props for variants
**When to use:** UI-10, UI-11 requirements
**Example:**
```astro
---
// src/components/portfolio/PortfolioCard.astro
interface Props {
  title: string;
  description?: string;
  image?: string;
  tags?: string[];
  link?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'standard' | 'photo';
}

const { title, description, image, tags, link = '#', size = 'medium', variant = 'standard' } = Astro.props;
---
```

### Pattern 5: Modal for Portfolio Detail
**What:** Overlay modal with article content instead of page navigation
**When to use:** UI-09 requirement
**Example:**
```tsx
// src/components/interactive/PortfolioModal.tsx
interface Props {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}

export default function PortfolioModal({ isOpen, onClose, article }: Props) {
  if (!isOpen || !article) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {/* Article content */}
      </div>
    </div>
  );
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll detection | Custom scroll handler | Native scroll event + CSS class toggle | Simple, performant |
| Modal animations | JS animation library | CSS transitions or View Transitions API | Lighter, built-in |
| Code highlighting | Custom parser | Shiki (already installed) | Used in Phase 2 |
| Image optimization | Custom solution | Native img srcset + CSS | Simple responsive handling |

---

## Common Pitfalls

### Pitfall 1: Frosted Glass Performance
**What goes wrong:** backdrop-filter causes jank on scroll
**Why it happens:** Heavy GPU operation on every scroll frame
**How to avoid:** Use passive scroll listener, debounce class toggle
**Warning signs:** Scroll stuttering on mobile, high CPU during scroll

### Pitfall 2: Modal Scroll Lock
**What goes wrong:** Page scrolls behind modal
**Why it happens:** Missing body scroll lock when modal opens
**How to avoid:** Add `document.body.style.overflow = 'hidden'` when modal opens
**Warning signs:** Background content moves while modal is open

### Pitfall 3: Image Aspect Ratio
**What goes wrong:** Images stretch or break layout
**Why it happens:** Missing object-fit or width constraints
**How to avoid:** Use CSS `max-width: 100%; height: auto;` with optional aspect-ratio
**Warning signs:** Layout shift when images load

### Pitfall 4: Tag Array Query in Postgres
**What goes wrong:** Array contains query fails in Drizzle with Neon HTTP
**Why it happens:** Different syntax for array operations across DB drivers
**How toavoid:** Use `sql` template literal with proper PostgreSQL operator (`@>` for contains)
**Warning signs:** Query errors when filtering articles by tag

---

## Code Examples

### Existing Patterns to Extend

**TabNavigation.tsx (already has active state):**
```tsx
// Source: src/components/interactive/TabNavigation.tsx
.tab-button.active {
  background: var(--color-ink-black);
  color: #FFFFFF;
  border-color: var(--color-ink-black);
}
```
This already satisfies UI-08! Just verify the CSS is applied correctly.

**ArticleCard.astro (tags already have border):**
```css
/* Source: src/components/articles/ArticleCard.astro */
.tag {
  border-radius: 20px;
  background: transparent;
  border: 1px solid var(--color-ink-light);
}
```
This already satisfies UI-04! Just verify colors match spec (ink-gray border, ink-black text).

**global.css (code blocks already dark):**
```css
/* Source: src/styles/global.css */
pre {
  background: #111 !important;
  border-radius: 8px;
  padding: 16px;
}
```
Need to verify text color meets UI-02 spec (#111111 text on #1f1f1f bg).

### Content Config Implementation
```typescript
// src/config/content.ts
export interface PageContent {
  title: string;
  description: string;
}

export const pages: Record<string, PageContent> = {
  home: {
    title: 'KERNEL_PANIC / ARCHITECTURE & SYSTEMS',
    description: 'Computing as craft — Technical writing and portfolio'
  },
  articles: {
    title: 'ARTICLES | Articles',
    description: 'Deep dives into machine learning, distributed systems...'
  },
  portfolio: {
    title: 'PORTFOLIO | Projects',
    description: 'Visual showcase of projects and experiments'
  }
};
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded titles in each page | Config-driven content | New in Phase 9 | Single source of truth |
| Article list queries all published | Filter by tag for portfolio | New in Phase 9 | Reuses existing articles table |
| Navigate to article page for detail | Modal overlay | New in Phase 9 | Better UX, no page load |

**Deprecated/outdated:**
- None relevant to this phase

---

## Open Questions

1. **Portfolio tag identification**
   - What we know: Database has tags as string array
   - What's unclear: Should portfolio use 'portfolio' tag or a separate status field?
   - Recommendation: Use 'portfolio' tag for simplicity, consistent with existing tag pattern

2. **Modal vs separate page for portfolio detail**
   - What we know: UI-09 requires modal, not page navigation
   - What's unclear: Should modal be same component as SubscribeModal?
   - Recommendation: Create separate PortfolioModal component for flexibility

3. **Image hosting for portfolio cards**
   - What we know: Database doesn't store cover images
   - What's unclear: How to get images for portfolio cards?
   - Recommendation: Extract image URLs from article body markdown or add cover_image column to schema

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest |
| Config file | vitest.config.ts |
| Quick run command | `npm run test` (if test script exists) |
| Full suite command | `npm run test -- --run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UI-01 | Header glass effect on scroll | Manual | Visual check | N/A |
| UI-02 | Code block gray bg, black text | Manual | Inspect code block | N/A |
| UI-03 | Image responsive display | Manual | Load article with images | N/A |
| UI-04 | Tag capsule styling | Manual | Inspect article tags | N/A |
| UI-05 | Articles page margins | Manual | Visual check | N/A |
| UI-06 | Config file with page content | Unit | `vitest run src/config/content.test.ts` | Needs creation |
| UI-07 | Portfolio articles from DB | Integration | Query portfolio articles | N/A |
| UI-08 | Tab active state | Manual | Click tabs | N/A |
| UI-09 | Portfolio modal opens | Manual | Click portfolio card | Needs creation |
| UI-10 | PortfolioCard component | Unit | `vitest run src/components/portfolio/PortfolioCard.test.ts` | Needs creation |
| UI-11 | Photo variant works | Manual | Render photo variant | N/A |

### Sampling Rate
- **Per task commit:** Manual testing via browser
- **Per wave merge:** Full suite if tests exist
- **Phase gate:** Manual verification of all 11 requirements

### Wave 0 Gaps
- [ ] `src/config/content.ts` — satisfies UI-06
- [ ] `src/components/interactive/PortfolioModal.tsx` — satisfies UI-09
- [ ] `src/components/portfolio/PortfolioCard.astro` — satisfies UI-10, UI-11
- [ ] `src/lib/articles.ts` update for portfolio filter — satisfies UI-07

---

## Sources

### Primary (HIGH confidence)
- Existing codebase: Header.astro, TabNavigation.tsx, ArticleCard.astro, global.css
- Tailwind CSS v4 documentation: https://tailwindcss.com/docs/v4
- Astro v5 documentation: https://docs.astro.build

### Secondary (MEDIUM confidence)
- Drizzle ORM array queries: Based on Phase 8 implementation patterns

### Tertiary (LOW confidence)
- None required

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH - Using existing project libraries
- Architecture: HIGH - Extending existing patterns
- Pitfalls: MEDIUM - Based on general web dev experience, some edge cases need verification

**Research date:** 2026-03-31
**Valid until:** 30 days (UI patterns are stable)