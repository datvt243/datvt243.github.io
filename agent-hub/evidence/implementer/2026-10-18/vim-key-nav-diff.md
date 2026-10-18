# 2026-10-18 - vim-key-nav (implementer diff)

- Worker: implementer · Version: 0.1.0
- Node: `vim-key-nav` (`haven/diagrams/dev-loop.prime-mermaid.md`, IN_PROGRESS)
- Issue: #236 · Branch: `feature/236` (off `staging`)
- Task (verbatim): "tôi muốn xây dựng tính năng áp dụng nVIM, giúp thao tác nhanh di chuyển tới các mục porfolio thay vì phải dùng chuột"
- Status: **sealed_pending_verifier**

## Hub bytes before
149019 (see `vim-key-nav-plan.md`)

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/components/KeyNav.vue` (new, tag `ThemeKeyNav`) | A window `keydown` handler and a `UModal` help overlay. `g` arms a 1s prefix: `g`+route key calls `navigateTo(localePath(link))`, and `gg` scrolls to the top. `j`/`k` scroll ±80px, `G` goes to the bottom, `?` toggles help. It bails out on Ctrl/Meta/Alt, `defaultPrevented`, or a target inside input/textarea/select/contenteditable. The listener is removed on unmount |
| `themes/portfolio-dev/layout/Header.vue` | Renders `<ThemeKeyNav />`. The header is on every page and inside the theme, so `app.vue` and its theme contract stay unchanged |
| `app.config.ts` | Adds a `key` to each `menuPrimary` entry (`r p h b c`). GitHub is `h` because `gg` means top, as in vim |
| `i18n/locales/{en,vi}.json` | New `keyNav.*` strings for the help overlay |
| `agent-hub/doctrine/MEMORY.md` | Operator-approved `Typecheck` row (`npx nuxi typecheck`), which `implement.md` step 5 needs |
| `agent-hub/doctrine/domains/PROJECT.md` | New Trap row: the `:9888` debug profile's Vimium C extension swallows vim keys (see Browser verification) |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New `vim-key-nav` row appended at the end of the PM table (`AppendOnly`) |

## Command
Node v24.19.0 (`nvm use 24`), repo root:
`npm run build` · `npm run lint` · `npx nuxi typecheck`

## Output
- build: `build exit 0` … `└  ✨ Build complete!` (only the existing `sharp binaries` and `optimizeTranslationDirective` warnings)
- lint: `lint exit 0`. The output is just `> nuxt-app@1.2.9 lint` / `> eslint .`, with 0 problems listed
- typecheck: `tc exit 0`, and `grep -c "error TS"` gives `0`

## Browser verification
Script: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/ui.cjs`, run against the production build (`PORT=3457 node .output/server/index.mjs`) in a **clean headless Chrome** (`puppeteer.launch`, fresh `userDataDir`).
- Why not `:9888`: on the shared debug profile, typed keys never fired a single `keydown` (`kd []`), while a synthetic `window.dispatchEvent(new KeyboardEvent('keydown',{key:'g'}))` followed by `'p'` reached `/projects`. That profile has Vimium C (`hfjbmagddngcpeloejdejnfgbamkjaeg`) installed, which captures vim keys. I recorded it as a new Trap.
- Why not `nuxt dev`: on `:3456` it answered `426 Upgrade Required` with a `Failed to resolve import "#app-manifest"` pre-transform error. That has nothing to do with this diff (see Noticed).

The script `document.body.style.minHeight = '3000px'` so the page always scrolls. Verbatim output:
```
j scrollY 80
j,k scrollY 80
G scrollY 2280 max 2280
gg scrollY 0
Alt+j scrollY 0
gp -> /projects
gh -> /github
gb -> /blogs
gc -> /contact
gr -> /
typing in input -> path / scrollY 0 value gpj
? dialog open true
Esc dialog open false
/en gp -> /en/projects
html class light
light dialog panel bg rgb(248, 250, 252)
? again closes true
```
- Light-mode panel `rgb(248, 250, 252)` equals `light.css` `--theme-panel: 248 250 252`.
- Screenshots: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/help-dark.png` (vi, dark: slate panel, orange `kbd` accents) and `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/help-light.png` (en, light). Both list all 10 bindings.

## Acceptance
| Criterion | Evidence |
|---|---|
| `g`+key → every route, locale-aware | `gp -> /projects` … `gr -> /`; `/en gp -> /en/projects` |
| `j`/`k`, `gg`/`G` | `j scrollY 80`, then `j,k scrollY 80` (j+j-k nets one step), `G scrollY 2280 max 2280`, `gg scrollY 0` |
| `?` help overlay, Esc closes, theme tokens, light+dark | `? dialog open true`, `Esc dialog open false`, `? again closes true`, light bg = token, both screenshots |
| Ignored in form fields / with modifiers | `typing in input -> path / scrollY 0 value gpj`; `Alt+j scrollY 0` |
| build+lint+typecheck clean, real browser | Output section above |
| comments per code-comments.md | `KeyNav.vue`: the file-overview JSDoc carries the existing `@author`/`@see` header (same as `PageHeading.vue`), plus one `//` WHY line on the modifier bail-out. No other comments touched |

## Noticed, not done
- `nuxt dev --port 3456` served `426 Upgrade Required` with a `#app-manifest` resolve error right after `npm run build` in the same tree. Possibly a stale `.nuxt` (see the existing cache Trap). Not investigated, out of scope.
- The `dev-loop.prime-mermaid.md` active diagram is about 80KB, far over the 15KB archive threshold. It needs a separate archive pass.
- Visitors who run Vimium-style extensions will find those keys taken by the extension. That's expected browser behavior and can't be fixed from the page.

## Seal gate
None. No commit, push or PR. Issue #236 and branch `feature/236` were created by `/todo` step 1 under the operator's invocation.
