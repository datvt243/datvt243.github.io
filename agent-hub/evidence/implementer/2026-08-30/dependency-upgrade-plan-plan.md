# 2026-08-30 — dependency-upgrade-plan (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `dependency-upgrade-plan` (new)
- Task (verbatim, issue #91): `npm audit` reports 53 vulnerabilities (4
  low, 8 moderate, 35 high, 6 critical). `npm audit fix` (no `--force`)
  fixes nothing — needs breaking-change bumps. Repo is behind on `nuxt`
  (3.13→3.17), `@nuxt/ui` (2.18→4.x major), `@nuxtjs/i18n` (9.5→10.x — a
  known trap from #75), `tailwindcss` (3→4 major). Need: a dedicated pass
  to PLAN phased bumps (patch/minor first, majors evaluated carefully) —
  explicitly not to execute them all at once.

## Node exists? No — created new node `dependency-upgrade-plan`.

## Real data gathered (not guessed)
- `npm audit` → verbatim `53 vulnerabilities (4 low, 8 moderate, 35 high, 6
  critical)` — matches the issue's claim exactly.
- `npm audit fix --dry-run` → still `53 vulnerabilities` after — confirms
  nothing resolves without a real version bump.
- `npm audit --json` parsed for dependency paths → classified which
  vulnerable packages are build-time-only (`nitropack`, `vite`,
  `@nuxt/devtools`, `koa`, `tar`, etc. — never shipped in `.output/server`)
  vs genuinely runtime-reachable (`unhead`/`@unhead/vue`, direct from
  `nuxt`, used via `useHead`/`useSeoMeta` everywhere).
- `npm outdated` — initial read, then cross-checked live via `npm view
  <pkg>@<range> version` / `npm view <pkg> dist-tags`. Found `nuxt`'s
  cached `npm outdated` numbers were stale (`3.17.7` shown, live check
  shows the true `^3.13.0`-satisfying max is `3.21.11`) — `@nuxt/ui` and
  `@nuxt/image`'s cached numbers were cross-checked and found accurate, so
  this was a `nuxt`-specific cache miss, not systemic.

## Blockers
None. No env var needed — this is an audit + planning task, no code
touched.

## Acceptance criteria
1. A plan document exists, phased (patch/minor first, majors deferred one
   issue each), citing real audit/outdated/view output verbatim.
2. No dependency actually bumped as part of this node — pure audit + plan,
   matching the issue's explicit scope.
3. `npm run build` + `npm run lint` clean (nothing in `package.json` or
   source touched, so no change expected from the standing baseline).
