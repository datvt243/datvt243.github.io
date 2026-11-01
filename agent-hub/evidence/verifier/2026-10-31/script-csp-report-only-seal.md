# 2026-10-31 - script-csp-report-only (verifier: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `script-csp-report-only` (#319), branch `feature/319` off `staging` 5ff1ea6, uncommitted
- Note graded: `evidence/implementer/2026-10-31/script-csp-report-only-diff.md`

## Verdict: SEAL

## Cited
| Criterion | Result |
|---|---|
| 1 header shape on SSR HTML routes | PASS, via a re-run. The note's curl block elides the policy tail (`… https://giscus.app; …`), so it doesn't show `object-src`/`base-uri` by itself. Re-run curl on `/`, `/en`, `/projects` and `/en/projects` (prod build :4188, mock :4199) gives the full header on all 4: `content-security-policy-report-only: script-src 'self' 'sha256-uWJ4kkprs4Ut0Ak3ftc975wiNio1+uBWA4yOY4Rh3h8=' 'sha256-yMtEXssBJ6hShkYT9XoG32vgqFpN5ero5fMMVhkHst0=' 'sha256-AC7ZRqjySUvR0le6zi5Lg4CPGbTBkBWQNqxaGb+A18A=' 'unsafe-hashes' 'sha256-bwK6T5wZVTANitXbrTsel7kl/PyCjCd/Dq5Qoz3imjM=' https://giscus.app; object-src 'none'; base-uri 'self'`. The enforced `content-security-policy: frame-ancestors 'none'` is still there. `/api/resume` (JSON) gets no Report-Only header, as intended. An independent Python hash of the served `/` HTML matches: importmap `uWJ4…`, the two classic inline scripts `yMtE…` and `AC7Z…`, and the NuxtImg `onerror` string `this.setAttribute('data-error', 1)` → `bwK6…`. The `application/ld+json` block (`maEm…`) is correctly left out |
| 2 0 violations in Chrome | PASS. The note shows `violations 0 []`, with a 68-violation baseline that proves its listener works. The re-run used headless Chrome with a fresh profile and a `securitypolicyviolation` listener injected before each document. It visited `/`, `/en`, `/projects` and `/en/projects` (all `hydrated= true`), clicked `/projects` from `/` (`client nav -> http://localhost:4188/projects`), then switched to `prefers-color-scheme: light` and reloaded. Result: `violations 1 ["/projects script-src-elem inline report"]`. That single entry is my own injected probe `<script>`, added on purpose after the run to prove the listener catches report-only violations. Real violations: 0 |
| 3 unit test | PASS. Note: `Tests  14 passed (14)` (+1). Re-run (Node v24.19.0): `Test Files  6 passed (6)` / `Tests  14 passed (14)` |
| 4 build + lint + typecheck + test | PASS. Note: `lint=0`, `typecheck=0` with `grep -c "error TS"` = 0, `Tests  14 passed (14)`, `◆ ✨ Build complete in 13.8s!`. The `lint=0`/`typecheck=0` summaries follow the accepted `pdf-two-pages`/`blog-content-sanitize` precedent. Re-run build (mock env): `build=0`, `◆ ✨ Build complete in 14.1s!` |
| comments per code-comments.md | PASS. The note cites only WHY comments: a util doc block, the NuxtImg constant, the Report-Only line and the updated `routeRules` block |
| 7b Supersedes/Still open | PASS. `## Supersedes: none` and `## Still open` are both present. No other open #319 row is on the active diagram |

## Forbidden states / seal gate / proportionality
- Forbidden states: none hit. The node exists, the note has real output,
  no code is in `haven/`, and PM status is updated with this SEAL.
- Seal gate: `none (commit/push left to /ship)`. Nothing was committed or
  pushed, and no external API was called. `grep -c onrender` is 0 on both
  the re-run server log and the build log.
- Proportionality: PASS. 1 new util, 1 plugin hook, 1 test, and 1 comment
  change in `nuxt.config.ts`. The NuxtImg allowance is one exact hash, not
  a blanket `on*` hash.
- Note quality: the curl block's `…` elision would on its own count as
  hidden output under step 5. It was cleared by this re-run rather than
  sent back, because the node is security/outward-facing (a Re-run scope
  exception). Future notes should paste the full header line.
- Risks carried forward (not blocking, all from the note):
  - The header is Report-Only. Issue #319 stays open until it is switched
    to enforcing after a clean production run.
  - `/contact` is prerendered and gets no Report-Only header.
  - `/github`, `/blogs`, `/blogs/[id]` and Giscus were not visited locally,
    because they need external APIs.
  - Scripts Vercel injects (toolbar/analytics on preview deploys) can't be
    observed locally.

## Isolation proof
This pass ran as a separate verifier subagent. Its task string starts "You
are running `/worker verifier` ... This is pass 2 of `/todo #319`; you are
a separate subagent with a clean context (NeverVerifyOwnWork)". It names
node `script-csp-report-only` and tells me to use a fresh headless Chrome
profile, not the :9888 one. That string differs from the implementer's
task. This context didn't write the diff and didn't open the source diff.
It read the note and the diagram row, and it checked the built server as
a black box.

## Re-run
partial. I re-ran `npm test`, `npm run build` (NODE_API and
NUXT_PUBLIC_NODE_API set to the :4199 mock), a curl header check on 6
paths, an independent sha256 of the served inline scripts, and a
headless-Chrome CSP violation check with a fresh profile. Reasons: the
node is outward-facing (a security header on every production HTML
response), and the note's curl output was elided. I did not re-run lint
or typecheck. The server and mock were stopped (ports 4188 and 4199 are
free afterwards), and no real backend was called.

## PM status
`script-csp-report-only` went from IN_PROGRESS to SEALED in place. The
full row was appended to `haven/diagrams/dev-loop-archive.md`, and the
active row was replaced with a pointer. That made 21 pointer rows, so the
oldest pointer (`content-lang-en-routes`) was deleted. Its full row is
already in the archive.
