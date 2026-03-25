# TODOS

## Pre-compute stats.json at build time
**What:** Add a build script that generates `stats.json` with total courses, materials, contributors, and per-department counts. Home page reads one file instead of walking the content tree.
**Why:** Home page currently does an O(n³) tree walk AND reads courses twice (getStats + getCourses per department). As content grows past ~50 courses, this will noticeably slow the most-visited page.
**Context:** The existing search index design (Fuse.js over pre-built entries) is the same pattern — pre-compute at build time, serve at runtime. The `getStats()` function in `src/lib/content.ts` and the `deptWithCounts` mapping in `src/app/page.tsx` both walk the tree independently.
**Depends on:** Nothing.

## Add JSON validation with try-catch for content reads
**What:** Wrap all `JSON.parse(fs.readFileSync(...))` calls in `src/lib/content.ts` with try-catch. On parse failure, log the error and return a sensible default (empty array or null).
**Why:** Every content read crashes with an unhandled exception on malformed JSON. Since contributors submit JSON files via PR, bad JSON is realistic. One bad file could 500 the whole site.
**Context:** Affected functions: `getDepartments()`, `getCourses()`, `getCourse()`, `getMaterials()` — all in `src/lib/content.ts`. Each does a bare `JSON.parse` with no error handling.
**Depends on:** Nothing.
