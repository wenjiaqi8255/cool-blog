---
phase: 05-database-schema-notion-migration
plan: 02
subsystem: migration
tags: [notion, migration, postgresql, drizzle]

# Dependency graph
requires:
  - 05-01 (articles table schema)
provides:
  - Notion migration script (scripts/migrate-notion.ts)
  - 36 articles imported to Neon Postgres
  - 18 images copied to public/images/articles/
affects:
  - 05-02 (uses articles table)
  - 08 (Astro integration will query imported articles)

# Tech tracking
tech-stack:
  added:
    - csv-parse (for Notion CSV parsing)
    - tsx (for running migration script)
  patterns:
    - CSV parsing with BOM handling
    - Fuzzy file matching for Chinese titles
    - Image copy and path rewriting

key-files:
  created:
    - scripts/migrate-notion.ts (migration script)
  modified:
    - package.json (added migrate:notion script)

key-decisions:
  - "BOM in CSV header - removed via column normalization"
  - "Chinese title file matching - use normalized string comparison with multiple strategies"
  - "Skip duplicate slugs - use onConflictDoNothing to allow re-runs"

requirements-completed: [MIGR-01, MIGR-02, MIGR-03, MIGR-04, MIGR-05, ERR-04]

# Metrics
duration: 15min
completed: 2026-03-31
---

# Phase 5 Plan 2: Notion Migration Script Summary

**Migration script created to import 36 Notion articles into Neon Postgres database with images**

## Performance

- **Duration:** ~15 min
- **Tasks:** 1 (Task 1 includes both script creation and execution)
- **Files:** 19 files (migration script + 18 images)
- **Articles imported:** 36/36 (100%)

## Accomplishments

- Created migration script with complete Notion import logic
- Imported all 36 articles into Neon Postgres
- Copied 18 images to public/images/articles/{slug}/ folders
- Handled BOM in CSV headers and fuzzy file matching for Chinese titles

## Task Commits

**Task 1: Create migration script with Notion export parser**
- Commit: `a53aebbc` - feat(05-02): implement Notion migration script
- Files: scripts/migrate-notion.ts, public/images/articles/
- Results: 36 articles imported, 18 images copied

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] BOM in CSV column names**
- **Found during:** Migration execution
- **Issue:** CSV header had BOM prefix (\uFEFF), causing article.Name to be undefined
- **Fix:** Added column normalization function to remove BOM and trim whitespace
- **Commit:** a53aebbc
- **Files modified:** scripts/migrate-notion.ts

**2. [Rule 1 - Bug] Directory entries in markdown folder**
- **Found during:** Migration execution
- **Issue:** fs.readdirSync returned both files and directories, causing EISDIR error when trying to read directories
- **Fix:** Added filter to only process files (isFile() check)
- **Commit:** a53aebbc
- **Files modified:** scripts/migrate-notion.ts

**3. [Rule 1 - Bug] File name mismatch for Chinese titles**
- **Found during:** Migration execution
- **Issue:** CSV names didn't exactly match markdown file names (truncation, special chars)
- **Fix:** Implemented multiple matching strategies (exact, starts-with, keyword matching)
- **Commit:** a53aebbc
- **Files modified:** scripts/migrate-notion.ts

**4. [Rule 3 - Blocking] DATABASE_URL not loaded in Node.js context**
- **Found during:** Migration execution
- **Issue:** process.env.DATABASE_URL was undefined in tsx context
- **Fix:** Passed DATABASE_URL explicitly via command line to migration script
- **Commit:** a53aebbc (runtime fix)

## Technical Details

**Migration Script Features:**
- CSV parsing with BOM handling
- URL-safe slug generation (Chinese titles use hash-based slugs)
- Chinese date format parsing (2024年6月30日 00:59)
- Tag merging from Tags + Tech_Tag columns
- Status mapping (Published→published, Draft/Ready→draft)
- Excerpt generation (first 150 chars, markdown stripped)
- Image copying and path rewriting
- Batch processing (10 at a time)
- Detailed migration summary output

**Database Results:**
- Total articles: 36
- Successfully imported: 36
- Failed: 0
- Images copied: 18

**Sample article data:**
- Title: "在用户的手机上离线运行大语言模型/LLM + edge"
- Slug: article-459012 (hash-based for Chinese)
- Status: published
- Tags: ["Resource"]

## Issues Encountered

- **Image path warnings**: Some article images referenced in markdown weren't found in the export folder (not critical - article still imported)
- **DATABASE_URL**: Required explicit env var passing in command line

## Next Phase Readiness

- Articles ready in database for Phase 8 (Astro integration)
- Migration script reusable for future imports
- Images stored in correct location for web serving

---

## Self-Check: PASSED

All claimed files and commits verified:
- ✓ scripts/migrate-notion.ts exists
- ✓ package.json has migrate:notion script
- ✓ public/images/articles/ directory has 22 folders with images
- ✓ Commit a53aebbc - feat(05-02): implement Notion migration script
- ✓ Database query confirms 36 articles imported

---

*Phase: 05-database-schema-notion-migration*
*Plan: 02*
*Completed: 2026-03-31*