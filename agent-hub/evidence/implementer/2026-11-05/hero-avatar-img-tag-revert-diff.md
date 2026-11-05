# 2026-11-05 - hero-avatar-img-tag-revert (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `hero-avatar-img-tag-revert` (row right after `hero-avatar-img-tag`)
- Task: operator: "tôi thấy ko ổn lắm, hãy revert lại", said right after the `<img src=… />` avatar was shown. Branch `feature/385`.
- Status: `sealed_pending_verifier`
- Context:
  - The verifier for `hero-avatar-img-tag` was stopped with TaskStop once the operator asked to revert. By then it had already written its SEAL note, the diagram row and the worker-runs.log line (`2026-11-05T02:49:00Z … outcome=SEAL node=hero-avatar-img-tag`).
  - Per LAI-13 that SEAL stays, so this revert is a new node.

## Hub bytes before
79743 (measured before the node row was inserted)

## Diff (this node's own change, vs the `hero-avatar-img-tag` state)
| File | Change |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | Removed the decorative `<img src=…` code block and its comment. Restored `<ThemeCornerFrame class="hidden sm:block shrink-0"><NuxtImg … width="128" height="128" class="rounded-lg" alt="" /></ThemeCornerFrame>`, the exact text from `hero-intro-full-avatar-128`. |
| `themes/portfolio-dev/components/CornerFrame.vue` | Restored with `git restore --staged --worktree` |
| `nuxt.config.ts` | `git checkout --` (its only diff was the CornerFrame mention) |
| `.claude/rules/theme.md` | `CornerFrame` is back in the primitives list. The #385 `1`–`4` change is kept. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row inserted |

Read back:
```
git status --short -- nuxt.config.ts themes/portfolio-dev/components/   → (empty: both identical to HEAD)
grep -c "text-theme-code-punct\|ThemeCornerFrame" Hero.vue              → 2  (the CornerFrame open + close tags, no code-token spans)
git diff .claude/rules/theme.md | grep "^[-+] "                         → only the #385 `1`–`5` → `1`–`4` line
```

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
Operator's `nuxt dev` at `localhost:3000/en`, after HMR, at 1440×900:
```
img 128x128 · frame 154x154 (class "relative rounded-xl border border-theme-border-subtle bg-the…" = CornerFrame root)
codeText false (no "<img src=" in the hero's innerText) · hero 960x621 · overflowX false
```
- Hero `h621`, frame `154` and img `128` equal the numbers recorded for `hero-intro-full-avatar-128`.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 files back to the `hero-intro-full-avatar-128` state | Read-back block |
| 2 framed 128px avatar, no code text | UI block |
| 3 checks | Output block |
| comments per code-comments.md | Removed the img-tag comment along with its code. The remaining layout comment is unchanged and still true. |

## Supersedes: none
## Still open: none
## Noticed, not done: none
## Seal gate
none
