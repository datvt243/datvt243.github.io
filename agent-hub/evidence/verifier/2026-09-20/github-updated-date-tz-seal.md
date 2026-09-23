# 2026-09-20 — github-updated-date-tz (verifier verdict)

**Worker:** verifier
**Node:** `github-updated-date-tz`
**New PM status:** SEALED

## Isolation proof
This pass was spawned as the `verifier` worker for issue #202 via a task
prompt beginning "You are being spawned as the `verifier` worker for the
datvt243.github.io agent-hub. This is a fresh, independent context — do NOT
trust or reuse any reasoning from whoever implemented this change" — a
distinct spawn/task string the implementer pass never saw (it also notes a
prior verifier attempt on this same node crashed before writing any
evidence — this is a genuinely fresh, first real verifier attempt, not a
continuation of that crashed one). This session did not write the
`Item.vue` diff being graded — `NeverVerifyOwnWork` holds.

## Reasoning

1. **Diff matches the note.** `git diff -- themes/portfolio-dev/pages/github/part/Item.vue`
   independently confirmed the exact change described: a new `updatedOnLabel`
   computed — `new Date(props.modelValue.updated_at).toLocaleDateString('en-US', { timeZone: 'UTC' })`
   — with the template's `updatedOn` line switched from the inline
   `new Date(...).toLocaleDateString()` call to `{{ updatedOnLabel }}`. No
   extra files touched, no unrelated changes (`SmallestDiff` holds).

2. **Root-cause mechanism independently reproduced.**
   ```
   $ TZ=UTC node -e "console.log(new Date('2026-09-23T20:00:00Z').toLocaleDateString())"
   9/23/2026
   $ TZ=Asia/Ho_Chi_Minh node -e "console.log(new Date('2026-09-23T20:00:00Z').toLocaleDateString())"
   9/24/2026
   ```
   Same instant, different calendar date depending on runtime TZ — confirms
   the bug mechanism the note describes, run fresh in this session (not
   trusted from the implementer's numbers).

3. **Build clean.** `npm run build` run fresh in this session, tail:
   ```
   [nitro] ✔ You can preview this build using node .output/server/index.mjs
   │
   └  ✨ Build complete!
   ```
   0 errors, matches the note.

4. **Lint clean, baseline unchanged.** `npm run lint` run fresh in this
   session, verbatim tail:
   ```
   ✖ 13 problems (0 errors, 13 warnings)
   ```
   Exact match to the note's claimed baseline (`13 problems, 0 errors, 13
   warnings`) — same warning list (unused-vars/no-explicit-any/no-console
   in unrelated files), nothing new introduced by this diff.

5. **Local machine TZ confirmed, not assumed.** `date +%Z` → `+07` (ICT) —
   matches the note's claim this machine's real local TZ is ICT, the actual
   client side of the mismatch.

6. **Critical cross-timezone repro — done for real, independently.**
   - `rm -rf .output` (removed the stray build from step 3 first), then a
     fresh `npm run build` (default `node-server` preset), producing a new
     `.output/server/index.mjs`.
   - Ran it with `TZ=UTC PORT=4999 node .output/server/index.mjs` — matches
     Vercel's real server TZ. Confirmed listening (`Listening on
     http://[::]:4999`, `curl` to `/github` → `200`).
   - Confirmed the local Chrome CDP instance was already up:
     `curl -s http://localhost:9888/json/version` → valid response
     (`Chrome/153.0.8010.53`).
   - Wrote a standalone `puppeteer-core` script (`puppeteer.connect({
     browserURL: 'http://localhost:9888' })`), opened 5 **fresh** pages
     (`browser.newPage()` each time, `setCacheEnabled(false)`, `goto(...,
     { waitUntil: 'networkidle0' })` — not SPA navigation), listening on
     `page.on('console', ...)` for any message matching `/hydrat/i` or
     `/mismatch/i`, plus `page.on('pageerror', ...)`.
   - Result across all 5 fresh loads: **0 hydration-related console
     messages**, and each load rendered real repo content (confirmed via a
     separate debug run's DOM dump: `"Cập nhật vào 9/23/2026"` etc. — the
     repo dates actually render, this isn't an empty/error page passing
     trivially).
   - **Verified the negative is meaningful, not a false negative from
     dead-code elimination.** Vue's hydration-mismatch warning
     (`console.error("Hydration completed but contains mismatches.")`,
     confirmed present in `node_modules/@vue/runtime-core/dist/
     runtime-core.cjs.js`) is dev-only code in some builds — checked
     whether it survives Nuxt's production client bundle:
     `grep -o "mismatch" .output/public/_nuxt/*.js` → 2 hits in
     `GUAO1MGq.js`; `grep -l "Hydration" .output/public/_nuxt/*.js` → same
     file; extracted context confirms the exact string
     `console.error("Hydration completed but contains mismatches.")` is
     present verbatim in the actual minified production bundle under test.
     So a real mismatch, had one occurred, would have surfaced on
     `page.on('console', ...)` — the 5/5 clean result is real evidence, not
     an artifact of the warning being stripped.
   - Killed the test server (`kill` on its PID, confirmed no longer in
     `ps`), removed the temporary `.cjs` scripts, and `rm -rf .output`
     afterward. `git status --short` after cleanup shows only the
     pre-existing implementer changes (the diagram edit + `Item.vue` diff +
     the two new evidence files) — no leftover artifacts from this
     verification pass.

7. **Acceptance criteria (from the implementer's plan note), one by one:**
   | Criterion | Evidence |
   |---|---|
   | Date computed identically regardless of runtime TZ | `updatedOnLabel`'s `timeZone: 'UTC'` pin (diff, confirmed above) + 5/5 clean cross-TZ CDP run |
   | `npm run build`/`npm run lint` clean, baseline unchanged | Reasoning items 3-4 above, verbatim output matches |
   | Real reproduction of the actual failure mode (cross-TZ, not same-TZ smoke test) | Reasoning items 2 and 6 above — genuine `TZ=UTC` server vs real `+07` client, not a same-machine same-TZ test |

8. **Forbidden states scan:** No `ADHOC_WORK` (change traces to this node
   on the diagram). No `NO_EVIDENCE` (both implementer notes present and
   read). No `EDIT_UNVERIFIED` (build/lint/CDP all independently re-run and
   read, not inferred). No `CODE_IN_HAVEN` (only `.md` evidence/diagram
   files touched by either pass). No `DIAGRAM_DRIFT` (diagram row updated
   to SEALED in this same pass, matching the now-verified code state).

9. **Seal gate:** No outward-facing action taken by this verifier pass
   either — no commit/push/PR. Per instructions, this pass does not commit
   or push; that remains the operator's own `/ship` step.

## Re-run
`full` — re-ran `npm run build`, `npm run lint`, and the full CDP
cross-timezone reproduction (cold `.output` rebuild, fresh server process,
5 fresh page loads) from scratch in this session, per the recipe's
"Re-run scope" exception: this node is outward-facing (a real production
hydration bug on a live personal site) and depends on a genuine
cross-timezone mechanism that a note-only audit cannot independently
confirm without re-running the actual repro.
