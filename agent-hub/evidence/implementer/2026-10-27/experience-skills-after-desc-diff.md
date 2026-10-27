# 2026-10-27 - experience-skills-after-desc (diff)

- Worker: implementer · Version: 0.1.0
- Node: `experience-skills-after-desc` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #336 follow-up after `experience-skills-text` SEALED. Operator: "dời skills xuống sau description"
- Status: `sealed_pending_verifier`

## Hub bytes before
80100

## Acceptance criteria
1. In every job the `p.skills` line is the last code line of the `article`, after the `ul.description` block.
2. Skills markup itself unchanged (same `<p>` block + comment, just moved).
3. build + lint + typecheck + `npm test` clean.

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Experiences.vue` | The 6-line skills `<p>` block (comment + p) moved from before the description `<template>` to after it, just before `</article>`. `git diff --stat staging -- themes utils` → only this file, 7+/9- |

## Output
```
lint=0
typecheck=0
      Tests  10 passed (10)
◆ ✨ Build complete in 14.3s!
```
(build env NODE_API=NUXT_PUBLIC_NODE_API=http://localhost:4199 mock; no server started)

## Browser verification
Operator's dev server http://localhost:3000/ (HMR). Last 3 code lines per article:
```
["liHướng dẫn thành viên mới làm", "liPhối hợp trong các sprint Ag", "p.skillsSAPUI5, TypeScript, Ja"]
["time.period05/2024 - 11/2024", "ul.description", "liChủ động tự học trong thời g"]   (career break, no skills)
["liTham gia nâng cấp Vue 2 → Vu", "liThực hiện code review và hướ", "p.skillsVue.js 2 & 3, TypeScri"]
["time.period08/2020 - 01/2022", "ul.description", "liChủ động tự học trong thời g"]   (career break, no skills)
["ul.description", "liXây dựng website và trang th", "p.skillsHTML5, Pug, SCSS, Grun"]
```

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 | every article with skills ends in `p.skills…` (above) |
| 2 | diff is a pure move of the block |
| 3 | Output block |
| comments per code-comments.md | existing one-line comment moved with its block, unchanged |

## Supersedes: none

## Noticed, not done
- Vietnamese diacritics rendering issue (see `experience-skills-text-diff.md`) — still separate.

## Seal gate
none
