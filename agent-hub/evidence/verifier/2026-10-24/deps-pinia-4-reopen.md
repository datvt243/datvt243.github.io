# 2026-10-24 - deps-pinia-4 (REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `deps-pinia-4` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Evidence judged: `evidence/implementer/2026-10-24/deps-pinia-4-diff.md` (+ `-plan.md`)
- New PM status: unchanged, `IN_PROGRESS` (REOPEN, the ratchet only moves on SEAL)

## Isolation proof
Separate subagent spawned through the Agent tool by `/todo`, description
`"Verifier pass deps-pinia-4"`, with a fresh context. This pass did not write the diff and
did not open it. It read only the notes, the node row, and the bundle. The
implementer's task string was `/todo "xử lý nhóm A"` → issue #265, which is different.

## Reasoning
| Criterion (node row) | Evidence in note | Judgment |
|---|---|---|
| `npm ls` shows pinia 4.1.x / @pinia/nuxt 1.0.x | `@pinia/nuxt@1.0.3` → `pinia@4.1.0 deduped`; `pinia@4.1.0` → `@vue/devtools-api@8.2.1` | met |
| `npm run build` clean | rc=0, `└  ✨ Build complete!`. The only warning is the i18n `optimizeTranslationDirective` warning, which the note shows was already present before the change | met |
| `npm run lint` clean | rc=0, 0 problems (baseline 0) | met |
| `npx nuxi typecheck` clean | rc=0, `grep -c "error TS"` = 0 (baseline 0) | met (cited as a count, not a verbatim tail, but enough to tell) |
| `npm audit` before/after | 60 → 60 | met |
| Store data renders on `/`, `/projects`, `/en` | CDP: `hasPinia:23`, `/projects` sample contains project entries, `/en` `lang:"en-US"` | met |
| real click-nav | `projects link found: true`, then a `click()` to `/projects` | met |
| 0 console errors | `console issues: none`, with one class filtered out (VisitTracker CORS). Spot-checked the stated proof myself, and it holds: `git diff --stat staging -- plugins` is empty; the last commit touching `plugins/VisitTracker.client.ts` is `a02d772` (2026-10-04); the plugin has no `pinia`/`Store` reference; `curl -X OPTIONS -H "Origin: https://resume-nuxt-vert.vercel.app"` to the backend returns `HTTP/2 200` with `access-control-allow-credentials`/`-methods` but **no `access-control-allow-origin`**. The exclusion is justified | met |
| **0 hydration warnings** | Note says "NOT provable on a prod build … not claimed" | **missing** |
| comments per code-comments.md | N/A, no source comments touched (diff is package.json/lockfile/diagram only) | met |
| Supersedes check (7b) | `## Supersedes: none`. `grep "#265"` on the active diagram finds only this row | met |

Forbidden states: none hit. The diagram row exists (no `ADHOC_WORK`/`DIAGRAM_DRIFT`), notes are present (no `NO_EVIDENCE`), no code is in `haven/`, and the claims that are made are backed by evidence. The implementer was honest not to claim the hydration item. Not claiming it does not satisfy it, though.
Seal gate: no outward-facing action (no commit/push/PR), so none needed.
Proportionality: the diff is limited to the two package files and one diagram row, so it is minimal.

Why REOPEN and not SEAL: recipe step 7 says "any criterion missing evidence =
REOPEN". "0 hydration warnings" is written in the node's own acceptance list.
The verifier cannot drop it from the list (`RatchetOnly`/`EvidenceOnly`), and the
"Re-run scope" section says to REOPEN on a missing citation instead of having
the verifier produce the evidence. A pinia major bump that touches SSR state
serialization is exactly the change where a hydration mismatch could show up,
so this criterion carries real weight here.

## Missing
1. **0 hydration warnings: no evidence.** Run the same CDP check against
   `npm run dev` (dev mode prints Vue's `Hydration ... mismatch` warnings),
   with `.env` loaded, on `/`, `/projects` (click-nav) and `/en`. Then cite the
   verbatim count of console messages that match `/hydrat/i`; it should be 0.
   Keep the same documented VisitTracker CORS exclusion.
   (Non-blocking, for the rework: quote the last line of the `npx nuxi typecheck`
   output verbatim, in addition to the `grep -c` count.)

## Re-run
`none`: no build, lint, typecheck or CDP re-run. The only checks were read-only
spot-checks of the CORS-exclusion claim (`git diff --stat staging -- plugins`,
`git log -1 -- plugins/VisitTracker.client.ts`, a grep of the plugin, one
`curl -X OPTIONS` preflight).
Disclosure: that `curl` was a request to an external API, sent without asking
the operator first. It was a bodiless CORS preflight with no side effects. It
repeated the implementer's own check, and the operator's task allowed
spot-checks.
