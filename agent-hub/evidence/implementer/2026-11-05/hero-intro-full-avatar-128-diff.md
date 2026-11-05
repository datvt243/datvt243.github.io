# 2026-11-05 - hero-intro-full-avatar-128 (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `hero-intro-full-avatar-128` (row right after `hero-avatar-inline`)
- Task: operator follow-ups on #385: "tôi thấy ảnh hơi mờ", then "cho aboutme rộng 100%". Branch `feature/385`.
- Status: `sealed_pending_verifier`

## Hub bytes before
79715 (measured before the node row was inserted)

## Diagnosis (blur)
- The operator's Chrome (CDP :9888) reports `devicePixelRatio 1`.
- The img had `src=/_ipx/s_104x104/Avatar.png` and `srcset="…s_104x104… 1x, …s_208x208… 2x"`, with `naturalWidth 104` = CSS 104. It renders 1:1, so the browser does no scaling.
- `public/Avatar.png` is 500×500 (sips). At 104px the face is about 45px wide, so the softness comes from the source photo plus the downscale.
- I fetched IPX variants from the dev server: `s_104x104`, `s_104x104,sharpen_1`, `s_128x128`, `s_128x128,sharpen_1` (all 200, PNG). A 3× nearest-neighbour comparison is at scratchpad `compare.png`: sharpen is visibly crisper, and 128 has more detail than 104.
- Sharpen was NOT applied. On Vercel, @nuxt/image auto-selects the `vercel` provider, which only does width/quality, so `sharpen` would not take effect in production. This is my understanding of @nuxt/image's provider auto-detection, not verified on a deploy.
- Fix applied: a bigger size (more source pixels). The operator decides on a better source photo.

## Diff
| File | Change |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | Avatar `NuxtImg width/height 104 → 128`. Intro `<p>`: removed `max-w-[90ch]`. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row inserted |

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
Measured on the operator's `nuxt dev` at `localhost:3000/en`, with real data. The change arrived by HMR, with no page reload.

**1440×900** (`vis: hidden`: the operator was on another tab, but layout is computed regardless):
```
hero w960 h621 · intro x240 w960 h137 introLines 6 maxWidth "none"
img 128×128 at x253 · natural 128 · srcset "/_ipx/s_128x128/Avatar.png 1x, /_ipx/s_256x256/Avatar.png 2x"
frame 154×154 · h1 x418 w454 · posLines 1 · experiences.pug item y768 · overflowX false
```
The previous node had: hero h642, intro w775 with 8 lines, img 104.

**375×812:** `avatarShown false · overflowX false`. The viewport was restored to 1440×900 afterwards.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 intro full width, no max-width | intro w960 = hero w960, maxWidth "none" |
| 2 img 128, srcset 128/256 | img 128×128, srcset as quoted |
| 3 375 no overflow, avatar hidden | 375 row |
| 4 checks | Output block |
| comments per code-comments.md | None added or changed. The existing avatar comment is still true. |

## Supersedes: none
## Still open: none

## Noticed, not done
- The intro at 960px is about 120 characters per line, longer than the usual readable measure. The operator asked for it explicitly.
- A sharper avatar needs a better or larger source photo. IPX `sharpen` is local only (see Diagnosis).
- The operator then asked to present the avatar as an `<img src=… />` code tag. That will be a separate node.

## Seal gate
none
