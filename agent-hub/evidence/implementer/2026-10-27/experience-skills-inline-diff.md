# 2026-10-27 - experience-skills-inline (diff)

- Worker: implementer · Version: 0.1.0
- Node: `experience-skills-inline` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #336, branch `feature/336` off `staging` bbb6325 — "phần experience/skills, không dùng ul li nữa, nội dung ngắn mà li xuống dòng quá nhiếm chỗ, thay bằng design khác, cho lên cùng 1 dòng"
- Status: `sealed_pending_verifier`

## Hub bytes before
80090

## Acceptance criteria
1. Each experience's skills render on ONE code line (one line number), not one `li` line per skill; long lists wrap within that line.
2. Visual style reuses the house badge (`UBadge` outline + `accentBadgeUi`, as on `/projects`) — no new style object.
3. Screen readers still get a list (semantic `ul`/`li` kept; the visible pug `li` glyphs are gone).
4. Mobile (<48rem): no horizontal overflow.
5. build + lint + typecheck + `npm test` clean.

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Experiences.vue` | Skills block: separate `ul.skills` line + one `li` code-line per skill → one `div.code-line.depth-1` holding the `ul.skills` label + a `flex flex-wrap` `ul` of `UBadge`s; imports `accentBadgeUi` |
| `utils/themeBadgeUi.ts` | Doc comment's "shared by" list adds Experiences.vue |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (repo root)

## Output
```
◆ ✨ Build complete in 15.2s!
lint=0
typecheck=0
 Test Files  4 passed (4)
      Tests  10 passed (10)
```

## Browser verification
Prod build with `NODE_API=NUXT_PUBLIC_NODE_API=http://localhost:4199` (mock, 9 skills on job 1, 2 on job 2), `PORT=4187 node .output/server/index.mjs`; `grep -c onrender srv.log` → **0**. Playwright:
- 1280px: first article `.code-line` count = 8 (was 1+9+… before), skills `li` = 9, distinct row tops = 2 (wrap), ul height 54px. Screenshot `.playwright-mcp/exp-skills-desktop.png`: line 5 `ul.skills [Vue][Nuxt]…[Docker]` wrapping `[REST API][SCSS]` aligned under the chips.
- 390px: `scrollWidth > innerWidth` → false. Screenshot `.playwright-mcp/exp-skills-mobile.png`: chips in two rows, label hidden as before.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 one line | 8 code-lines/article, 2 visual rows for 9 skills, single line number 5 in desktop screenshot |
| 2 house badge | `<UBadge :label="skill" variant="outline" :ui="accentBadgeUi" />`, same as `projects/Index.vue:86` |
| 3 list semantics | `<ul class="tag-text flex flex-wrap gap-1.5"><li v-for=…>` |
| 4 mobile | overflowX false |
| 5 checks | Output block above |
| comments per code-comments.md | one-line WHY template comment; themeBadgeUi doc updated to stay true |

## Supersedes: none

## Noticed, not done
- Visible label still reads `ul.skills` (true to the real element, matches the pug metaphor); the user's "no ul li" is met visually by dropping per-skill `li` lines.

## Seal gate
none (no commit/push)
