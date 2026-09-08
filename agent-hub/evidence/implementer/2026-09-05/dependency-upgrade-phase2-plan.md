# 2026-09-05 — dependency-upgrade-phase2 (plan)

- Worker: implementer
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `dependency-upgrade-phase2` (new)
- Task (verbatim, operator): "#135 và #136" via `/todo` — this note covers
  #135 only. #136 was found to already be resolved (see the separate report
  to the operator; no node created for it, per `pick_next.md`'s "no PENDING
  node" failure branch — nothing to implement, not silently skipped).

## Hub bytes before: 68286

## Node exists? No — created new node `dependency-upgrade-phase2`, IN_PROGRESS.

## Investigation (before touching code)
1. Re-read `DEPENDENCY-UPGRADE-PLAN.md`'s Phase 2 table (produced by the
   sealed `dependency-upgrade-plan` node, 2026-08-30): `@nuxt/icon`,
   `@nuxt/image`, `@nuxt/ui` same-major bumps, no known trap.
2. Live-verified every target immediately before bumping (not trusting a
   cached `npm outdated`), per the plan's own lesson:
   - `npm view "@nuxt/icon@^1.5.6" version` → live max satisfying current
     range is `1.15.0` (was `1.5.6`). Confirmed `@nuxt/icon`'s own
     `dist-tags.latest` is `2.5.1` (a separate major, correctly out of
     scope — Phase 3).
   - `npm view "@nuxt/image@^1.8.0" version` → live max `1.11.0` (was
     `1.8.1` per `package-lock.json`'s actually-installed version; the plan
     doc's `1.8.1` "current" was the installed-not-range value). Confirmed
     `@nuxt/image`'s `dist-tags.latest` is `2.1.0` (separate major, Phase 3).
   - `npm view "@nuxt/ui@^2.18.6" version` → live max `2.22.3` (was
     `2.18.7` installed). Confirmed `@nuxt/ui`'s `dist-tags.latest` is
     `4.11.0` (separate major, Phase 3, bundled with the Tailwind v4 move
     per the plan doc).
   All 3 targets match the plan doc's Phase 2 table exactly — no drift in
   the 6 days since the plan was written.
3. Confirmed `.nvmrc` (`24`) already pins the Node version needed to avoid
   the documented npm-10.8.2 arborist bug (Traps table) — used `nvm use 24`
   for `npm install`.

## Design decision
Bump all 3 in one `npm install` step (matches the plan's own
classification: all same-major, all "no known trap") — same batching
approach `dependency-upgrade-phase1` used for its low-risk group, one
coherent node instead of 3 round-trips for changes already classified
uniformly low-risk.

## Blockers
None. No env var needed for this change.

## Acceptance criteria
1. `@nuxt/icon` `^1.5.6`→`^1.15.0`, `@nuxt/image` `^1.8.0`→`^1.11.0`,
   `@nuxt/ui` `^2.18.6`→`^2.22.3` in `package.json`; `package-lock.json`
   regenerated to match. No other package touched.
2. `npm run build` clean (cold cache).
3. `npm run lint` clean, unchanged baseline (32 problems, 0 errors).
4. Real UI check via Chrome CDP — `@nuxt/icon` and `@nuxt/ui` both render
   visible UI (icons throughout the site, `UBadge`/`USelect`/`UPagination`
   components), so this qualifies as a visual change needing CDP per
   `doctrine/domains/PROJECT.md`.
5. `npm audit` count re-checked (informational — not required to drop,
   Phase 2 packages weren't flagged as carrying the `unhead` advisory).
