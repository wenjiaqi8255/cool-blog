# Phase 10: Database-Driven Portfolio

**Goal:** Replace static mockup cards with database-driven portfolio articles in BentoGrid

**Status:** Planning

**Created:** 2026-04-03

---

## Overview

Transform the BentoGrid from static mockup content to fully database-driven portfolio display. All portfolio content will be sourced from the `articles` table, with explicit configuration rules that both humans and AI agents can understand and predict.

## Key Principles

1. **Data-Driven:** All content comes from the database
2. **Explicit Rules:** Configuration is self-documenting and predictable
3. **Visual Consistency:** Reuse existing Bento card components
4. **Agent-Friendly:** Configuration can be read and understood by AI agents

## Scope

### In Scope
- Database schema extension (image field)
- Configuration system for portfolio rules
- Article-to-card mapping logic
- BentoGrid integration
- Modal redesign (match Bento aesthetic)
- Visitor stats tracking (Stats Card)
- Fallback animations

### Out of Scope
- Terminal card triggering logic (deferred - will be used for future features)
- Chatbot integration (Phase 11)
- Article editing workflow (already complete)

## Technical Decisions

### 1. Image Handling
- **New field:** `image` (text, optional) in articles table
- **Logic:** Use `image` if provided, else extract first image from body, else show text-only card
- **Implementation:** Database migration + extraction utility

### 2. Configuration System
- **Format:** TypeScript config file with Zod validation
- **Location:** `src/config/portfolio.ts`
- **Documentation:** Inline comments + README (not JSDoc)
- **Validation:** Runtime schema validation with Zod

### 3. Featured Placement
- **Mechanism:** Add "featured" tag to article
- **Visual:** Featured articles get span-2, photo variant
- **Manual:** User/AI agent explicitly adds "featured" tag

### 4. Stats Card
- **Change:** "Weekly Commits" → "Visitor Count"
- **Implementation:** Integrate with Vercel Analytics or simple counter
- **Data source:** Real-time visitor tracking

### 5. Fallback Strategy
- **No articles:** Show elegant loading animation (HTML provided by user)
- **No image:** Display text-only card (no placeholder)
- **Too few articles:** Same as "no articles" - show animation

### 6. Modal Redesign
- **Aesthetic:** Match Bento cards (dark theme, borders, fonts)
- **Components:** Reuse existing syntax highlighting
- **Layout:** Consistent with Bento grid styling

## Implementation Plan

### 10-01: Schema Extension & Migration
- Add `image` field to articles table
- Create database migration
- Update Drizzle schema
- Test migration on development database

### 10-02: Configuration System
- Create `src/config/portfolio.ts`
- Define portfolio rules schema with Zod
- Implement article-to-card mapping logic
- Add image extraction utility
- Write configuration README

### 10-03: BentoGrid Integration
- Modify BentoGrid to accept dynamic cards
- Replace static `portfolioCards` with database queries
- Implement featured/standard card sizing
- Test responsive layout

### 10-04: Stats Card Implementation
- Integrate visitor tracking
- Replace "Weekly Commits" with visitor count
- Real-time data fetching
- Fallback for no data

### 10-05: Modal Redesign
- Redesign PortfolioModal component
- Match Bento aesthetic (colors, fonts, borders)
- Ensure code highlighting works
- Mobile responsiveness

### 10-06: Fallback & Polish
- Implement loading animation
- Test edge cases (no articles, no images)
- Performance optimization
- Final testing

## Configuration Schema (Draft)

```typescript
// src/config/portfolio.ts
import { z } from 'zod';

export const PortfolioConfigSchema = z.object({
  // Article selection
  tagFilter: z.array(z.string()).default(['Project']),
  excludeTags: z.array(z.string()).default(['draft', 'archived']),

  // Featured rules
  featuredTag: z.string().default('featured'),
  maxFeatured: z.number().int().positive().default(3),

  // Card sizing
  sizing: z.object({
    featured: z.object({
      span: z.union([z.literal(1), z.literal(2), z.literal(4)]).default(2),
      row: z.number().int().positive().optional(),
      variant: z.enum(['image', 'text']).default('image')
    }),
    standard: z.object({
      span: z.union([z.literal(1), z.literal(2), z.literal(4)]).default(1),
      variant: z.enum(['image', 'text']).default('text')
    })
  }),

  // Fallback behavior
  fallback: z.object({
    whenNoArticles: z.enum(['animation', 'empty', 'placeholder']).default('animation'),
    whenNoImage: z.enum(['text', 'placeholder', 'hide']).default('text')
  })
});

export type PortfolioConfig = z.infer<typeof PortfolioConfigSchema>;

// Default configuration
export const portfolioConfig: PortfolioConfig = {
  tagFilter: ['Project'],
  excludeTags: ['draft', 'archived'],
  featuredTag: 'featured',
  maxFeatured: 3,

  sizing: {
    featured: { span: 2, row: 2, variant: 'image' },
    standard: { span: 1, variant: 'text' }
  },

  fallback: {
    whenNoArticles: 'animation',
    whenNoImage: 'text'
  }
};
```

## Success Criteria

1. ✅ All BentoGrid content sourced from database
2. ✅ Configuration rules are explicit and readable
3. ✅ Featured articles display with correct sizing
4. ✅ Image fallback logic works correctly
5. ✅ Modal matches Bento aesthetic
6. ✅ Stats card shows visitor count
7. ✅ Loading animation displays when no articles
8. ✅ AI agents can understand and modify configuration

## Dependencies

- Phase 8 (Astro Integration) - Complete
- Phase 9 (UI/UX Polish) - Complete
- Vercel Analytics API (for visitor stats)

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Image extraction fails | Fallback to text-only card |
| Visitor stats API down | Cache last known value, show "-" if unavailable |
| Configuration too complex | Provide sensible defaults, validate with Zod |
| Modal redesign breaks existing features | Keep existing modal as backup, feature flag |

## Notes

- Terminal card logic deferred - will be used for chatbot feature (Phase 11)
- Configuration should be simple enough for AI agents to modify without guidance
- Visual consistency is critical - reuse existing components, don't create new ones
