# Cool Blog - Claude Code Documentation

## Quick Start

```bash
npm install
npm run dev  # Start development server on port 4321
```

## Commands

```bash
# Development
npm run dev          # Start dev server on port 4321

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
# Manual testing via browser
open http://localhost:4321/articles
```

## Project Overview

Personal blog built with Astro, featuring:
- Astro v5 with hybrid rendering
- Drizzle ORM + Neon PostgreSQL (serverless)
- TypeScript throughout
- Tailwind CSS for styling
- Content collections for article organization

## Architecture

### Database
- **Provider**: Neon PostgreSQL (serverless)
- **ORM**: Drizzle ORM with connection pooling
- **Schema**: Articles table with slug, title, content, publish status, timestamps

### Articles
- All articles fetched from database via `listPublishedArticles()`
- Individual articles by slug via `getArticleBySlug()`
- 404 page for missing articles
- Content collections for article organization

### Rendering
- **Hybrid rendering**: Server-side rendering (SSR) + client-side hydration
- **Output**: Hybrid output configured in `astro.config.mjs`
- **Database**: Server-side queries using Drizzle ORM
- **Environment**: `DATABASE_URL` (Neon connection string)

## Directory Structure

```
src/
├── db/
│   └── index.ts          # Database connection & schema
├── lib/
│   └── articles.ts       # Article query functions
├── pages/
│   ├── articles/
│   │   ├── index.astro    # Article list page
│   │   └── [slug].astro   # Article detail page
│   └── 404.astro          # Not found page
├── components/
│   └── ArticleCard.astro  # Article display component
└── styles/
    └── global.css         # Tailwind imports
```

## Development Conventions

### Code Style
- TypeScript throughout
- Use Drizzle ORM for all database operations
- Query functions in `src/lib/articles.ts`
- Component files co-located with routes

### Database
- All queries use Drizzle ORM
- Connection pooling enabled
- Environment variables: `DATABASE_URL` (Neon connection string)

### Styling
- Tailwind utility classes
- Dark theme by default
- Responsive design (mobile-first)

### Git Workflow
- Commit messages: `feat|fix|docs|refactor|chore|perf|ci: <description>`
- PRs to `master` branch
- Squash merge preferred

## Key Files

- `src/db/index.ts` - Database connection and Drizzle setup
- `src/lib/articles.ts` - Article query functions
- `src/pages/articles/index.astro` - Article list page
- `src/pages/articles/[slug].astro` - Article detail page
- `astro.config.mjs` - Astro configuration with hybrid output

## Environment Setup

Required environment variables:
```bash
# .env file (gitignored - never commit this!)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

Get your Neon connection string from:
1. Neon Dashboard → Project → Connection Details
2. Copy the "Connection string" (includes password)

## Error Handling

### Article Not Found
Non-existent articles redirect to `/404` page:
```typescript
if (!article) {
  return Astro.redirect('/404');
}
```

### Database Errors
- Logged to console with full context
- User sees generic error message
- Connection errors fail fast at startup

### Missing Environment Variables
- Application fails immediately on startup
- Clear error message: "DATABASE_URL environment variable is required"
- Check `.env` file exists and contains valid connection string

## Testing

```bash
# View articles list
open http://localhost:4321/articles

# View specific article
open http://localhost:4321/articles/[article-slug]

# Database connection
# Check Neon Dashboard for connection status
```

## Recent Changes

### Phase 10: Database-Driven Portfolio

All portfolio content is database-driven via configuration:

#### Configuration
See `src/config/portfolio.ts` for all rules.

#### Adding Portfolio Articles
1. Add "Project" tag to article
2. Optionally add "featured" tag for prominent display
3. Set `image` field or let system extract first image

#### Fallback Behavior
- No articles -> Loading animation (geometric card shapes)
- No image -> Text-only card (graceful degradation)
- Database error -> Error state with retry

#### Performance
- Articles cached for 60 seconds (server-side)
- Lazy-loaded images (loading="lazy" decoding="async")
- Modal uses DOMPurify for XSS prevention

### Phase 8: Database Integration
- Implemented database article query layer
- Created ArticleCard adapter for database types
- Added /articles page showing all published articles
- Added /articles/[slug] detail page
- Created 404 page for missing articles
- Configured Astro for hybrid output
- Set up Drizzle + Neon with connection pooling

**Note**: Currently displays all 25 articles at once. Infinite scroll pagination is a planned enhancement.

## Future Enhancements

- [ ] Infinite scroll pagination for /articles page
- [ ] Article search functionality
- [ ] Tag-based filtering
- [ ] Reading time estimates
