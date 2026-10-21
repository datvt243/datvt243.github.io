# 2026-10-21 - resume-api-error-standard (plan)

- Worker: implementer · Version: 0.1.0
- Node: `resume-api-error-standard` (`haven/diagrams/dev-loop.prime-mermaid.md`, new row appended, PENDING)
- Task (verbatim): `/todo #244` → issue #244 "Align resume API consumers with backend API Response & Error Standard"
- Branch: `bug/244` off freshly pulled `staging` (linked via `gh issue develop`)

## Hub bytes before: 157755

## Code anchors (grep-confirmed)
- `server/api/resume.ts:12` — bare `$fetch` of `${NODE_API}/api/me/${MY_EMAIL}`, inside `defineCachedEventHandler` (12 days)
- `server/api/generate-pdf.ts:66` — same `$fetch`, `!success || !data → 502` at :68 never reached on non-2xx
- `types/resume-api.ts:8-11` — `ResumeAPIResponse.errors: string[]`
- `plugins/VisitTracker.client.ts:21` — `POST .../visit`, only `.catch`es, 201 is still 2xx → no change
- Consumers of `/api/resume`: `stores/resume.ts:16` via `pages/index.vue:18` (`useAsyncData` exposes `error`) and `themes/portfolio-dev/pages/projects/Index.vue:11`

## Approach
One shared `server/utils/fetchResume.ts` (Nitro auto-import) used by both handlers: wraps the `$fetch` and throws `createError({ statusCode: 502 })` on any non-2xx or `success:false`/no `data`. Not cached because Nitro's `cachedFunction` rethrows resolver errors without `setItem` (`node_modules/nitropack/dist/runtime/internal/cache.mjs:57-62`), and event-handler `validate` rejects `code >= 400` (:151).

## Out of scope
Issue item 5 (optional `data: { code }` on blog/github `createError`s) — marked optional in the issue, not in Acceptance. VisitTracker `referrer`/`profile` body — issue says not part of this standard.

## Blockers
None. `.env` has MY_EMAIL, NODE_API set.
