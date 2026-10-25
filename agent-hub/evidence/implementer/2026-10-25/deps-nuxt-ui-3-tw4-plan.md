# 2026-10-25 - deps-nuxt-ui-3-tw4 (plan)

- Worker: implementer · Version: 0.1.0
- Node: `deps-nuxt-ui-3-tw4` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row; slug grepped in both diagram files → 0 hits before appending)
- Task: issue #262 "Phase 3.5 — @nuxt/ui 2→3 + Tailwind 3→4 (on Nuxt 3)", part of #266. Branch `feature/262` off `staging` @ `7ec2b12`, worked in a separate git worktree (main checkout holds uncommitted #261).

## Hub bytes before: 78833 (measured right after appending the node row)

## Baseline (unmodified staging code)
- `npm run build` rc=0, `npm run lint` 0 problems, `npx nuxi typecheck` rc=0
- `npm audit`: 52 vulnerabilities (1 low, 2 moderate, 46 high, 3 critical)
- Screenshots: `scratchpad/ui3/shoot.cjs` against a prod build on :4081 → 34 PNGs (7 routes × dark/light × 1440/390, plus help modal and toast at 1440, mobile menu at 390). Console: only `warn: There are no focusable elements inside the <FocusTrap />`.
- The first help-modal capture showed Vimium's overlay (`?` swallowed in the debug profile); the script now clicks the header `?` button, and the baseline was recaptured.

## Acceptance criteria
1. `@nuxt/ui` 3.3.x and `tailwindcss` 4.x installed.
2. build + lint + typecheck clean.
3. Before/after screenshots pixel-diffed per file; every non-zero diff explained (intended or fixed).
4. Real-click checks: help modal (header `?`), mobile slideover, CV toast, blogs per-page select, pagination, GitHub repo search input.
5. Dracula palette still applies only inside `<ThemePanel>`; `--theme-kbd` badges orange inside and outside; light/dark toggle works.
6. `npm audit` before/after recorded.

## Scope / files
- `package.json`/lockfile, `nuxt.config.ts` (postcss), `tailwind.config.js` (→ CSS `@theme`), `assets/css/tailwindcss.css`, `app.config.ts`, `app.vue`, `composables/useDownloadResume.ts`, `utils` (`accentBadgeUi`), and the theme components using UModal/USlideover/USelect/UPagination/UInput/UBadge/UMeter*.
- Dead code removed on the way (0 usages, grep-verified): tinycolor color scales, `pink`/`dark`/`darkness`, the `--color-green/pink` plugin, `container.center`, `.btn*`, `.container-block`.

## Blockers
none.
