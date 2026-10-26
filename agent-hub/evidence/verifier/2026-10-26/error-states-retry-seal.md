# 2026-10-26 - error-states-retry (verdict: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `error-states-retry` (issue #286, branch `bug/286`)
- New PM status: SEALED
- Notes audited: `evidence/implementer/2026-10-26/error-states-retry-plan.md`, `evidence/implementer/2026-10-26/error-states-retry-diff.md`

## Isolation proof
This pass ran as a separate subagent, spawned through the Agent tool with the task "You are the agent-hub **verifier** ... Node: `error-states-retry`, issue #286 ... You did NOT write this change; judge it independently." The implementer's task was issue #286 "error states" (plan note). This context did not write the diff. The operator's spawn prompt asked for checks on the code itself (comments, smallest change, consumer grep), so I read `git diff` for the 8 code/i18n files. That goes beyond the `EvidenceOnly` default, by explicit operator request.

## Reasoning
| Check | Result |
|---|---|
| Step 4: commands match `doctrine/MEMORY.md` | `npm run build`, `npm run lint`, `npx nuxi typecheck`. No `npm test`, no "tests pass". |
| Step 5: truncation | Each command gives its key line. My re-run below reproduces them. |
| Step 6: behavior evidence | SSR table + CDP JSON (`fail`, `afterRetry`, `notFound`, `blogsError`, `blogsAfterRetry`, `download1/2`) in the note. Reproduced below, plus my own screenshots. |
| AC1: resume upstream down → localized copy + retry, no raw error | **Re-run SSR (mock `fail`, cold server, `Accept: text/html`): `/ 502 Đã có lỗi phía máy chủ`, `/en 502 Something went wrong on our side`, both `leak: False` (no `statusMessage`/`Unable to load`/`FetchError`/`stack`/`[object` outside `<script>`), retry present. CDP after mock→ok, click "Try again" → `/en`, h1 "Võ Tấn Đạt".** Own CDP check: 1280 `/` buttons `['Thử lại','Về trang chủ']`, 390 `/en` `['Try again','Go to the homepage']`, `alt: ''`, `bodyHasRaw: false`; screenshot `scratchpad/v/v-502-390.png` shows both buttons side by side, no overflow. |
| AC2: 404 copy, no retry, locale-keeping home | **Re-run: `/nope 404 Trang này không tồn tại`, `/en/nope 404 This page doesn't exist`, retry absent in both; CDP click home → `http://localhost:4142/en`.** |
| AC3: blog list error + retry | **Re-run CDP: `blogsError {alert: true, "Couldn't load this content.Try again"}` → click → `blogsAfterRetry {alert: false, items: 4}`.** `ListRender` has 1 consumer (`themes/portfolio-dev/pages/blogs/Index.vue`), which passes `@retry="refresh()"`; `refresh` comes from its `useFetch`. |
| AC4: download usable after a failure | **Re-run CDP: `download1 {disabled: false, calls: 1}`, `download2 {disabled: false, calls: 2}`;** screenshot `scratchpad/v286-download.png` shows two error toasts and the button still active. `isDisabled` grep: 0 hits left; the 2 `useDownloadResume` consumers (`Hero.vue`, `AboutMe.vue`) were both updated. |
| AC5: build, lint, typecheck | Re-run, all rc=0 (below). |
| AC5b: comments follow code-comments.md | Two new `//` WHY lines (`useDownloadResume.ts`: why no disable; `error.vue`: why a full reload, not `clearError()`), one `/** */` block updated to drop the stale "or after a failure". No `(#N)` refs, no stacked `//`, no WHAT comments. Compliant. |
| Theme rules | `ListRender` uses only semantic classes (`text-theme-muted`, `bg-theme-panel-subtle`, both defined in `assets/css/main.css`); `error.vue`'s new button copies the existing button's class string. Icon `i-fe-sync` exists in the installed `fe` set. |
| Step 7b: Supersedes / Still open | The active diagram has no other #286 row. Nothing to supersede. |
| Step 8: forbidden states | ADHOC_WORK: no, the node row exists. NO_EVIDENCE: no. EDIT_UNVERIFIED: no, typecheck is cited and re-run. CODE_IN_HAVEN: no, only the diagram row is under `haven/`. DIAGRAM_DRIFT: no, the row moves to SEALED here. |
| Step 9: seal gate | No commit, push or PR. "none" is acceptable. |
| Step 10: proportionality | One deleted ref + 2 call sites, one 4-line template branch + emit, error.vue copy/i18n, 7 keys per locale. Every hunk maps to an issue bullet. In proportion. |

## Re-run
full. The change is visitor-facing (every error page and the CV download), and the operator asked for an independent re-run. With `scratchpad/p0/env.sh` sourced, from a warm cache:
```
npm run build → rc=0, "◆ ✨ Build complete in 13.6s!"
npm run lint → "> eslint ." only, rc=0
npx nuxi typecheck → rc=0, 0 "error TS"
SSR :4142 (NUXT_PUBLIC_NODE_API=http://localhost:4199, mock fail):
/        502 Đã có lỗi phía máy chủ            | leak: False | retry: True
/en      502 Something went wrong on our side   | leak: False | retry: True
/nope    404 Trang này không tồn tại            | leak: False | retry: False
/en/nope 404 This page doesn&#39;t exist         | leak: False | retry: False
CDP (err-ui.cjs): fail/afterRetry/notFound/home/blogsError/blogsAfterRetry/download1/download2 as cited above;
console errors only the 502/404/500 resource lines the test itself causes.
```
The real resume backend was not called. The :4142 server and the :4199 mock are stopped.

## Noted, not blocking
- After one good render the server serves the last good resume page even when the upstream fails again (`resume-isr-fallback`), so the 502 page only shows on a cold server. That is the intended layering, not a gap here.
- Statuses other than 404 (400/403) get the server-error copy and retry; no route produces them today (also noted by the implementer).

## Missing
none
