# 2026-10-25 - deps-nuxt-ui-3-tw4 (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `deps-nuxt-ui-3-tw4` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row, `IN_PROGRESS` → `SEALED`)
- Notes graded: `evidence/implementer/2026-10-25/deps-nuxt-ui-3-tw4-{plan,diff}.md`, including `## Rework 1` and `## Rework 2`. Previous verdicts: `evidence/verifier/2026-10-25/deps-nuxt-ui-3-tw4-reopen.md` and `-reopen-2.md`
- Worktree: `scratchpad/wt-262` (branch `feature/262`, uncommitted vs `staging` @ `7ec2b12`). Baseline: `scratchpad/wt-base` on :4084
- Verdict: **SEAL**

## Isolation proof
This is a separately spawned verifier subagent for the third pass. Its Agent-tool task string starts "You are the agent-hub VERIFIER for this repo … THIRD verifier pass (this is the last allowed REOPEN loop …)". The implementer's task was "Phase 3.5 — @nuxt/ui 2→3 + Tailwind 3→4". Neither earlier verifier string contained "THIRD verifier pass". All my scripts and outputs are in `scratchpad/verify-262c/`. I measured my own rebuild on my own server, :4091 (started and stopped by me), never the implementer's :4083.

## Re-run
`partial`: I rebuilt and ran build, lint and typecheck, then ran new CDP A/B scripts (`ab.cjs`, `inputring.cjs`, `font.cjs`, `trans.cjs`). I did not redo the 34-shot pixel diff, npm audit, or the `@nuxt/schema` repro, which earlier passes confirmed. Reason: this is outward-facing (a site-wide CSS-engine swap headed for production), and the operator asked for independent re-checks of Rework 2 plus a global sweep.

## Build / lint / typecheck (my run, after Rework 2)
- `npm run build` → rc=0, `└  ✨ Build complete!`. WARN lines: `nuxt/server` resolve warnings from @nuxt/image (also on staging) and the i18n `optimizeTranslationDirective` note. Nothing new.
- `npm run lint` → `eslint .`, no output, rc=0.
- `npx nuxi typecheck` → rc=0, `grep -c 'error TS'` = 0, last line `✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons`.

## (d) v2 `ui.css` claim checked against the file
`wt-base/node_modules/@nuxt/ui/dist/runtime/ui.css` (v2.22.3) is exactly:
`.dark{color-scheme:dark}a:focus-visible{@apply outline-primary}::-moz-selection{@apply bg-primary/40}::selection{@apply bg-primary/40}`.
The note's description matches. It leaves out the `::-moz-selection` duplicate, which doesn't matter: Firefox has supported unprefixed `::selection` since v62. Rework 2's `main.css` block ports the three rules into `@layer base`, with one WHY comment and no `(#N)`.

## (a) REOPEN-2 reasons: fixed (`ab.cjs` → `summary.txt`, :4084 vs :4091, 6 routes × dark/light)
| Check | Staging :4084 | Branch :4091 |
|---|---|---|
| dark: `<html>` / body `color-scheme` | `dark` / `dark` on all 6 routes | `dark` / `dark` on all 6 routes |
| dark: canvas pixel with backgrounds cleared | `18,18,18` | `18,18,18` (pass 2 measured `255,255,255` before the fix) |
| light: `<html>` / body | `normal` / `normal` | `normal` / `light` (v3 base `scheme-light` on body; canvas `255,255,255` on both) |
| html bg / body bg / body color | the same on both builds in both modes (`rgb(2,6,23)`/`rgb(255,255,255)` dark, `rgb(255,255,255)`/`rgb(15,23,42)` light). v3's base `bg-default text-default` on body is overridden, as before | |
| Link focus ring, tabbing through 25 stops on `/contact` and `/` (`rings.txt`) | `auto 1px rgb(74,222,128)` | `auto 1px oklch(0.792 0.209 151.711)` (green-400 in v4 OKLCH). Light: green-500. Every link differs only in color notation. |
| Contact `input`/`textarea` focus | 1px `rgb(189,147,249)` ring | the same 1px `rgb(189,147,249)` ring (`inputring.txt`; crops `inputfocus-*-{4084,4091}.png` look identical) |

**Fade claim (2b) is described accurately** (`trans.txt`). v3's `.transition-colors` list is `color, background-color, border-color, text-decoration-color, fill, stroke`; v4's adds `outline-color`. A header link at t0 shows `oklab(0.71 …)`, its text color, then settles at 400ms to `oklch(0.792 0.209 151.711)`, the same green as staging. Settled rings match staging, and the note calls the change an accepted v4 default, which is a fair description. One detail: box-shadow rings already faded under v3's `.transition`, so the only new part is the outline-color fade. That is wording, not a false claim.

## (b) `::selection` regression is real, and fixed
`font.cjs` walked every CSS rule loaded on :4091. The only `::selection` rules are Rework 2's port: `[base] ::selection{background-color:var(--ui-primary)}`, plus its `color-mix(… 40%, transparent)` form. ui v3 itself ships none. Before Rework 2, the branch therefore used the browser's default selection color. Staging uses v2's `::selection{background-color:rgb(var(--color-primary-DEFAULT)/.4)}`. Measured: dark `rgba(74,222,128,.4)` vs `oklab(0.792 … / 0.4)` (green-400), light `rgba(34,197,94,.4)` vs `oklab(0.723 … / 0.4)` (green-500), on all 6 routes in `p` and `a`.

## (c) Rework 2 didn't regress anything
Build, lint and typecheck are clean (above). The global computed-style sweep (`sweep.txt`) compared 22 element types × first 40 instances × 22 properties on 6 routes in both modes. Every difference falls into one of these:
- Color notation only (rgb vs oklch/oklab, same token).
- Light-mode `colorScheme normal → light` inherited from body. This renders the same on a light page, as the note explains.
- Sub-pixel line-heights (`28px → 28.0001px`), already explained in the pixel-diff table.
- `/blogs` select → button and the pagination's first/last buttons, both already explained.
- The font stack, covered under "Noticed".
`dark-1440` /contact and /nope-404 pages: pass 1 and Rework 2 both report 0% pixel diff. Rework 2 touched only `assets/css/main.css`, which is proportional.

## (e) Global sweep: what v2 provided that v3 dropped, measured
I read v2's `module.mjs` and `plugins/colors.js` in `wt-base` and v3's `module.mjs` and `runtime/index.css` in `wt-262`.
| v2 global | Branch status |
|---|---|
| `ui.css` (3 rules) | Ported; see (a) and (b). |
| `@tailwindcss/forms({strategy:'class'})` | Class strategy, so it added no global base styles. `grep` finds 0 `form-input`/`form-select`/… classes. Contact fields are measured identical (above). |
| `@tailwindcss/typography` | `grep '\bprose\b'` → 0 (the one usage was replaced in the diff). |
| `@tailwindcss/aspect-ratio`, `container-queries`, `@headlessui/tailwindcss` | `grep` for `aspect-w-`/`aspect-h-`, `@container`/`@sm:`…, `ui-open:`… → 0. |
| colors plugin: `--color-primary-*`, `--color-gray-*` on `:root`, `.dark` primary=400 | The only consumer in app code is `main.css`'s `var(--color-gray-200, currentcolor)`, which v4 defines. Primary maps to `--ui-primary`, measured as 400 in dark and 500 in light, matching v2. |
| `@nuxtjs/color-mode` `classSuffix:''` | v3 also passes `classSuffix:''`. `<html class="dark"/"light">` is measured on both builds. |
| `@nuxt/icon` | Still installed by v3. Typecheck finds 3 local collections, and pass 1 saw icons render with 0 Iconify API requests. |

## Acceptance criteria
| Criterion | Evidence |
|---|---|
| @nuxt/ui 3.3.x + tailwindcss 4.x | Diff note `npm ls` (3.3.7 / 4.3.3). My `node_modules/tailwindcss/package.json` says `4.3.3`. |
| build + lint + typecheck clean | My run, above. |
| Screenshots diffed, every diff explained | 34-shot table (pass 1 independently re-diffed it). Rework 2 reshoot: 33/34 identical, the remaining shot is the Giscus async load. All non-visual diffs found by passes 1–3 are now fixed or stated. |
| Modal, slideover, toast, select, pagination, search by real click | Diff note real-click block, independently confirmed in passes 1 and 2. |
| Dracula only inside the panel; `--theme-kbd` orange; light/dark | Diff note colors block, confirmed in pass 1. The light/dark toggle class is measured in `summary.txt`. |
| npm audit before/after | 52 → 53, delta traced (confirmed in pass 1). |
| Comments per code-comments.md | 7 listed. The new `main.css` block has one WHY comment and no `(#N)`. |
| Supersedes | `## Supersedes: none`. The only `#262` row on the active diagram is this one. |

## Forbidden states
None hit. Seal gate: there is no commit, push or PR. The `Language.vue` deletion exists only in the working tree. Diagram: updated by this SEAL, with the row archived per step 12.

## Noticed, not blocking (for the operator)
- **Default sans font stack changed** (not in the note). Tailwind 4.3's `--font-sans` is `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, …`, where v3's was `ui-sans-serif, system-ui, sans-serif`. It only affects the 11–18 non-`font-theme-mono` elements per page: the 404 page and the skip link (642 elements use Fira Code). Chromium reads `BlinkMacSystemFont` as `system-ui`, so it resolves the same on every OS, and the 404 shots show 0% diff on this Mac. Firefox on Linux could pick Roboto over the system UI font. To pin the old stack, add `--font-sans: ui-sans-serif, system-ui, sans-serif, …` to `@theme`.
- ui v3 registers color-mode with `disableTransition: true`, where v2 used the module default (false). Toggling light/dark now switches instantly instead of animating `transition-colors` elements. This is a library default.
- To trace the root cause of a suspected input-ring regression, I opened `contact/Index.vue`'s diff. The suspicion was a truncation artifact in my own script, and the full `box-shadow` shows the ring intact. No verdict depends on reading the diff.
- Housekeeping: `nuxt-color-mode` localStorage was left set on :4084 (`light`) and :4091; I cleared both (`cleanup.cjs`). I did not touch :4083.

## Not checked by me
The 34-shot pixel diff rerun, npm audit, dev-mode hydration, real PDF success toast, and a real scrollbar render on a non-overlay-scrollbar OS. The scheme and canvas proxy are measured instead.
