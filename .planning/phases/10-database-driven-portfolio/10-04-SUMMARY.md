---
phase: 10-database-driven-portfolio
plan: 04
subsystem: analytics
tags: [upstash, redis, visitor-counter, stats-card, analytics]

# Dependency graph
requires:
  - phase: 10-database-driven-portfolio
    provides: BentoGrid with StatsCard component
provides:
  - Visitor counter library with Redis integration
  - Tracking API endpoint for visit increment
  - Session-based deduplication for visitor tracking
  - Dynamic visitor count display in StatsCard
affects: [landing-page, analytics, bento-grid]

# Tech tracking
tech-stack:
  added: [@upstash/redis]
  patterns: [lazy-initialized client, in-memory caching, session-based deduplication]

key-files:
  created:
    - src/lib/visitor-counter.ts
    - src/pages/api/track-visit.ts
  modified:
    - src/config/cards.ts
    - src/pages/index.astro
    - package.json
    - package-lock.json

key-decisions:
  - "Lazy-initialize Redis client only when configured to avoid startup errors"
  - "Use in-memory cache with 60s TTL to avoid rate limiting"
  - "Session-based deduplication prevents counting same visitor multiple times"
  - "Fallback to '---' when Redis not configured (graceful degradation)"

patterns-established:
  - "Pattern: Lazy client initialization with null check pattern"
  - "Pattern: In-memory cache with TTL for server-side rendering"
  - "Pattern: Session storage for client-side visit tracking"

requirements-completed: [STATS-10]

# Metrics
duration: 15min
completed: 2026-04-03
---

# Phase 10 Plan 04: Visitor Stats Integration Summary

**Replaced "Weekly Commits" stats card with dynamic visitor count using Upstash Redis with session-based tracking and graceful fallback.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-04-03T15:33:35Z
- **Completed:** 2026-04-03T15:48:00Z
- **Tasks:** 1
- **Files modified:** 6

## Accomplishments
- Integrated @upstash/redis for visitor counting with lazy initialization
- Created visitor counter library with caching and error handling
- Implemented tracking API endpoint that increments count on first visit per session
- Updated StatsCard configuration from "Weekly Commits" to "Visitor Count"
- Added client-side tracking script with session deduplication
- Implemented graceful fallback to "---" when Redis is not configured

## Task Commits

Each task was committed atomically:

1. **Task 1: Visitor Stats Integration** - `65a8de30` (feat)
   - Added @upstash/redis dependency
   - Created visitor-counter.ts library
   - Created track-visit API endpoint
   - Updated cards.ts config
   - Integrated tracking in index.astro

## Deviations from Plan

None - plan executed exactly as written.

## Technical Implementation Details

### Visitor Counter Library (src/lib/visitor-counter.ts)
- Lazy-initialized Redis client to avoid startup errors when not configured
- 60-second in-memory cache to avoid rate limiting
- `isRedisConfigured()` helper for graceful degradation
- `incrementVisitorCount()` for API endpoint
- `getVisitorCountCached()` for SSR with caching

### Tracking API (src/pages/api/track-visit.ts)
- POST endpoint returns 503 when Redis not configured
- Returns current count on successful increment
- Proper error handling with 500 status

### Integration (src/pages/index.astro)
- Server-side: Fetches visitor count and injects into cards config
- Client-side: Session-based tracking script (only counts first visit per session)

## Environment Variables Required

```bash
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

## Testing Notes

1. **Without Redis configured:**
   - Stats card shows "---"
   - API returns 503
   - No errors in console

2. **With Redis configured:**
   - Stats card shows visitor count
   - First visit increments counter
   - Refresh does NOT increment (session check)
   - Close browser, revisit increments again

---
*Phase: 10-database-driven-portfolio*
*Plan: 04*
*Completed: 2026-04-03*
