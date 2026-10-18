# 2026-10-18 - vim-key-nav-hint (implementer diff)

- Worker: implementer · Version: 0.1.0
- Node: `vim-key-nav-hint` (IN_PROGRESS)
- Issue: #236 (follow-up) · Branch: `feature/236`
- Task (verbatim): "hãy show gì đó lên UI để user biết là có feature này"
- Status: **sealed_pending_verifier**

## Hub bytes before
150789 (see `vim-key-nav-hint-plan.md`)

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/components/KeyNav.vue` | `isHelpOpen` changes from `ref(false)` to `defineModel<boolean>({ default: false })`, so the parent and the `?` key toggle one shared state. The rest of the logic is unchanged |
| `themes/portfolio-dev/layout/Header.vue` | Adds `const isKeyHelpOpen = ref(false)` and a new `hidden lg:flex` button before the locale button: `<kbd>?</kbd>` with `aria-label=t('keyNav.title')` and `title="<title> (?)"`, and `@click` opens the overlay. Changes `<ThemeKeyNav />` to `<ThemeKeyNav v-model="isKeyHelpOpen" />`. The button classes copy the existing header buttons, and `kbd` copies the overlay's `kbd` style |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New `vim-key-nav-hint` row appended at the end of the table (`AppendOnly`) |

There's no new i18n key; `keyNav.title` is reused.

## Command
Node v24.19.0, repo root: `npm run build` · `npm run lint` · `npx nuxi typecheck`

## Output
- `build exit 0` and `└  ✨ Build complete!`
- `lint exit 0`: the output is only `> eslint .`, with no problems listed
- `tc exit 0` and `grep -c "error TS"` returns `0`

## Browser verification
Script `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/hint.cjs`. It runs the production build (`PORT=3457 node .output/server/index.mjs`) in a clean headless Chrome; see PROJECT.md's Vimium trap for why. Verbatim output:
```
desktop vi button {"visible":true,"aria":"Phím tắt","title":"Phím tắt (?)","text":"?"}
click -> dialog open true
Esc -> dialog open false
? key -> dialog open true
? key again -> dialog open false
click after key toggles -> dialog open true
en aria Keyboard shortcuts
html class light
mobile 375 button visible false
```
Screenshots: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/hint-header-dark.png` (vi, dark) and `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/hint-header-light.png` (en, light). In both, the orange `?` kbd sits between `_contact` and the locale button, and the rest of the header looks unchanged.

## Acceptance
| Criterion | Evidence |
|---|---|
| Visible `?` button, lg+ only, localized label | `desktop vi button {"visible":true,"aria":"Phím tắt",...}`, `en aria Keyboard shortcuts`, `mobile 375 button visible false` |
| Opens the same overlay as the `?` key | `click -> dialog open true`; the `?` key and the click share state (`click after key toggles -> dialog open true`) |
| Header otherwise unchanged; light+dark | Both screenshots |
| build+lint+typecheck clean | Output above |
| comments per code-comments.md | One `//` WHY line added above `defineModel` in `KeyNav.vue`. No other comments touched |

## Noticed, not done
- Touch devices (below lg) get no hint. That's on purpose, since they have no keyboard for these shortcuts.

## Seal gate
None. No commit or push.
