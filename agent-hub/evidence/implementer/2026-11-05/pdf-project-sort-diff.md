# 2026-11-05 - pdf-project-sort (diff)
- Worker: implementer · Version 0.1.0
- Node: `pdf-project-sort` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: `/todo #394` — "feat(pdf): sort project trong PDF theo loại company → personal"; branch `feature/394`
- Status: sealed_pending_verifier

## Hub bytes before
81180

## Diff
| File | Why |
|---|---|
| `utils/sortProjects.ts` (new) | `compareProjects`: `type !== 'company'` ranks after company, then `startDate` desc (missing → 0, sinks) |
| `utils/index.ts` | re-export, same as the other utils |
| `server/utils/createPDFAts.ts` | import `compareProjects`; `projectHtml = [...projects].sort(compareProjects).map(...)` (copy, input not mutated) |
| `stores/resume.ts` | `projects` getter: inline date-desc comparator → `compareProjects` (its old JSDoc moved into the comparator's) |
| `types/resume-document.ts` | `Project.type?: 'company' \| 'personal'`, `Project.experienceId?: string \| null` |
| `tests/sortProjects.test.ts` (new) | renders `pageRenderAts({ projects })` and reads the `entry-title` order from the real HTML |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | node row `pdf-project-sort` |
`server/utils/fetchResume.ts` untouched: `PUBLIC_FIELDS` picks top-level keys only, nested project fields pass through.

## Command
`npm test` · `npm run lint` · `npx nuxi typecheck` · `npm run build` (repo root, per `doctrine/MEMORY.md`)

## Output
```
 Test Files  10 passed (10)
      Tests  23 passed (23)
```
```
> nuxt-app@1.12.0 lint
> eslint .
```
(no errors printed)
```
typecheck_exit=0
```
```
[nitro] ✔ You can preview this build using node .output/server/index.mjs
◆ ✨ Build complete in 26.6s!
```
Mutation check: `.sort(compareProjects)` commented out in `createPDFAts.ts` → `npx vitest run tests/sortProjects.test.ts`:
```
AssertionError: expected [ 'personal-old', 'untyped-new', …(3) ] to deeply equal [ 'company-new', 'company-old', …(3) ]
      Tests  1 failed (1)
```
Line restored afterwards (`git diff` shows `.sort(compareProjects)` back).

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) company before personal, newest first per group | `tests/sortProjects.test.ts` expects `['company-new','company-old','untyped-new','personal-mid','personal-old']` from input order `personal-old, untyped-new, company-old, personal-mid, company-new` — passes within "Tests 23 passed (23)"; fails without the sort (mutation check) |
| (2) no `type` → personal | same test: `untyped-new` (startDate 5) sits after both company entries and before `personal-mid` (3) |
| (3) PDF cache not stale after deploy | code: `server/api/generate-pdf.ts:18` `const cache = new Map<...>()` — module-level, in-memory only, no disk/KV; a deploy/restart starts empty. Runtime proof not possible pre-deploy |
| (4) web `/projects` same order | `stores/resume.ts` `projects` getter now `.sort(compareProjects)` — the same function the PDF uses; typecheck + build clean |
| comments per code-comments.md | one `/** */` WHY-of-ordering on `compareProjects`, one JSDoc on `Project.type`; no issue refs |
| Browser check | not run — live API data (curl 2026-11-05) has all 3 projects `type: personal`, so the new order equals the old date-desc order; nothing visible to diff on `/projects` until a company project exists |

## Supersedes: none
`grep '#394'` on the active diagram → 1 row (this node).

## Noticed, not done
- Issue's optional items (group sub-headings vi/en; company name from linked Experience via `experienceId`) — not in acceptance criteria.

## Seal gate
none (no commit/push in this pass)
