# 2026-11-05 - hero-avatar-img-tag-revert (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `hero-avatar-img-tag-revert` (#385 follow-up, `feature/385`)
- Note judged: `evidence/implementer/2026-11-05/hero-avatar-img-tag-revert-diff.md`
- Verdict: **SEAL**

## Isolation proof
Separate Agent-tool subagent, spawned with the task string "You are the VERIFIER worker ... Target: evidence note `agent-hub/evidence/implementer/2026-11-05/hero-avatar-img-tag-revert-diff.md` (node `hero-avatar-img-tag-revert` ...). The operator asked to revert the `<img src=… />` avatar presentation (SEALED node `hero-avatar-img-tag`), so the files go back to the `hero-intro-full-avatar-128` state. You are a separate subagent spawn, independent of the implementer." That string differs from the implementer's task (the operator's "tôi thấy ko ổn lắm, hãy revert lại"). Blank context. I did not write this diff and did not open it.

## Re-run
none. Audit only: the outputs use the same format as the notes sealed before, the commands match `doctrine/MEMORY.md`, and the read-back and UI blocks cover every criterion. The node is not outward-facing and not a `/release` gate. I started no server or build and loaded no page.

## Criteria
| Criterion | Verdict | Cited |
|---|---|---|
| 1 `Hero.vue`, `CornerFrame.vue`, `nuxt.config.ts`, `.claude/rules/theme.md` back to the `hero-intro-full-avatar-128` state | met | `git status --short -- nuxt.config.ts themes/portfolio-dev/components/ → (empty: both identical to HEAD)`. `git diff .claude/rules/theme.md` shows only the #385 `1`–`5` → `1`–`4` line, so the CornerFrame line is back. `Hero.vue`: `grep -c "text-theme-code-punct\|ThemeCornerFrame"` → 2 (frame tags, no code-token spans), and the restored block is quoted. The `hero-avatar-img-tag` note shows that node changed only this block plus one comment in `Hero.vue`; both are removed here. The UI numbers below match the ones recorded for `hero-intro-full-avatar-128`. |
| 2 framed 128px avatar, no `<img src=` code text | met | `img 128x128 · frame 154x154 (class "relative rounded-xl border border-theme-border-subtle bg-the…" = CornerFrame root)`, `codeText false`, `hero 960x621 · overflowX false`. These equal the `hero-intro-full-avatar-128` note (`hero w960 h621`, `img 128×128`, `frame 154×154`). |
| 3 build + lint + typecheck + `npm test` | met | `build=0`, `lint=0`, `typecheck=0 ts_errors=0`, `Test Files 8 passed (8) / Tests 20 passed (20)` |
| comments per code-comments.md | met (per note) | The img-tag WHY comment is removed with its code. No comment added. |

## Notes
- Byte-identity of `Hero.vue` is shown indirectly (that state was never committed, so there is no hash to compare). The evidence is the grep, the quoted restored block, and identical layout numbers. That is enough for a revert of one block.
- The UI was measured on the operator's `nuxt dev` (:3000) after HMR, as in the earlier sealed notes. The 375px viewport, light mode and a prod build were not re-checked. None of them is in this node's criteria, and `hero-intro-full-avatar-128` already checked 375px for this markup.
- The SEAL of `hero-avatar-img-tag` stays (LAI-13). This node is the revert.

## Forbidden states
None hit. The node is on the diagram, the note exists, the outputs are complete, there is no code in `haven/`, and the PM status is updated here.

## Proportionality
Only the four reverted files and the node row. I did not judge the uncommitted `server/` dev-cache edits or the earlier SEALED #385 diffs. The `server/` edits must not be staged with this node.

## Seal gate
The diff made no outward action (commit/push is left to `/ship`). OK.

## Supersedes
none (the note says `## Supersedes: none`).

## PM status
`hero-avatar-img-tag-revert`: PENDING → SEALED. The full row was archived to `haven/diagrams/dev-loop-archive.md` after `hero-avatar-img-tag`, and the active row is now a pointer. The oldest pointer (`skills-typo-map-drop`, whose full row is already in the archive) was dropped to keep 20 pointers.
