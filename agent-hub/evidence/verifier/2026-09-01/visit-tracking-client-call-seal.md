# 2026-09-01 — visit-tracking-client-call (verdict)

- Worker: verifier
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `visit-tracking-client-call`
- New PM status: **SEALED** (from IN_PROGRESS)
- Source: `agent-hub/evidence/implementer/2026-09-01/visit-tracking-client-call-{plan,diff}.md`

## NeverVerifyOwnWork
Same Claude Code session ran both passes — sanctioned by this project's
`/todo` design as long as this pass independently reproduces the evidence
rather than trusting the implementer's reasoning. Done below: cold-cache
build (`rm -rf node_modules/.cache .nuxt .output` first), independent
lint run, fresh preview port (`3991`, implementer used `3980`), fresh
separately-written CDP scripts with a stronger assertion than the
implementer's note (a real click-based SPA navigation, checking the visit
request does NOT fire a second time — the implementer's note only tested
the initial load).

## Reasoning
| # | Criterion | Cited evidence | Met? |
|---|---|---|---|
| 1 | Fires one POST to `${NODE_API}/api/me/${MY_EMAIL}/visit` per real page load | Independently re-ran a fresh CDP script against a fresh preview port — exact same URL/method captured | ✅ |
| 2 | Client-only, never during SSR/ISR; not re-fired on SPA route change | `plugins/VisitTracker.client.ts` filename suffix confirmed via `git status`/file read; independently verified via a real click-based `/` → `/contact` navigation (not `Page.navigate`) — request count stayed at 1 before and after | ✅ |
| 3 | Never blocks/throws on failure | `hasContent: true` in both independent CDP runs despite the live 404 | ✅ |
| 4 | `npm run build` clean | Independently re-run below, cold cache, exit 0 | ✅ |
| 5 | `npm run lint` clean, unchanged baseline | Independently re-run below, exact match (`32 problems, 0 errors, 32 warnings`) | ✅ |
| 6 | Real UI check via Chrome CDP | Independently re-run below with a fresh, stronger script | ✅ |

## Independent re-verification the verifier ran directly
- `git status --short` → exactly `M agent-hub/haven/diagrams/dev-loop.
  prime-mermaid.md`, `?? plugins/VisitTracker.client.ts`, `??
  agent-hub/evidence/implementer/2026-09-01/`. No other file touched —
  single new plugin file + one diagram row, matches the note's claim.
- Confirmed the diagram row exists as `IN_PROGRESS` (not already SEALED)
  before this pass — `RatchetOnly` respected.
- Re-ran `rm -rf node_modules/.cache .nuxt .output && npm run build`
  independently (full cold cache) → exit `0`; `grep -iE "error|✗|fail"`
  over the full log found no real hits (only informational asset
  filenames like `error-500.mjs` matching the substring).
- Ran `npm run lint` independently under `nvm use` (Node `v24.19.0`) →
  verbatim `✖ 32 problems (0 errors, 32 warnings)` — exact match to the
  recorded baseline.
- Chrome CDP: confirmed already up via `curl -s
  http://localhost:9888/json/version` (reused, no new instance). Started
  an independent preview server (`PORT=3991 node .output/server/
  index.mjs`, implementer used `3980`), confirmed `200` via `curl`. Wrote
  2 fresh scripts (own, deleted after use):
  1. Confirmed the exact `visitRequests` capture matches the note
     (`POST https://nodejs-resume-api-ts.onrender.com/api/me/
     votan.it@gmail.com/visit`), `hasContent: true`, and the same 2
     expected console-error lines (live 404 + this plugin's own
     `.catch()` log) — reproduced bit-for-bit.
  2. New check beyond what the implementer tested: navigated to `/`,
     confirmed 1 visit request after initial load, then did a real
     click-based SPA navigation to `/contact` (found dynamically via
     `document.querySelectorAll('a[href^="/"]')`, not hardcoded, and not
     `page.goto`/`Page.navigate` which would bypass client-side routing)
     — confirmed the visit-request count stayed at exactly 1 afterward.
     This directly proves criterion 2's "not re-fired on SPA route
     change" claim, which the implementer's own note had only reasoned
     about from Nuxt plugin semantics, not empirically tested.
- Cleanup: preview process killed (own PID), confirmed via `ps aux | grep
  index.mjs` no stray listener remained. Both temp scripts deleted.
  `git status --short` re-checked after cleanup — unchanged from before.

## Forbidden states scan
| State | Hit? | Note |
|---|---|---|
| `ADHOC_WORK` | No | New node `visit-tracking-client-call` on the diagram, task explicitly given by the operator |
| `NO_EVIDENCE` | No | Full plan + diff notes present, matching the real diff |
| `EDIT_UNVERIFIED` | No | Build/lint independently re-run from cold cache + real CDP evidence independently re-run with fresh scripts/port, including a stronger check the implementer hadn't done |
| `CODE_IN_HAVEN` | No | Only PM status + evidence notes touched in `haven/`/`evidence/`; real code lives in `plugins/` |
| `DIAGRAM_DRIFT` | No (after this seal) | PM status updated to match below |

## Visual/behavior check
Non-visual (a background network call, no DOM/visual change) but has a
real runtime behavior — covered via Chrome CDP per `doctrine/domains/
PROJECT.md`'s Browser verification section, independently reproduced with
a stronger assertion than the implementer's own check (see above).

## Proportionality
Single new file (`plugins/VisitTracker.client.ts`) + one diagram row —
exactly what the task required, no opportunistic touch to any other file
(e.g. did not add the backend's separate authenticated `GET /visits`
admin-read flow, correctly flagged as out of scope in "Noticed, not
done"). Matches `SmallestDiff`.

## Seal gate
None recorded, none needed — no commit/push/PR happened in either pass;
`git status` shows only working-tree changes, no branch created yet.

## Missing
None — no REOPEN.

## Disclosure carried forward (not this repo's to fix)
- Production `NODE_API` (`nodejs-resume-api-ts.onrender.com`) does not
  have `POST /api/me/:email/visit` live yet — the backend's
  `feat/visit-tracking` branch isn't merged/deployed. This repo's change
  is correct against the reviewed backend contract; the 404s will resolve
  once that branch ships, no further action needed here.
- Backend's own gap (no `trust proxy` on Express, real visitor IP may not
  resolve correctly behind Render's reverse proxy) is backend-side, out
  of this repo's reach.
