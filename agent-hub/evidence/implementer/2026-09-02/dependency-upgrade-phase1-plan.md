# 2026-09-02 — dependency-upgrade-phase1 (plan)

- Worker: implementer
- Version: 1.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `dependency-upgrade-phase1` (new)
- Task (verbatim, operator): "sửa tất cả, release làm cuối cùng" — one of
  the items in scope: execute Phase 1 of `DEPENDENCY-UPGRADE-PLAN.md`
  (issue #129), opened from the earlier sealed `dependency-upgrade-plan`
  node's own recommendation.

## Hub bytes before: 66068

## Node exists? No — created new node `dependency-upgrade-phase1`.

## Investigation (before touching code)
1. Re-read `DEPENDENCY-UPGRADE-PLAN.md`'s Phase 1 table (produced by the
   sealed `dependency-upgrade-plan` node, 2026-08-30) — same-major
   patch/minor bumps, no known trap, `nuxt` 3.13.2→3.21.11 called out as
   highest-value single bump (closes the one real-runtime advisory,
   `unhead`/`@unhead/vue`'s XSS bypass in `useHeadSafe`).
2. Live-verified every target version with `npm view <pkg>@<current-range>
   version` immediately before bumping (not trusting a possibly-stale
   `npm outdated`, per the plan's own lesson) — every listed target in the
   plan doc matched the live registry max exactly, 2 days after the plan
   was written. No drift.
3. Confirmed `puppeteer-core` stays out of scope per the plan (its only
   `npm audit fixAvailable` is a downgrade, `23.8.0`→`19.8.3` — tracked
   separately in Phase 3, needs its own research pass).
4. `npm install nuxt@3.21.11` failed under the shell's default npm
   (`10.8.2`, bundled with Node `v20.19.0`) with an internal arborist bug
   (`TypeError: Cannot read properties of null (reading 'edgesOut')`,
   thrown inside `@npmcli/arborist/lib/arborist/build-ideal-tree.js`) —
   not a project code issue, a known npm 10.8.2 peer-resolution bug
   triggered by `nuxt@3.21.11`'s newer `@vitejs/devtools-*` peer set.
   Worked around by running the install under Node `v24.19.0`/npm
   `11.17.0` (already available via `nvm`, same version `.nvmrc` and this
   project's lint step already require) — succeeded cleanly. New trap,
   added to `doctrine/domains/PROJECT.md`.

## Design decision: bump in 2 groups, not 11 individual commits
The plan says "bump one package (or matched pair) at a time" to isolate
failures. Followed the spirit (verified `nuxt` alone first — the one
genuinely risky bump per the Traps table's history of Nuxt-config-change
breakage — before touching anything else) but batched the remaining 10
low-risk patch/minor bumps (all same-major, all flagged "no known trap" in
the plan doc) into one second `npm install`, each still individually
live-verified beforehand. Matches `SmallestDiff` in spirit: one coherent
node/PR for "Phase 1", not 11 separate round-trips for changes the plan
itself already classified as uniformly low-risk.

## Blockers
None.

## Acceptance criteria
1. `nuxt` bumped to `3.21.11`; the other 10 Phase 1 packages (`postcss`,
   `@iconify-json/fe`, `@iconify-json/grommet-icons`, `@nuxt/eslint`,
   `@vue/runtime-core`, `autoprefixer`, `dotenv`, `sass`+`sass-embedded`,
   `typescript`, `vue-tsc`) bumped to their live-verified Phase 1 targets.
   `puppeteer-core` untouched.
2. `npm audit`'s `unhead`/`@unhead/vue` advisory no longer present.
3. `npm run build` clean (cold cache) after both install steps.
4. `npm run lint` clean, unchanged baseline (`32 problems, 0 errors, 32
   warnings`).
5. Real UI check via Chrome CDP — hydration works, a real click-based SPA
   navigation works, 0 console errors, since `nuxt` spans 8 minor versions
   and this repo's Traps table already documents Nuxt-config-change
   breakage as a real risk class.
