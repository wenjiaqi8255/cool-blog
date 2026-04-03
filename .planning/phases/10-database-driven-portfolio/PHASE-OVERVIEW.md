# Phase 10 Overview: Database-Driven Portfolio

**Milestone:** v1.3 Database-Driven Portfolio
**Status:** Ready to Start
**Created:** 2026-04-03
**Duration Estimate:** 7.5 hours total

---

## Quick Summary

Transform the BentoGrid from static mockup cards to fully database-driven portfolio display with explicit configuration rules that both humans and AI agents can understand.

## Key Principles

### 1. Fully Data-Driven
- **No static mockup cards** - all content from database
- Articles table is single source of truth
- BentoGrid renders whatever is in database

### 2. Explicit Configuration
- **No hidden rules** - all behavior defined in `src/config/portfolio.ts`
- TypeScript + Zod validation (not old-school JSDoc)
- Readable by humans AND AI agents
- **Predictability is paramount**

### 3. Visual Consistency
- **Reuse existing Bento card components**
- Match dark theme aesthetic (`#1a1a2e`, `#2d2d44`, `#00d4ff`)
- Modal redesigned to match Bento style
- No new visual components

### 4. Security First
- **DOMPurify for all user content** (XSS prevention)
- Sanitize all HTML before rendering
- Never trust database content blindly

## Architecture

```
User/AI Agent Input (Add tags, set image)
          ↓
Database (Articles Table + new image field)
          ↓
Configuration (portfolio.ts - explicit rules)
          ↓
Mapping Logic (filter, sort, map to cards)
          ↓
BentoGrid (render dynamic cards)
```

## Plans Summary

| Plan | Goal | Duration | Status |
|------|------|----------|--------|
| **10-01** | Schema extension | 30m | Ready |
| **10-02** | Configuration system | 2h | Ready |
| **10-03** | BentoGrid integration | 1.5h | Ready |
| **10-04** | Visitor stats | 1h | Ready |
| **10-05** | Modal redesign | 1.5h | Ready |
| **10-06** | Fallback & polish | 1h | Ready |

**Total:** 7.5 hours

## Key Decisions

### Image Field
- Add optional `image` field to articles table
- Logic: Use `image` if set → else extract from body → else text-only card
- No placeholders - text cards are a feature

### Stats Card
- Changed: "Weekly Commits" → "Visitor Count"
- Use Upstash Redis or Vercel Analytics
- Fallback to "---" if unavailable

### Configuration
- TypeScript + Zod (not JSDoc)
- Inline comments + README
- All rules explicit and validated

### Terminal Cards
- **Deferred** - future chatbot feature
- Keep component, don't implement auto-detection

### Fallbacks
- No articles → Loading animation
- No image → Text card
- Too few → Same as "no articles"

### Security
- **DOMPurify mandatory** for all HTML rendering
- Sanitize before using in React components
- XSS prevention is critical

## Configuration Preview

```typescript
// src/config/portfolio.ts
export const portfolioConfig: PortfolioConfig = {
  tagFilter: ['Project'],
  featuredTag: 'featured',
  maxFeatured: 3,

  sizing: {
    featured: { span: 2, row: 2 },
    standard: { span: 1 }
  },

  fallback: {
    whenNoArticles: 'animation',
    whenNoImage: 'text'
  }
};
```

## For AI Agents

**Feature article:** Add "featured" tag
**Add to portfolio:** Add "Project" tag
**Set image:** Set `article.image` field
**Understand rules:** Read `portfolio.ts` - everything is explicit

## Success Criteria

- [ ] All content from database
- [ ] Configuration readable by AI
- [ ] Featured articles display correctly
- [ ] Image fallback works
- [ ] Modal matches aesthetic
- [ ] Visitor count shows
- [ ] Loading animation displays
- [ ] XSS prevention with DOMPurify

## Next Steps

1. Review plan with user
2. Execute 10-01 (schema)
3. Execute 10-02 (config)
4. Test with real articles
5. Continue with remaining plans

---

**Questions?** See individual plan files (10-01 through 10-06) for details.
