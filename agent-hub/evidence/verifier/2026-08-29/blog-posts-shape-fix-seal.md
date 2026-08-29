# 2026-08-29 — blog-posts-shape-fix (verdict)

- Worker: verifier
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `blog-posts-shape-fix`
- New PM status: **SEALED** (from IN_PROGRESS)
- Source: `agent-hub/evidence/implementer/2026-08-29/blog-posts-shape-fix-{plan,diff}.md`

## NeverVerifyOwnWork
Same Claude Code session ran both passes — sanctioned by this project's
`/todo` design as long as this pass independently reproduces the evidence
rather than trusting the implementer's reasoning. Done below: fresh cold
cache build/lint, fresh preview port (`3950`, implementer used `3940`),
fresh separately-written CDP script.

## Reasoning
| # | Criterion | Cited evidence | Met? |
|---|---|---|---|
| 1 | `cacheGetPosts` typed `Promise<PaginatedPosts>`, no `Post[]`/`[]` union | Note's diff hunk; independently re-ran `git diff -- server/utils/cacheGetPost.ts` — identical hunk, `emptyResult()` returns a proper `PaginatedPosts` shape on failure | ✅ |
| 2 | `/api/blogs/posts` response shape byte-for-byte unchanged for the client | Independently curled `http://localhost:3950/api/blogs/posts?page=1&perPage=2` → `{status, data:{data,total,page,perPage}}`, same double-nested shape as before this fix | ✅ |
| 3 | `Array.isArray` guards removed from `rss.xml.ts`/`sitemap.xml.ts` | Independently re-ran `git diff` on both files — guards and their explanatory comments gone, replaced by a plain destructure | ✅ |
| 4 | `blogs/Index.vue`'s local `GetPosts` interface gone | Independently re-ran `git diff -- themes/portfolio-dev/pages/blogs/Index.vue` — interface deleted, `PaginatedPosts` imported from `@/types/index` instead | ✅ |
| 5 | Build clean | Independently re-run below, exit 0 | ✅ |
| 6 | Lint clean, warnings only decreased | Independently re-run below, exact match (32, down from 34) | ✅ |
| 7 | Real verification of all 3 endpoints + `/blogs` UI | Independently re-run below with a fresh port/script | ✅ |

## Independent re-verification the verifier ran directly
- `git status --short` → exactly the file set the note's diff table lists
  (`types/blog.ts`, `server/utils/cacheGetPost.ts`, `server/api/blogs/
  posts.ts`, `server/routes/rss.xml.ts`, `server/routes/sitemap.xml.ts`,
  `themes/portfolio-dev/pages/blogs/Index.vue`), plus `agent-hub/haven/
  diagrams/dev-loop.prime-mermaid.md` (PM status) and the new untracked
  evidence files. No other file touched.
- `git diff -- agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` showed
  only the new `blog-posts-shape-fix` row appended after
  `open-to-work-badge-i18n` — every prior SEALED row's text is
  byte-for-byte untouched (LAI-13 honored).
- Confirmed branch `feature/87` (`git branch --show-current`).
- Independently re-read all 6 touched files' `git diff` — byte-for-byte
  identical to what the note's `## Diff` section quotes and describes.
- Re-ran `rm -rf node_modules/.cache .nuxt .output && npm run build`
  independently (full cold cache) → exit `0`, no `error` lines.
- Ran `npm run lint` independently under `nvm use 24` → verbatim
  `✖ 32 problems (0 errors, 32 warnings)` — exact match, confirmed the
  drop from the established `34` baseline is real (grepped the full
  warning list for any of the 6 touched files → 0 matches; the 2 fewer
  warnings are consistent with the note's claim that `cacheGetPost.ts`'s
  unused `errors`/`message` destructure was removed).
- Started an independent preview server on a fresh port
  (`PORT=3950 node .output/server/index.mjs`, implementer used `3940`):
  - `curl "http://localhost:3950/api/blogs/posts?page=1&perPage=2"` →
    `{"status":true,"data":{"data":[...],"total":4,"page":1,"perPage":2}}`
    — confirmed top-level keys `['status','data']`, nested `data` keys
    `['data','total','page','perPage']`, `total: 4` matching 2 real posts
    returned for `perPage=2`. Byte-for-byte the same shape the site had
    before this fix — no client-facing break.
  - `curl http://localhost:3950/rss.xml | grep -c "<item>"` → `4`,
    matching the real `total: 4` from the API.
  - `curl http://localhost:3950/sitemap.xml | grep -c "<loc>"` → `9`
    (5 static routes + 4 real posts).
  - Chrome CDP (already running on port 9888, reused): wrote a fresh
    `.tmp-v87-check.mjs` (own script, not copied from the implementer's),
    real `page.goto('http://localhost:3950/blogs')`, checked
    `document.body.innerText` for a real post title. Verbatim result:
    ```json
    { "hasRealPost": true, "consoleErrors": [] }
    ```
- Cleanup: preview process killed (own PID), confirmed via `ps aux | grep`
  no stray listener remained. Temp script deleted. `git status --short`
  re-checked after cleanup — unchanged.

## Forbidden states scan
| State | Hit? | Note |
|---|---|---|
| `ADHOC_WORK` | No | New node `blog-posts-shape-fix` on the diagram, traces to issue #87, branch `feature/87` |
| `NO_EVIDENCE` | No | Full plan + diff notes present, matching the real diff |
| `EDIT_UNVERIFIED` | No | Build/lint independently re-run from cold cache + real curl/CDP evidence independently re-run with a fresh port/script |
| `CODE_IN_HAVEN` | No | Only PM status text touched in `haven/` |
| `DIAGRAM_DRIFT` | No (after this seal) | PM status updated to match below |

## Visual/behavior check
Non-visual server-logic fix (3 files) + one visual-adjacent file
(`blogs/Index.vue`, a type-only change with no template/markup edit) —
full independent re-run of both the API-shape checks and a real CDP pass
on `/blogs`, reproduced the note's claim exactly.

## Proportionality
Diff touches exactly the files the issue named (`cacheGetPost.ts`,
`blogs/posts.ts`, `rss.xml.ts`, `sitemap.xml.ts`, `blogs/Index.vue`) plus
one new shared type in `types/blog.ts` — a reasonable, minimal addition
that lets 2 of the 3 call sites drop their duplicated/defensive code
entirely rather than just patching one spot. No unrelated refactor,
`server/api/blogs/categories.ts` correctly left untouched. Matches
`SmallestDiff`.

## Seal gate
None recorded, none needed — no commit/push/PR happened in either pass;
`git status` shows only working-tree changes on `feature/87`.

## Missing
None — no REOPEN.
