# 2026-11-05 - hero-avatar-inline (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `hero-avatar-inline` (row right after `hero-about-me-intro` in `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: operator follow-up on #385.
  - Quote: "avatar đa chím vị trí quá, phần aboutme đang khá dài và jobTitle xuống dòng, hãy đánh giá lại UI giúp tôi".
  - The review offered 3 options: (1) small avatar beside the name with no right column, (2) shorten the title in the backend, (3) shorten the intro in the backend. The operator answered "hãy làm 1 trước".
  - Same branch, `feature/385`. #385 is uncommitted, so branching from `staging` would carry it along.
- Status: `sealed_pending_verifier`

## Hub bytes before
79721 (measured before the node row was inserted)

## Diff
Only `themes/portfolio-dev/pages/resumeObject/Hero.vue` changed, plus the node row in `haven/diagrams/dev-loop.prime-mermaid.md`.

| Change | Detail |
|---|---|
| Root | `grid gap-10 lg:grid-cols-[1fr_auto] items-center py-10 font-theme-mono` → `py-10 font-theme-mono` |
| Avatar column | Removed: the `hidden lg:block` → `ThemeCornerFrame` → `NuxtImg 240×240` block |
| Name row | Greeting and `h1` are wrapped in `<div class="flex items-center gap-6">`, with `ThemeCornerFrame class="hidden sm:block shrink-0"` → `NuxtImg Avatar.png 104×104 rounded-lg` placed before them |
| Comment | One HTML comment (WHY: avatar beside the name so title and intro get the full width) |
| Intro | `max-w-[65ch]` → `max-w-[90ch]` |

- `ThemeCornerFrame` is still used, now only here: its only caller was this file, per `grep -rn ThemeCornerFrame`.
- The frame's `p-3` is not overridden.

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test`, from the repo root.

## Output
```
build=0   (only WARN: the pre-existing components-*.js "A comment" one)
lint=0
typecheck=0 ts_errors=0
test=0    Test Files  8 passed (8) /      Tests  20 passed (20)
```

## UI
Measured on the operator's `nuxt dev` at `localhost:3000/en`, at the operator's earlier request ("hãy test ở đây"), with real backend data.
- The change arrived by HMR. There was no page reload, so no extra backend page load.
- Lines are counted as `getBoundingClientRect().height / lineHeight`.

**Before** (same tab, 1440×900, earlier this session):
```
grid w960 h754 · leftCol w654 · avatarCol w266 (+40 gap) · position w654 h64 positionLines 2 · intro w560 h228 (10 lines)
hero bottom ≈ y840 → personal-info panel below the 900px fold (screenshot hero-dev.png)
```
**After:**
```
1440x900 visible: hero w960 h642 · frame 130×130 at x240 (img 104×104) · h1 x394 w454 1 line
             position w960 h32 positionLines 1 · intro w775 h182 introLines 8
             experiences.pug sidebar item at y789 (inside the fold) · overflowX false
1280x800: avatarShown true · h1Lines 1 · posLines 1 · introLines 8 · heroH 642 · overflowX false
 640x900: avatarShown true · h1Lines 1 · posLines 2 · introLines 10 · overflowX false
 375x812: avatarShown false · h1Lines 1 · posLines 3 · introLines 18 · overflowX false
```
- Screenshots are in the scratchpad: `hero-avatar-1440.png` (avatar framed left of greeting and name, title on one line, panel visible) and `hero-avatar-375.png` (same mobile layout as before, avatar hidden).
- The browser viewport was restored to 1440×900 afterwards.
- Not checked: light mode, the VI locale (layout only, no text change), and a prod build.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 no right column, avatar ≤128px beside the name, full width | 1440 row: hero w960, img 104×104 (frame 130 incl. p-3 + border), h1 at x394 beside it, position/intro start x240 |
| 2 title 1 line at 1440, intro < 10 lines | posLines 1, introLines 8 (was 2 / 10) |
| 3 375: no overflow, avatar hidden; 640: name 1 line | 375 row overflowX false, avatarShown false; 640 row h1Lines 1 |
| 4 checks | Output block |
| comments per code-comments.md | One template comment, WHY only, no `(#N)` |

## Supersedes: none
## Still open: none

## Noticed, not done
- On mobile (375px) the title takes 3 lines and the intro 18. That is #385's intro plus the backend's long `positionDesired`, and it is unchanged by this node. The fix is options 2 and 3 (shorter backend content), the operator's call.
- At 1440 the title fills about 945 of 960px. A slightly longer `positionDesired` wraps again.
- The `server/` dev-only cache edits (not this pass's) are still uncommitted and untouched.

## Seal gate
none (commit/push left to `/ship`)
