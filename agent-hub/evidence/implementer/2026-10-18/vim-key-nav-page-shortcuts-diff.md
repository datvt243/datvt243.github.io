# 2026-10-18 - vim-key-nav-page-shortcuts (implementer diff)

- Worker: implementer · Version: 0.1.0
- Node: `vim-key-nav-page-shortcuts` (IN_PROGRESS)
- Issue: #236 (follow-up) · Branch: `feature/236`
- Task (verbatim): "bổ sung cho nút Contact, Download. phần persional-info (5 mục). đồng nhất lại màu sắc". Mid-task operator add-on: "sau khi xong, mở lại ẩn danh để chắc là extenison vim ko chạy, kiểm tra lại toàn bộ nav"
- Status: **sealed_pending_verifier**

## Hub bytes before
152152 (see plan)

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/components/Kbd.vue` (new, `<ThemeKbd>`) | The one shortcut badge: `<kbd class="rounded border border-theme-border font-theme-mono text-theme-kbd"><slot /></kbd>`. Callers add size classes |
| `themes/portfolio-dev/settings-colors-theme/{dark,light}.css` | New `--theme-kbd`, the same triplet as that mode's `--theme-accent` (`251 146 60` / `234 88 12`). `editor-dracula.css` doesn't override it |
| `tailwind.config.js` | `kbd: themeColor('--theme-kbd')` added next to the accent colors |
| `themes/portfolio-dev/components/KeyNav.vue` | `visibleShortcuts()` collects `[data-shortcut]` elements with `getClientRects().length > 0`. A new final `else` branch in `onKeydown` finds the matching one and calls `focus()` then `click()`; it runs after all the existing guards and global bindings. A `watch(isHelpOpen)` snapshots `pageShortcuts` each time the overlay opens, and the overlay gets an "On this page" section (`v-if`). Every `<kbd>` becomes `<ThemeKbd>` |
| `themes/portfolio-dev/layout/Header.vue` | Tab badges and the `?` button use `<ThemeKbd>` (tab badges were `text-theme-faint` and are now the shared orange) |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | Contact `<a>` gets `data-shortcut="c"`, Download `<button>` gets `data-shortcut="d"`, each with `:data-shortcut-label` (i18n text) and a `<ThemeKbd aria-hidden>` badge |
| `themes/portfolio-dev/pages/resumeObject/Index.vue` | The `sections` loop takes an index; each `ThemeNavItem` gets `:data-shortcut="String(i + 1)"` and `:data-shortcut-label="s.label"` (they fall through to NavItem's root `<button>`), plus a right-aligned `<ThemeKbd aria-hidden>` |
| `i18n/locales/{en,vi}.json` | `keyNav.onThisPage` |
| `agent-hub/doctrine/domains/PROJECT.md` | Extended this session's own Vimium Trap row: an incognito context on `:9888` is a second way to test keys |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New row appended at the end (`AppendOnly`) |

## Command
Node v24.19.0, repo root: `npm run build` · `npm run lint` · `npx nuxi typecheck`

## Output
- `build exit 0` and `└  ✨ Build complete!`
- `lint exit 0`: the output is only `> nuxt-app@1.2.9 lint` / `> eslint .`, with no problems listed
- `tc exit 0`, and `grep -c "error TS"` returns `0`

## Browser verification
Run as the operator asked: in an **incognito** context (`browser.createBrowserContext()`) of the `:9888` debug Chrome. The debug profile's `Secure Preferences` show Vimium C (`hfjbmagddngcpeloejdejnfgbamkjaeg`) with `incognito= None`, so it isn't allowed in incognito. Check 0 below proves keys reach the page. Production build on `:3457`. Script `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/incognito/fullnav.cjs`.

The first run had 5 FAILs and then crashed. Both were bugs in the test script, not the product:
- The "filetab" lookup matched the wrong element (`search _contact.ts`), even though `focused=` was already correct every time.
- The request listener was still attached after interception was turned off (`Request Interception is not enabled!`).

After fixing the script, the full output, verbatim:
```
PASS  keydown reaches page in incognito
PASS  j scrolls down 80  scrollY=80
PASS  k scrolls back up
PASS  G to bottom  2200/2200
PASS  gg to top
PASS  Alt+j ignored
PASS  gp -> /projects  /projects
PASS  gh -> /github  /github
PASS  gb -> /blogs  /blogs
PASS  gc -> /contact  /contact
PASS  gr -> /  /
PASS  /en gp -> /en/projects  /en/projects
PASS  5 selects languages.json  focused=languages.json active=languages.json
PASS  4 selects educations.json  focused=educations.json active=educations.json
PASS  3 selects experiences.pug  focused=experiences.pug active=experiences.pug
PASS  2 selects skills.ts  focused=skills.ts active=skills.ts
PASS  1 selects about-me.md  focused=about-me.md active=about-me.md
PASS  c triggers Contact mailto  mailto:votan.it@gmail.com
PASS  c did not navigate
PASS  d triggers Download CV request  http://localhost:3457/api/generate-pdf?lang=vi
PASS  typing in input: no shortcut
PASS  ? opens overlay
PASS  overlay lists 10 global + 7 page shortcuts on /  17: Liên hệ c | Tải CV d | about-me.md 1 | skills.ts 2 | experiences.pug 3 | educations.json 4 | languages.json 5
PASS  Esc closes overlay
PASS  header ? button opens overlay
PASS  ? closes it again
PASS  no page section on /projects  10
PASS  dark: all visible kbd one color = --theme-kbd 251,146,60  ["rgb(251, 146, 60)"]
PASS  light: all visible kbd one color = --theme-kbd 234,88,12  ["rgb(234, 88, 12)"]

ALL PASS
```
Notes on how the checks work:
- The mailto click is intercepted with `preventDefault`, so no mail client opens.
- The `generate-pdf` request is aborted, which proves `d` fired it without generating a PDF.
- The color checks open the overlay first, so the header, hero, file-tree (Dracula `editor-scope`) and overlay badges are all counted in the single-color set.

Screenshots in `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/incognito/`:
- `home-dark.png`: orange badges on the tabs, `?`, `Liên hệ c`, `Tải CV d` and file tree `1`–`5` inside the Dracula panel.
- `overlay-home-light.png`: the "Trên trang này" section listing c, d and 1–5.
- `overlay-home-dark.png` and `home-light.png`.

## Acceptance
| Criterion | Evidence |
|---|---|
| `c` contact, `d` download, `1`–`5` file tree | The PASS lines for c, d and 1–5 |
| Key badges shown | Screenshots |
| Overlay lists page shortcuts | `17: Liên hệ c \| … \| languages.json 5`; `no page section on /projects  10` |
| Same guards | `typing in input: no shortcut` (input value `3gp`); `Alt+j ignored`; the else branch only runs after the existing guard and `isHelpOpen` returns |
| One component, one orange, incl. Dracula panel, light+dark | Both single-color PASS lines; `grep -rn "<kbd" themes/` finds only `Kbd.vue` |
| build+lint+typecheck clean | Output above |
| Full nav re-check in incognito (operator add-on) | All 29 PASS above |
| comments per code-comments.md | Added: the `Kbd.vue` overview JSDoc (WHY: Dracula repaints accent; plus the existing `@author`/`@see` header), a `/** */` on `visibleShortcuts` (WHY: markup-declared, so there's no registry), a `//` on `focus()` then `click()` (WHY: scroll into view; disabled is a no-op), and a `/* */` on each `--theme-kbd` token line (WHY it isn't just accent), matching the existing per-token comment style. Nothing else touched |

## Noticed, not done
- `AboutMe.vue` has its own markdown "download CV" link inside the about-me pane. I didn't give it a shortcut, because `d` already covers the hero button.
- `1`–`5` only work where the file tree is visible (`getClientRects`). On narrow screens where the sidebar is hidden they do nothing, by design.

## Seal gate
None. No commit or push.
