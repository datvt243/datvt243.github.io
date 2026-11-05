# 2026-11-05 - hero-download-shortcut-D (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `hero-download-shortcut-D` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #396 "Resume hero: change download CV shortcut from d to D". Branch `feature/396` off `staging` 42e6842 (created with `gh issue develop`), via `/todo #396`.
- Status: `sealed_pending_verifier`

## Hub bytes before
81194 (measured before the node row was appended)

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | Download button `data-shortcut="d"` → `"D"`; its `<ThemeKbd>` badge `d` → `D` |
| `.claude/rules/theme.md` | Existing-shortcuts list: `` `d` download CV `` → `` `D` (Shift+d) download CV `` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

No KeyNav change: it matches `e.key` exactly (like `G`), and the `?` overlay is built from `data-shortcut` at open time. No comment added or changed.

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (repo root, from `doctrine/MEMORY.md`)

## Output
```
npm run build → build=0, ◆ ✨ Build complete in 1m 14s!
  WARN: components-*.js (369:0): A comment "/* @__NO_SIDE_EFFECTS__ */" … (pre-existing, same as ats-pdf-address-label-diff.md)
npm run lint → lint=0
npx nuxi typecheck → typecheck=0 ts_errors=0
npm test → Test Files  8 passed (8) / Tests  20 passed (20)
```

## UI check
Prod build + `node .output/server/index.mjs` on :3497, `NODE_API` and `NUXT_PUBLIC_NODE_API` = local mock :4599 (saved `/api/me` vi/en fixtures), set at build and at run. `grep -c onrender server.log` → `0`.
- SSR HTML `data-shortcut` values: `c`, `D`, `1`, `2`, `3`, `4` (no lowercase `d`).
- Playwright tab selected, `visibilityState: "visible"`. A capture-phase click listener on `[data-shortcut="D"]` recorded clicks and blocked the real PDF call. Badge text: `"D"`.
  - `keyboard.press('d')` → clicks `[]`
  - `keyboard.press('Shift+D')` → clicks `["download"]`
- `?` overlay ("Trên trang này" section): `Liên hệ c`, `Tải CV D`, `experiences.pug 1` … `languages.json 4`. The overlay was opened with a dispatched `keydown {key:'?'}`: Playwright's `press('?')`/`Shift+Slash` didn't produce `e.key === '?'` in this harness. That's a test-harness quirk unrelated to this diff, since `?` handling wasn't touched.

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) Button `data-shortcut="D"`, badge shows `D` | Diff above; SSR HTML has `data-shortcut="D"`; badge text `"D"` |
| (2) `D` on `/` downloads the CV; `d` no longer does | `press('d')` → `[]`; `press('Shift+D')` → `["download"]` |
| (3) `?` overlay lists `D` for download | Overlay row `Tải CV D` |
| (4) `.claude/rules/theme.md` list updated | Diff line 77 |
| build+lint+typecheck+test clean | `build=0`, `lint=0`, `typecheck=0 ts_errors=0`, `Tests  20 passed (20)` |
| Comments per code-comments.md | No comment added or changed |

## Supersedes
none (no other not-yet-SEALED row cites #396)

## Still open
none

## Noticed, not done
- The issue says `d` should page down, but KeyNav has no `d` motion. Page-down on `d` comes from Vimium-style extensions, not the site. That matches the issue's Summary, so this diff only frees the key.

## Seal gate
none (no commit/push in this pass)
