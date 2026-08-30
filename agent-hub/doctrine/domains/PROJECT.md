# doctrine/domains/PROJECT.md ★ — ground truth of datvt243.github.io

## What is it
Personal portfolio & blog of Võ Tấn Đạt (datvt243). Nuxt 3 SSR app with ISR
caching, running in real production (not a demo). Full details on the
stack/routes/theme system live in the root `CLAUDE.md` — this file only
records what CANNOT be inferred from reading the code, and doesn't repeat
the root `CLAUDE.md`'s content.

## Stack + shape
| Thing | Value |
|---|---|
| Language/runtime | TypeScript, Nuxt 3 / Vue 3 SSR |
| Entry point | `app.vue` (chrome) + `pages/*.vue` (thin loaders, each file renders exactly one `Theme*` component) |
| Data store | No DB — all data comes from external APIs (resume Node API, blog API, GitHub API) |
| Theme system | `themes/<name>/` swappable via `ACTIVE_THEME` in `nuxt.config.ts` — see the "UI Theme" section of root `CLAUDE.md` |

## Invariants (things that never happen here)
- **Never push directly to `main`** — always through a `bug/<issue_number>`
  or `feature/<issue_number>` branch + pull request.
- **`bug/*` and `feature/*` branches may both be deleted after merging**
  (as of 2026-08-30 — operator explicitly changed this from the old
  `feature/*`-never-deleted convention, see Decisions table below).
- **No automated test suite** — "verified" means `npm run build` clean +
  `npm run lint` clean + a real UI check (see the Browser verification
  section). Never claim "tests pass".
- **`server/plugins/RenderHTML.ts`** must never set a literal color
  (a Tailwind class like `bg-slate-950`) — must use a theme token
  (`bg-theme-*`), otherwise it invisibly breaks light mode (this really
  happened, see Traps).

## Browser verification
When a change has a visual/behavior part the user would see: run the
`/browser` command (`.claude/commands/browser.md` — still there, NOT
removed, came back to the repo via PR #66) to make sure a debuggable Chrome
is available on port 9888, which self-checks `curl -s
http://localhost:9888/json/version` first and only launches a new instance
if none is running (don't call `curl`/`open -na` by hand when this command
already exists). Then connect with `puppeteer-core`
(`puppeteer.connect({ browserURL: 'http://localhost:9888' })` — already an
existing dependency, don't add a new tool). Prefer real click-based
navigation (not raw `Page.navigate`) when testing cache/hydration behavior
— `Page.navigate` bypasses the client cache and doesn't exercise the real
bug (a lesson from the stale-while-revalidate fix).

## Diagram-first
The diagram (`haven/diagrams/`) is the source of truth for progress — the
code must match it.

## Forbidden states
See `agent-hub/CLAUDE.md` — `ADHOC_WORK`, `NO_EVIDENCE`, `EDIT_UNVERIFIED`,
`CODE_IN_HAVEN`, `DIAGRAM_DRIFT`.

## Traps (append when you hit a new one)
| Trap | Why | What to do instead |
|---|---|---|
| Nuxt `useFetch`'s default `getCachedData` doesn't survive client-side re-navigation (only reads the SSR/static payload at hydration) | Every time you return to a route it refetches from scratch even if already fetched earlier in the session | Set a fixed `key` + a custom `getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]` to read straight from `nuxtApp.payload.data` (survives the whole SPA session) |
| Nuxt calls `onMounted` **twice** for the same real navigation (due to Suspense/transition), not a bug in your own code | A dedupe like "skip if a fetch is already in-flight" doesn't catch it — the first fetch can finish before the 2nd `onMounted` call runs | Use a plain boolean scoped to the instance (`hasRevalidated`), set synchronously, reset to `false` on every real new mount |
| `@iconify-json/fe`, `@iconify-json/grommet-icons` sitting in `devDependencies` makes `npm run build`'s prerender step fail with `Cannot find module .../icons.json` | Nitro prerender runs the already-trimmed `.output/server`, not the full dev `node_modules` — icons used via a dynamic binding (`:name="dynamic"`) fall back to `require()`-ing the raw package, which isn't in the bundle | Icon collection packages used via a dynamic binding must be in `dependencies`, not `devDependencies` |
| Adding a `nuxt.config.ts` config that looks unrelated (e.g. `colorMode:`) can change how Nitro tree-shakes, breaking a dynamic import somewhere else | Nitro's dependency tracing is more sensitive to config changes than intuition suggests | When a build breaks after an "unrelated" change, bisect with `git worktree` (checkout clean `main`, revert files one at a time, rebuild) instead of guessing |
| A build fails/flakes repeatedly even after the real root cause was already fixed | `node_modules/.cache`, `.nuxt`, `.output` can go stale after many back-to-back dev/build cycles in the same session | `rm -rf node_modules/.cache .nuxt .output` then rebuild before concluding "the fix is wrong" — this cache is gitignored, doesn't exist in a clean CI/prod build |
| `npm run lint` crashes outright with `TypeError: Object.groupBy is not a function` (thrown inside `eslint-flat-config-utils`) | `Object.groupBy` isn't available before Node 21; the shell's active Node on this dev machine can default to `v20.18.0` (older than what `eslint-flat-config-utils@3.2.0`, the exact locked `package-lock.json` version, needs) — reproduces identically on a clean `main`, not caused by any real code change | `nvm install --lts` (or any Node ≥21) then `nvm use <that version>` for the `npm run lint` invocation specifically; doesn't require changing the shell's default alias. `npm run build` is unaffected (works fine on `v20.18.0`) |
| Renaming a tag component via regex (e.g. `Post` → `ThemePost`) with raw text substitution breaks TS type imports (`import type { Post }`) | The component name and the TS type name share the same text | Anchor the regex to `<Tag`/`</Tag`, don't replace bare words |
| Right after `rm -rf node_modules/.cache .nuxt .output`, the FIRST `npm run build` can fail prerendering `/contact` with `Cannot find module '@iconify-json/.../icons.json'` even though the package is correctly in `dependencies` | Module warm-up: prerender runs before Nitro finishes resolving the icon package for the first time after the cache wipe — not a real regression | Run `npm run build` a 2nd time (no changes) before suspecting the code — only if the 2nd run fails identically is it a real bug worth investigating further |
| Merging two feature PRs that both got SEALED around the same time conflicts inside `haven/diagrams/dev-loop.prime-mermaid.md`'s PM status table — both branches append their new node's row at the same spot (end of the table) | Each implementer pass only sees its own branch's diagram state when appending a row; git can't 3-way-merge two insertions at the identical location | Resolve by keeping BOTH rows (never drop one — `LAI-13`), ordered chronologically by date; re-run build+lint after resolving since the conflict can also touch a shared code file (e.g. both PRs edited the same `.vue`) even when that file auto-merges cleanly |

## Decisions, with reasoning
> A decision recorded without its reason will get "cleaned up" by some
> future agent — the what is already in the code, only the why is
> load-bearing.

| Date | Decision | Why | Alternative rejected |
|---|---|---|---|
| 2026-08-11 | ALL page-content markup (not just the 8 chrome primitives) counts as "theme", moved entirely into `themes/portfolio-dev/` | User explicitly chose the broad scope: "the entire presentational markup" | Only splitting out the 8 chrome primitives, keeping page-content in the root `components/` |
| 2026-08-11 | Theme splits `pages/` (per-route content) vs `components/` (reusable chrome) | User wanted the two kinds visually distinguishable for easier navigation | Keeping one shared `components/` folder for both kinds |
| 2026-08-13 | Light/Dark mode defaults to **dark** | Matches the current look, doesn't change the experience for existing users until they opt into light | Defaulting to light |
| 2026-08-13 | Theme mode persistence via `localStorage`, not a cookie | Simpler, accepted tradeoff | Cookie-based SSR-safe (no dark flash on reload) — not done, may revisit if reported as annoying |
| 2026-08-13 | `@iconify-json/fe`/`@iconify-json/grommet-icons` moved from `devDependencies` to `dependencies` | The real fix for the prerender error (see Traps) | None — this is the standard fix for this class of `@nuxt/icon` error |
| 2026-08-16 | Replaced the `agent-hub/histories/` + `.claude/commands/{start-work,finish-work,merge-work,ship}.md` convention with agent-hub doctrine/haven/evidence + implementer/verifier | User wanted stricter independent verification discipline (the builder can't self-report done), mandatory evidence instead of a free-form work-log | Keeping the old system running in parallel — rejected, chose a full replacement instead |
| 2026-08-16 | Dracula only applies to `<ThemePanel>` (file-tree + editor), NOT the whole site; rides on the existing dark/light toggle (Dracula when dark, a derived Dracula-light palette when light) instead of adding a 3rd mode/toggle | User confirmed via AskUserQuestion + clarified further ("dracula follows dark, add another theme that follows light") — narrower scope than the "add a Dracula mode" example already written in root `CLAUDE.md` | Adding Dracula as a 3rd site-wide mode (cycling dark→light→dracula) — user chose the narrower scope, editor only |
| 2026-08-30 | `feature/*` branches may now be deleted after merge, same as `bug/*` — the old "`feature/*` kept forever" convention is retired | User asked to clean up 13 old fully-merged `feature/*` branches cluttering the remote; confirmed via AskUserQuestion to change the convention permanently rather than a one-off exception, so future merges don't keep re-accumulating branches that need manual cleanup later | A one-off exception (delete just this batch, keep the old never-delete rule for future merges) — user picked the permanent change instead |

## Legacy reference
`agent-hub/histories/2026-08-11.md` and `2026-08-13.md` — detailed
narrative work-log from before this hub existed, kept as-is. Every durable
trap/decision in them has been distilled into the two tables above; read
the original files if you need the full narrative (e.g.: the `git
worktree`-based bisect process, the step-by-step CDP verification).
