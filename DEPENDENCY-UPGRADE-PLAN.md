# Dependency Upgrade Plan

> Audit + plan only (issue #91) — **no package was actually bumped** as part
> of producing this document. Each phase below is meant to become its own
> issue/branch/PR, verified independently (`npm run build` + `npm run lint`
> + CDP if user-visible), one phase at a time — not one giant `npm audit fix
> --force`.

## Current state (verified 2026-08-30, live)

```
$ npm audit
53 vulnerabilities (4 low, 8 moderate, 35 high, 6 critical)
```

```
$ npm audit fix --dry-run
53 vulnerabilities (4 low, 8 moderate, 35 high, 6 critical)
```
Confirms the issue's claim: `npm audit fix` (no `--force`) genuinely
resolves nothing — every advisory needs a version bump beyond what's
already permitted by `package.json`'s current semver ranges.

## Root-cause classification

| Package(s) | Severity | Reachable at runtime? | Why |
|---|---|---|---|
| `undici` (14 advisories) | high | **No** | Only via `nitropack → openapi-typescript`, a build-time-only tool. Never bundled into the deployed server output. |
| `unhead` / `@unhead/vue` (3 advisories, XSS bypass in `useHeadSafe`) | moderate | **Yes** | Comes straight from `nuxt` itself, and `useHead`/`useSeoMeta` are used throughout every page (see root `CLAUDE.md`'s pages table). This is the one advisory in the whole list with real user-facing risk. |
| `koa`, `tar`, `tar-fs`, `shell-quote`, `simple-git`, `@nuxt/devtools`, `changelogen`, `giget`, `c12`, `vite`/`esbuild`/`rollup`, `@nuxt/kit`, `nitropack`, `@nuxt/telemetry`, `@nuxtjs/color-mode`'s `changelogen` chain | high/critical (bulk of the 53) | **No** | All trace to Nuxt's own dev/build tooling (`nitropack`, `@nuxt/kit`, `@nuxt/devtools`, the Vite pipeline) — confirmed via `npm audit --json`'s dependency paths, not guessed. None of these ship in `.output/server` or the client bundle. |
| `@puppeteer/browsers` / `extract-zip` (high) | high | Partially — build/CLI-only path | Puppeteer's browser-downloader helper, used only when fetching a Chrome binary, not during a normal request. Still worth resolving since `PUPPETEER_EXECUTABLE_PATH` is required in production anyway (browser download path unused there), but lower urgency than `unhead`. |

**Bottom line**: of 53 advisories, only the `unhead`/`@unhead/vue` group is
genuinely reachable in production. Everything else is real but lower
urgency — still worth clearing for hygiene, just not the fire drill the raw
"6 critical" count suggests.

## Live registry cross-check — important finding

`npm outdated`'s cached numbers were mostly accurate, but **`nuxt` specifically was stale**:

```
$ npm outdated   (earlier run)
nuxt   3.13.2   3.17.7   3.17.7
```
```
$ npm view "nuxt@^3.13.0" version   (live)
... 3.21.11 is the true max satisfying ^3.13.0 ...
$ npm view nuxt dist-tags
{ '3x': '3.21.11', latest: '4.5.2', ... }
```
The real range-satisfying max is `3.21.11`, four minor versions ahead of
what a plain `npm update` would have picked up from the stale local read.
Cross-checked `@nuxt/ui` (outdated said `2.22.3`, live `npm view
"@nuxt/ui@^2.18.6" version` confirms `2.22.3` — accurate) and `@nuxt/image`
(outdated said `1.11.0`, live confirms `1.11.0` — accurate), so this isn't a
systemic problem, just a `nuxt`-specific cache miss.

**Lesson for whoever executes this plan**: re-run `npm view
<pkg>@<current-range> version` live immediately before each bump — don't
trust a possibly-cached `npm outdated` snapshot from earlier in the
session (this one was from earlier the same day).

## Phase 1 — same-major patch/minor, no known trap (do first, low risk)

| Package | Current | Safe target (live-verified) |
|---|---|---|
| `nuxt` | 3.13.2 | **3.21.11** (not 3.17.7 — see cross-check above). Fixes the real-runtime `unhead`/`@unhead/vue` XSS bypass, since `@unhead/vue`'s version floor moves with `nuxt`'s own dependency declarations. **Highest-value single bump in this whole plan.** |
| `postcss` | 8.4.47 | 8.5.26 (also directly named in `npm audit`'s own high-severity postcss advisory) |
| `@iconify-json/fe` | 1.2.1 | 1.2.4 |
| `@iconify-json/grommet-icons` | 1.2.0 | 1.2.4 |
| `@nuxt/eslint` | 1.16.0 | 1.17.0 |
| `@vue/runtime-core` | 3.5.12 | 3.5.42 |
| `autoprefixer` | 10.4.20 | 10.5.4 |
| `dotenv` | 16.4.5 | 16.6.1 |
| `sass` / `sass-embedded` | 1.80.3 / 1.80.3 | 1.99.0 / 1.100.0 (bump the pair together, matched versions) |
| `typescript` | 5.6.3 | 5.9.3 (still 5.x) |
| `vue-tsc` | 2.1.6 | 2.2.12 (still 2.x) |

Bump one package (or one matched pair, e.g. `sass`+`sass-embedded`) at a
time, `npm run build` + `npm run lint` after each, evidence note per step —
not one combined commit.

**`puppeteer-core` is deliberately excluded from Phase 1** — `npm audit`'s
own `fixAvailable` suggests `puppeteer-core@19.8.3`, which is a
**downgrade** from the current `23.8.0` (npm audit resolver quirk: that
older major's dependency tree happens not to include the vulnerable nested
`extract-zip`/`@puppeteer/browsers`, but downgrading a real production
dependency used by `/api/generate-pdf` on a resolver artifact, not a real
upgrade path, is not something to do on autopilot). Needs its own manual
research pass on which `puppeteer-core` version ≥ current actually resolves
the nested advisory — tracked in Phase 3.

## Phase 2 — same-major, re-verify live before executing

| Package | Current | Safe target (same major) |
|---|---|---|
| `@nuxt/icon` | 1.5.6 | 1.15.0 (2.x is a separate major, Phase 3) |
| `@nuxt/image` | 1.8.1 | 1.11.0 (2.x is a separate major, Phase 3) |
| `@nuxt/ui` | 2.18.7 | 2.22.3 (3.x/4.x is a separate major, Phase 3, bundled with the Tailwind v4 move) |

## Phase 3 — majors, defer, one issue per row

| Package | Current major | Target major | Known risk |
|---|---|---|---|
| `@nuxtjs/i18n` | 9.x | 10.x | **Already tried and failed** in issue #75 — a real build error, documented as a trap in `agent-hub/doctrine/domains/PROJECT.md`. Needs its own dedicated investigation pass, not a drive-by bump. |
| `@nuxt/ui` | 2.x | 4.x | Breaking Vue API changes, and pulls in Tailwind v4 as a peer — bundle with the `tailwindcss` major below into one project, not two separate breaking changes. |
| `tailwindcss` | 3.x | 4.x | New engine (Oxide), CSS-first config. This repo's `tailwind.config.js` + every `bg-theme-*`/`text-theme-*` opacity-modifier usage (`rgb(var(--theme-x) / <alpha-value>)`, documented in root `CLAUDE.md`'s Color mode section) needs a real rewrite, not a version bump. Do only as part of the `@nuxt/ui` v4 move. |
| `pinia` | 2.x | 4.x | `stores/resume.ts` (`useResumeStore`, the site's main data layer) needs a migration-guide read-through before touching. |
| `@pinia/nuxt` | 0.5.x | 1.x | Bump together with `pinia` itself, matching its peer range. |
| `@nuxt/icon` | 1.x | 2.x | Separate major from the Phase 2 1.x bump. |
| `@nuxt/image` | 1.x | 2.x | Separate major from the Phase 2 1.x bump. |
| `vue-router` | 4.x | 5.x | Nuxt 3 pins Vue Router 4 internally — bumping standalone before Nuxt itself supports v5 risks a version mismatch. Defer to a future Nuxt 4 migration (explicitly out of this plan's scope — Nuxt 4 itself is a much larger, separate project). |
| `puppeteer-core` | 23.8.0 | TBD | See Phase 1 note — needs manual research on the correct target version, not `npm audit`'s literal (downgrade) suggestion. |

## What NOT to do

- Don't run `npm audit fix --force` blind — it jumps every package
  (including every major above) in one shot with no isolation, exactly the
  opposite of what issue #91 asked for ("không làm gộp 1 lần để dễ cô lập").
- Don't follow `npm audit`'s literal `fixAvailable` suggestion for
  `puppeteer-core` (`19.8.3`) — that's a downgrade, not an upgrade, and
  risks breaking `/api/generate-pdf`.
- Don't touch `@nuxtjs/i18n` without re-reading the exact failure from
  issue #75 first (`agent-hub/doctrine/domains/PROJECT.md`'s Traps table) —
  already a proven trap, not a hypothetical risk.

## Suggested execution order

1. **Phase 1** (one PR) — low risk, highest value: closes the one
   real-runtime advisory (`unhead`/`@unhead/vue`) via the `nuxt` bump alone.
2. **Phase 2** (one PR).
3. **Phase 3**, one issue per row, in this order: `pinia`+`@pinia/nuxt`
   (self-contained, isolated to `stores/`) → `@nuxt/icon`/`@nuxt/image`
   (isolated to icon/image usage) → `puppeteer-core` (needs research first)
   → `@nuxt/ui`+`tailwindcss` (bundled, largest blast radius — do after the
   smaller majors have de-risked the process) → `@nuxtjs/i18n` (known
   failure mode, needs a dedicated investigative pass) → `vue-router`
   (blocked on a future Nuxt 4 migration, out of scope for now).

## Acceptance criteria for the node that closes issue #91

1. This plan exists and is accurate against real `npm audit`/`npm
   outdated`/`npm view` output (cited verbatim in evidence, not
   paraphrased).
2. No dependency was actually bumped as part of closing this issue — pure
   audit + plan, exactly as scoped ("1 pass riêng để lên kế hoạch... không
   làm gộp 1 lần").
3. `npm run build` + `npm run lint` still clean (nothing in `package.json`
   or source was touched).
