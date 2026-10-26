# doctrine/domains/PROJECT.md ★ — ground truth of datvt243.github.io

## What is it
Personal portfolio & blog of Võ Tấn Đạt (datvt243). Nuxt 4 SSR app with ISR
caching, running in real production (not a demo). Full details on the
stack/routes/theme system live in the root `CLAUDE.md` — this file only
records what CANNOT be inferred from reading the code, and doesn't repeat
the root `CLAUDE.md`'s content.

## Stack + shape
| Thing | Value |
|---|---|
| Language/runtime | TypeScript, Nuxt 4 / Vue 3 SSR |
| Entry point | `app.vue` (chrome) + `pages/*.vue` (thin loaders, each file renders exactly one `Theme*` component) |
| Data store | No DB — all data comes from external APIs (resume Node API, blog API, GitHub API) |
| Theme system | `themes/<name>/` swappable via `ACTIVE_THEME` in `nuxt.config.ts` — see `.claude/rules/theme.md` (path-scoped, moved out of root `CLAUDE.md`) |

## Invariants (things that never happen here)
- **Never push directly to `main` or `staging`** — both are real
  GitHub-protected branches as of 2026-08-30 (`enforce_admins: true`, PR
  required, 0 required approvals so `/ship --merge`/`/todo`/`/release` can
  still self-merge without a second reviewer) — confirmed by real rejected
  test pushes on both (`GH006: Protected branch update failed`).
- **`staging` is the integration branch, `main` is production.** All
  `bug/<issue_number>`/`feature/<issue_number>` branches branch off
  `staging` (not `main`) and PR back into `staging`. `main` ONLY ever
  receives code from `staging`, via `/release` or a manual
  `staging`→`main` PR — never directly from a `bug/*`/`feature/*` branch.
  (As of 2026-08-30 — see Decisions table below.)
- **`bug/*` and `feature/*` branches may both be deleted after merging**
  (as of 2026-08-30 — operator explicitly changed this from the old
  `feature/*`-never-deleted convention, see Decisions table below).
- **Unit tests are narrow** — `npm test` (Vitest) covers a few pure
  functions only. "Verified" means `npm run build` + `npm run lint` +
  `npx nuxi typecheck` + `npm test` clean + a real UI check (see the
  Browser verification section). "Tests pass" never stands in for that.
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

## Archiving convention
> Older Traps/Decisions rows move to `doctrine/domains/PROJECT-archive.md`
> once this file crosses the 15KB threshold (checked by `/hub-tokens`, same
> threshold/mechanism as `haven/diagrams/dev-loop.prime-mermaid.md` uses
> for its PM status table) — every worker session reads this file in full.
> Nothing deleted: the archive keeps each row's full original text
> verbatim. When it fires, archive rows older than the current work
> session first, keep recent ones inline for context.

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
| `npm install <pkg>@<newer-version>` fails outright with `TypeError: Cannot read properties of null (reading 'edgesOut')`, thrown inside `@npmcli/arborist/lib/arborist/build-ideal-tree.js` | An internal bug in npm `10.8.2` (bundled with Node 20, the shell's default) resolving a newer peer-dependency set — hit bumping `nuxt` to `3.21.11`, which pulls in a newer `@vitejs/devtools-*` peer chain than the installed lockfile had | Run the install under Node ≥24/npm ≥11 instead (`nvm use 24`, already required for `npm run lint` per the `Object.groupBy` trap above) — same workaround, one more reason to default to it for any dependency-version-bump work, not just lint |
| Merging two feature PRs that both got SEALED around the same time conflicts inside `haven/diagrams/dev-loop.prime-mermaid.md`'s PM status table — both branches append their new node's row at the same spot (end of the table) | Each implementer pass only sees its own branch's diagram state when appending a row; git can't 3-way-merge two insertions at the identical location | Resolve by keeping BOTH rows (never drop one — `LAI-13`), ordered chronologically by date; re-run build+lint after resolving since the conflict can also touch a shared code file (e.g. both PRs edited the same `.vue`) even when that file auto-merges cleanly |
| Keyboard-shortcut UI checks via the shared `:9888` debug Chrome see no `keydown` at all: CDP-typed keys never reach the page's listeners, while synthetic `dispatchEvent` keydowns work | `$HOME/.chrome-debug-profile` has extensions installed, including Vimium C (`hfjbmagddngcpeloejdejnfgbamkjaeg`), which swallows vim-style keys (`j`/`k`/`g`/`?`) before the page sees them and also causes extra main-frame navigations that detach puppeteer frames | For any keyboard-input check, `puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, userDataDir: <fresh temp dir> })` (no extensions) instead of `connect`-ing to `:9888` — or stay on `:9888` but open an incognito context (`(await puppeteer.connect(...)).createBrowserContext()`), where Vimium C isn't allowed (its `Secure Preferences` entry has no `incognito: true`) |
| `puppeteer-core` bumped on its own (e.g. a blanket `^` range or `npm audit fix`) silently desyncs from `@sparticuz/chromium` — each puppeteer **minor** targets a different Chrome major (25.10 → Chrome 152, 25.11 → 153, 25.12 → 154), and `@sparticuz/chromium`'s major IS the Chrome major it ships on Vercel | Before #260 the repo paired `puppeteer-core@23.8.0` (Chrome 131) with `@sparticuz/chromium@153` — 22 majors apart; it worked by luck of CDP compatibility, not by design | Keep `puppeteer-core` pinned with `~` to the minor whose `lib/puppeteer/revisions.js` `chrome:` major equals `@sparticuz/chromium`'s major; bump both together, never one alone (sparticuz README: pick the chromium version matching puppeteer's supported Chrome) |
| `@nuxt/schema` devDependency pinned `~3.21.11` (= the installed `nuxt`) looks like dead weight | `@nuxt/ui@3` depends on `@nuxt/schema@4` directly; without the pin npm hoists 4.x to the root, Nuxt 3's generated `.nuxt/tsconfig.json` maps `@nuxt/schema` there, and `nuxi typecheck` fails on `nuxt.config.ts`'s `$development.nitro.storage` (schema 4's nitro type falls back to a minimal shape without a Nuxt-4 server builder) — found in #262 | Resolved in #263: on Nuxt 4 every module dedupes to one `@nuxt/schema@4.x`, pin dropped. If a future module drags in a mismatched schema major again, pin it to the installed `nuxt`. |

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
| 2026-08-16 | Dracula only applies to `<ThemePanel>` (file-tree + editor), NOT the whole site; rides on the existing dark/light toggle (Dracula when dark, a derived Dracula-light palette when light) instead of adding a 3rd mode/toggle | User confirmed via AskUserQuestion + clarified further ("dracula follows dark, add another theme that follows light") — narrower scope than the "add a Dracula mode" example already written in root `CLAUDE.md` | Adding Dracula as a 3rd site-wide mode (cycling dark→light→dracula) — user chose the narrower scope, editor only |
| 2026-08-30 | `feature/*` branches may now be deleted after merge, same as `bug/*` — the old "`feature/*` kept forever" convention is retired | User asked to clean up 13 old fully-merged `feature/*` branches cluttering the remote; confirmed via AskUserQuestion to change the convention permanently rather than a one-off exception, so future merges don't keep re-accumulating branches that need manual cleanup later | A one-off exception (delete just this batch, keep the old never-delete rule for future merges) — user picked the permanent change instead |
| 2026-08-30 | `main` protected via real GitHub branch protection (`enforce_admins: true`, PR required, 0 required approvals) | User asked to make "never push directly to `main`" actually enforced, not just a written convention agents could forget/skip. Confirmed via AskUserQuestion to leave required approvals at 0 rather than ≥1, specifically because GitHub disallows a PR author approving their own PR — requiring ≥1 would have blocked `/ship --merge`/`/todo`'s self-merge (same GitHub account opens and merges the PR), breaking the exact automation this session built | Requiring ≥1 approval — rejected because it would silently break `/ship --merge`/`/todo`'s self-merge automation with no second reviewer account available |
| 2026-08-30 | New `staging` branch off `main`, same branch protection as `main`. All `bug/*`/`feature/*` work now branches off `staging` (not `main`); `main` only receives code from `staging`, via a new `/release` command | User wanted a real integration branch separating in-progress work from production, so `main` always reflects what was actually released, not whatever was last merged | Keeping the single-branch `main`-only model — rejected, user explicitly asked for `staging` |
| 2026-08-30 | `/release` merges `staging`→`main` via a regular merge (not squash) so `main` keeps staging's individual commit history, tags `vX.Y.Z` (semver, starting `1.0.0`), attempts a `DEPLOY_HOOK_URL` webhook and skips with a clear message if unset, then syncs the version bump back to `staging` | User confirmed via AskUserQuestion: semver over date-based tags, and "skip + placeholder" over configuring a real deploy target on the spot (none exists yet — no CI/CD, no deploy config found in the repo) | Date-based tags (`v2026.08.30`) — rejected in favor of semver; blocking `/release` until a real deploy target is configured — rejected, deploy is optional/best-effort for now |
| 2026-10-26 | Added Vitest (`npm test`, `tests/`) for 3 pure units (skill grouping, `fetchResume` field whitelist + no-retry, `ResumeAdapter`), and `npx nuxi typecheck` + `npm test` to CI; plain Vitest with `@`/`~` aliases, no `@nuxt/test-utils` | #300 (operator chose "Typecheck CI + Vitest"): two P0 bugs (#281 skills groups vanished, #280 PII fields leaked) were logic a 10-line test catches; build/lint can't. Kept to pure functions so tests need no Nuxt runtime; Nitro globals are stubbed per test. Not a substitute for browser verification | `@nuxt/test-utils` (Nuxt runtime in tests): heavier and slower, not needed for pure functions. Component/e2e suite: out of proportion for a one-person portfolio |

## Legacy reference
`agent-hub/histories/2026-08-11.md` and `2026-08-13.md` — detailed
narrative work-log from before this hub existed, kept as-is. Every durable
trap/decision in them has been distilled into the two tables above; read
the original files if you need the full narrative (e.g.: the `git
worktree`-based bisect process, the step-by-step CDP verification).
