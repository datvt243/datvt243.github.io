# 2026-10-26 - resume-isr-fallback (verdict: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `resume-isr-fallback` (issue #282, branch `bug/282`)
- New PM status: SEALED
- Notes audited: `evidence/implementer/2026-10-26/resume-isr-fallback-plan.md`, `evidence/implementer/2026-10-26/resume-isr-fallback-diff.md`

## Isolation proof
This pass ran as a separate subagent. The `/todo` orchestrator spawned it through the Agent tool with the description "Verifier pass for resume-isr-fallback", apart from the implementer pass. The implementer's task string was `/todo "fix P0"` (the #282 pass), as both of its notes record. This context did not write the diff and never opened the source files or their diff. It ran only `git diff --stat`, which lists `composables/useResumeData.ts`, `nuxt.config.ts`, `pages/index.vue`, `server/utils/fetchResume.ts`, `stores/resume.ts` and the diagram (6 files, +33/-13). That matches the note's `## Diff` table.

## Is the "Acceptance criteria clarified" step legitimate?
The issue asked: "Upstream tắt/chậm → `/`, `/projects`, `/api/resume` vẫn 200 với dữ liệu cũ". In English: when the upstream is down or slow, `/`, `/projects` and `/api/resume` still return 200 with the old data. Vercel produces that 200-with-old-data response, and it cannot be reproduced locally. The implementer split the issue's intent into the two local preconditions Vercel needs:
- ISR is declared on every resume route (AC4).
- Every failed resume render ends as a status Vercel treats as a failed revalidation (AC1 to AC3).

I checked the cited platform behavior myself at https://vercel.com/docs/incremental-static-regeneration, "On failure". It says: "If revalidation fails, Vercel keeps serving the existing cached content". The failure cases it lists include "Network errors: Timeouts" and "Any status code other than 200, 301, 302, 307, 308, 404, or 410". So a 502 counts as a failure, but the old 200-with-error page would have been cached as a success. This means the clarified criteria are the necessary and sufficient local half of the original intent, not a weaker substitute.

The one place the original intent is not met is disclosed, not hidden. The same doc says "each new deployment uses its own ISR cache". If the upstream is down on the first request after a deploy, there is no stale copy, so the visitor gets a 502. That is still better than the old raw 504, or a 200 page with an error in it. The plan ("Rejected for now") and the diff note's `## Still open` both name this gap and point to a build-time snapshot as the follow-up. The reported cold start was the upstream waking up slowly. For that case, the background revalidation absorbs the wait while visitors get the cached copy. The 8s timeout then turns a slow wake into a 502, and Vercel keeps the stale copy for that too. I accept the clarification.

## Reasoning
| Check | Result |
|---|---|
| Step 4: commands match `doctrine/MEMORY.md` | `npm run build` (cold: `rm -rf .nuxt .output node_modules/.cache`), `npm run lint`, `npx nuxi typecheck`, plus a `NITRO_PRESET=vercel npm run build`. No `npm test`. |
| Step 5: truncation | Each command shows rc plus its key line. The note says plainly that the base rows in the 429 block are summarized. Those are "before" rows used only for contrast, and every fix row is printed in full. My re-run (below) independently reproduces every fix row, so this does not block. |
| Step 6: visual/behavior | CDP :9888 in an incognito context, with concrete JSON. On OK: `"okStatus": 200`, h1 "Võ Tấn Đạt", 3 project names, `"errors": []`. Cold with a failing upstream: `/en` and `/en/projects` `"status": 502`, `"rawErrorObject": false`. Screenshot at `scratchpad/p0/isr-fail-1280.png`. This evidence is concrete. |
| AC1: a failing upstream gives 5xx on the resume routes | Note: fix gives 502 on all 5 routes for both `fail` and `429`. **My re-run confirms it**, with 502 ×5 in each mode. |
| AC2: a slow upstream gives a 502 within the timeout | Note: `502 8.006588s`, against base `200 20.013897s`. **My re-run: `502 8.025635s`.** |
| AC3: one upstream call per failing fetch | Note: 5 calls for 5 requests (base 18). **My re-run: 5 / 5 / 1 (slow).** |
| AC4: Vercel output declares ISR | Note lists `expiration: 60` for `api/resume`, `en`, `en/projects` and `projects`. **My re-run of the vercel-preset build shows the same 4 files (plus their `_payload.json` siblings) with `"expiration": 60`.** I removed `.vercel/` afterwards. |
| AC5: upstream OK gives unchanged output | Note: visible text "identical" ×5 against base. My re-run shows 200 ×5 and 0 "Unable to load". I did not re-diff the text against base. |
| AC6: build, lint and typecheck are clean | Note: rc=0 ×3, WARN 0 and 0 "error TS". My re-run gives rc=0 ×3. |
| AC6b: comments follow code-comments.md | Note: 3 `/** */` WHY blocks (routeRules, useResumeData, fetchResume) and one `//` WHY line (stores/resume.ts), with no `(#N)` refs. I accept this as cited and did not open the code, per `EvidenceOnly`. |
| Step 7b: Supersedes / Still open | The note has `## Supersedes: none on the diagram`. The active diagram has no other #282 row, and `## Still open` names 2 items. |
| Step 8: forbidden states | ADHOC_WORK: no, the node row exists. NO_EVIDENCE: no. EDIT_UNVERIFIED: no, typecheck is cited and re-run. CODE_IN_HAVEN: no, only the diagram row is under `haven/`. DIAGRAM_DRIFT: no, the row moves to SEALED here. |
| Step 9: seal gate | No commit, push or PR. "none" is acceptable. |
| Step 10: proportionality | 5 source files and +33/-13 lines. `stores/resume.ts` was not in the plan, but the note justifies it with AC3 evidence: 9 calls for 5 requests dropped to 5. `pages/index.vue` removes a branch the fatal error made unreachable. The `/en/github` and similar gaps were left alone and listed. The diff is in proportion. |

## Re-run
partial. This is a caching change on production routes, which is the outward-facing exception in "Re-run scope". I re-ran the following from a warm cache, with `scratchpad/p0/env.sh` sourced:
```
npm run build → rc=0, "◆ ✨ Build complete in 14.1s!"
  1 WARN: node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-BKndnV3n.js (369:0): A comment   (same warm-cache Rollup notice seen in resume-pii-whitelist; implementer's cold build WARN 0)
npm run lint → rc=0 ("> eslint ." only)
npx nuxi typecheck → rc=0, 0 "error TS", last line "[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons"
mock upstream :4199, app .output on :4151 (fresh server per mode):
== fail  /api/resume 502 · / 502 · /en 502 · /projects 502 · /en/projects 502 · upstream calls: 5
== 429   /api/resume 502 · / 502 · /en 502 · /projects 502 · /en/projects 502 · upstream calls: 5
== slow  /api/resume 502 8.025635s · upstream calls: 1
== ok    /api/resume 200 10723B · / 200 120644B · /en 200 120617B · /projects 200 50754B · /en/projects 200 50745B · errText 0 · upstream calls: 1
== warm server, then upstream → fail: /api/resume 200 10723B · /en/projects 200 50745B (Nitro cache keeps last good)
NITRO_PRESET=vercel npm run build → rc=0, "◆ ✨ Build complete in 13.7s!"
  {en,projects,en/projects,api/resume}-isr.prerender-config.json → "expiration": 60 ; .vercel/ removed
```
I did not re-run the CDP check or the visible-text diff against base. All servers I started are stopped.

## Missing
none
