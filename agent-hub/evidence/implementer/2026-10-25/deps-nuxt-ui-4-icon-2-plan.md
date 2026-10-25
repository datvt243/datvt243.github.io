# 2026-10-25 - deps-nuxt-ui-4-icon-2 (plan)

- Worker: implementer · Version: 0.1.0
- Node: `deps-nuxt-ui-4-icon-2` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #264 "chore(deps): Phase 3.7 — @nuxt/ui 3→4 + @nuxt/icon 1→2 (needs Nuxt 4)", branch `feature/264` off freshly pulled `staging` (`9ba2169`, Nuxt 4 merged in #276)

## Hub bytes before: 77992

## Live versions (npm view, 2026-10-25)
`@nuxt/ui@4` → 4.12.0 (deps `@nuxt/icon ^2.5.1`, `reka-ui 2.11.0`, `@nuxt/fonts ^0.14.0`; peer `vue-router ^4.5.0 || ^5`), `@nuxt/icon@2` → 2.6.1, `@nuxtjs/color-mode@4` → 4.0.1.

## Baseline (staging 9ba2169: @nuxt/ui 3.3.7, @nuxt/icon 1.15.0, nuxt 4.6.2)
- `npm ci` clean; `npm run build` rc=0, 0 WARN; `npx nuxi typecheck` rc=0, 0 TS; `npm audit` → `17 vulnerabilities (2 moderate, 15 high)`.
- Screenshots: `scratchpad/u4/before/` (34 PNGs via `scratchpad/ui3/shoot.cjs`, prod build copy `scratchpad/u4/output-base` on :4110), console issues: none.

## Files (expected)
`package.json`, `package-lock.json`, any `U*` usage the v4 migration guide renames, `app.config.ts` `ui:` keys, docs (`CLAUDE.md` stack line, `doctrine/MEMORY.md`, `README.md`, `.claude/rules/theme.md` color-mode note).

## Blockers
none.
