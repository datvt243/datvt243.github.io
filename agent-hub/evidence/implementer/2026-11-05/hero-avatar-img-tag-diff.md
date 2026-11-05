# 2026-11-05 - hero-avatar-img-tag (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `hero-avatar-img-tag` (row right after `hero-intro-full-avatar-128`)
- Task: operator: "phần Avatar có thể trình bày theo kiểu ảnh nằm trong thẻ <img src=... /> không ?". The operator picked "Thẻ bọc ảnh" from 3 previews via AskUserQuestion. Branch `feature/385`.
- Status: `sealed_pending_verifier`

## Hub bytes before
79733 (measured before the node row was inserted)

## Diff
| File | Change |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | Replaced `<ThemeCornerFrame class="hidden sm:block shrink-0">…</ThemeCornerFrame>` with `<div class="hidden sm:block shrink-0 text-sm leading-6">` holding: an `aria-hidden` line `<img src="Avatar.png"` (punct/tag/key/punct/string tokens), an `aria-hidden` `pl-[5ch]` line `alt="{{ hero.fullName }}"` (string span `:lang="resumeContentLang"`), the unchanged 128px `NuxtImg` plus `ml-[2ch] my-1.5`, and an `aria-hidden` `/>` line. One new WHY comment above it. |
| `themes/portfolio-dev/components/CornerFrame.vue` | Deleted (`git rm`); it had no other user |
| `nuxt.config.ts:12` | Removed `CornerFrame` from the doc comment's component list |
| `.claude/rules/theme.md:27-28` | Removed `CornerFrame` from the primitives list |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Inserted the node row |

- **Bug caught mid-pass:** the first version put the `img` and `src` spans on separate lines. Vue's whitespace `condense` dropped the newline-only text node, so the page rendered `<imgsrc="Avatar.png"`. Fixed by putting them on one line separated by a space. The verbatim before/after is below.
- Post-edit `grep -rn CornerFrame` (excluding node_modules/.nuxt/.output/agent-hub) gave `grep_exit=1`, i.e. no matches.

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test`, from the repo root.

## Output
```
build=0   (only WARN: pre-existing components-*.js "A comment")
lint=0
typecheck=0 ts_errors=0
test=0    Test Files  8 passed (8) /      Tests  20 passed (20)
```

## UI
Measured on the operator's `nuxt dev` at `localhost:3000/en`, with real data, after HMR.

**1440×900, first render (before the whitespace fix):**
```
codeText ["<imgsrc=\"Avatar.png\"", "alt=\"Võ Tấn Đạt\"", "[img 128]", "/>"]   ← bug
ariaHidden 3
tokenColors punct:rgb(100,116,139) tag:rgb(244,114,182) key:rgb(147,197,253) punct:rgb(100,116,139) string:rgb(253,186,116)
block x240 w179 h212 · img 128×128 · h1 x443 1 line · posLines 1 · hero h679 · overflowX false
```

**After the fix:**
```
first: "<img src=\"Avatar.png\""
overflowX false
```
- Screenshot at 1440 (scratchpad `hero-img-tag.png`):
  - The block reads `<img src="Avatar.png"` / `alt="Võ Tấn Đạt"` above the photo, then `/>` below it.
  - The greeting and name sit beside it, and the title stays on 1 line.
  - The personal-info panel starts at about y780, inside the fold.

**375×812:**
```
avatarBlockShown false · overflowX false
introBold ["SPAs","JavaScript/TypeScript","Vue.js","SAPUI5"]
```
- The real intro now contains `<strong>`, so #385's bold path is confirmed on live data.
- The viewport was restored to 1440×900 afterwards.

**Not checked:** light mode (the token colors come from the theme's light.css, unverified), the VI locale, and a prod build.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 tag lines plus tokens plus aria-hidden | After-fix `first`, `codeText` lines 2-4, tokenColors, ariaHidden 3, screenshot |
| 2 CornerFrame gone, 0 refs | Diff table plus `grep_exit=1` |
| 3 1440 single-line name/title, no overflow; 375 hidden, no overflow | 1440 block plus 375 block |
| 4 checks | Output block |
| comments per code-comments.md | One new template comment (WHY: decorative code text matching the editor theme). The existing layout comment was kept. No `(#N)`. |

## Supersedes: none
## Still open: none

## Noticed, not done
- Hero height went up from 621 to 679px, because the tag lines add about 58px. The panel is still inside the 900px fold.
- `src="Avatar.png"` is display text, hardcoded to match the real file name. It does not follow the `NuxtImg` src if that file is ever renamed.

## Seal gate
none
