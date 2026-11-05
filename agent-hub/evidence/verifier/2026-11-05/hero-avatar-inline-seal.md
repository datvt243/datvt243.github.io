# 2026-11-05 - hero-avatar-inline (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `hero-avatar-inline` (#385 follow-up, `feature/385`)
- Note judged: `evidence/implementer/2026-11-05/hero-avatar-inline-diff.md`
- Verdict: **SEAL**

## Isolation proof
Separate Agent-tool subagent, spawned with the task string "You are the VERIFIER worker ... Target: evidence note `agent-hub/evidence/implementer/2026-11-05/hero-avatar-inline-diff.md` (node `hero-avatar-inline` ..., a #385 follow-up) ... You are a separate subagent spawn, independent of the implementer." That string differs from the implementer's task (the operator's "hãy làm 1 trước" follow-up). Blank context. I did not write this diff and did not open it.

## Re-run
none. This was an audit only. The note's outputs are complete, its commands match `doctrine/MEMORY.md`, and its UI block covers every criterion. I also viewed the two cited screenshots (`hero-avatar-1440.png`, `hero-avatar-375.png`, both in the session scratchpad). That is reading existing evidence, not re-running anything. I started no server or build and loaded no page.

## Criteria
| Criterion | Verdict | Cited |
|---|---|---|
| 1 no right avatar column at 1440×900, avatar ≤128px beside greeting + name in its CornerFrame, content full width | met | `hero w960 h642 · frame 130×130 at x240 (img 104×104) · h1 x394 w454 1 line`, and `position w960`. Before: `leftCol w654 · avatarCol w266`. The 1440 screenshot shows the framed avatar left of "Hi there! I am" and the name, with no right column. |
| 2 the real `positionDesired` on 1 line at 1440, intro under 10 lines, measured in a browser | met | `position w960 h32 positionLines 1 · intro w775 h182 introLines 8`. Before: `positionLines 2`, `10 lines`. Measured on the operator's dev server with real backend data, at the operator's request. The screenshot shows the full title on one line and 8 intro lines. |
| 3 375px: no overflow, avatar hidden; 640px: name on 1 line | met | `375x812: avatarShown false · ... overflowX false` and `640x900: avatarShown true · h1Lines 1`. The 375 screenshot shows no avatar and nothing cut off at the edge. |
| 4 build + lint + typecheck + `npm test` | met | `build=0`, `lint=0`, `typecheck=0 ts_errors=0`, `Test Files 8 passed (8) / Tests 20 passed (20)`. The commands match `doctrine/MEMORY.md`, and the format matches the notes sealed before. |
| comments per code-comments.md | met (per note) | One template comment that gives the WHY and has no `(#N)` ref. |

## Notes
- The UI was checked on `nuxt dev` (:3000) after an HMR update, not on a prod build. The note says so under "Not checked", along with light mode and VI. The node asks only for "measured in a browser", so this is acceptable. The change is layout-only Tailwind classes, so SSR and dev render the same markup.
- Disclosed risk: at 1440 the title fills about 945 of 960px, so a slightly longer `positionDesired` will wrap again. On mobile the title takes 3 lines and the intro 18, which this node did not change. Both are listed under "Noticed, not done" and are the operator's call (options 2 and 3).

## Forbidden states
None hit. The node is on the diagram, the note exists, the outputs are complete, there is no code in `haven/`, and the PM status is updated here.

## Proportionality
Only `Hero.vue` changed, plus the node row. Removing the column, moving the avatar beside the name and widening the intro from 65ch to 90ch are all inside the node. I did not judge the uncommitted `server/` dev-cache edits or the already-SEALED `hero-about-me-intro` diff. The `server/` edits must not be staged with this node.

## Seal gate
The diff made no outward action (commit/push is left to `/ship`). OK.

## Supersedes
none (the note says `## Supersedes: none`, and there is no other open #385 row on the active diagram).

## PM status
`hero-avatar-inline`: PENDING → SEALED. The full row was archived to `haven/diagrams/dev-loop-archive.md` after `hero-about-me-intro`, and the active row is now a pointer. The oldest pointer (`resume-content-locale`, whose full row is already in the archive) was dropped to keep 20 pointers.
