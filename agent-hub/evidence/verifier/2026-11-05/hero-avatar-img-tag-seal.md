# 2026-11-05 - hero-avatar-img-tag (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `hero-avatar-img-tag` (#385 follow-up, `feature/385`)
- Note judged: `evidence/implementer/2026-11-05/hero-avatar-img-tag-diff.md`
- Verdict: **SEAL**

## Isolation proof
Separate Agent-tool subagent, spawned with the task string "You are the VERIFIER worker ... Target: evidence note `agent-hub/evidence/implementer/2026-11-05/hero-avatar-img-tag-diff.md` (node `hero-avatar-img-tag` ..., a #385 follow-up). The change renders the hero avatar inside decorative `<img src="Avatar.png" alt="…" />` code-syntax lines and deletes the now-unused `CornerFrame.vue`. ... You are a separate subagent spawn, independent of the implementer." That string differs from the implementer's task (the operator's "phần Avatar có thể trình bày theo kiểu ảnh nằm trong thẻ <img src=... /> không ?"). Blank context. I did not write this diff and did not open it.

## Re-run
none. Audit only: the outputs use the same format as the notes sealed before, the commands match `doctrine/MEMORY.md`, and the UI blocks cover every criterion. The node is not outward-facing and not a `/release` gate. I started no server or build and loaded no page. I only viewed the screenshot the note cites (`scratchpad/hero-img-tag.png`), which is reading evidence, not re-running.

## Criteria
| Criterion | Verdict | Cited |
|---|---|---|
| 1 at ≥sm: `<img src="Avatar.png"` / `alt="{fullName}"` above the 128px photo, `/>` below, in tag/key/string/punct tokens, code text `aria-hidden` | met | After fix: `first: "<img src=\"Avatar.png\""`. `codeText` lines 2-4: `"alt=\"Võ Tấn Đạt\"", "[img 128]", "/>"`. `ariaHidden 3`. `tokenColors punct:rgb(100,116,139) tag:rgb(244,114,182) key:rgb(147,197,253) ... string:rgb(253,186,116)`. The screenshot shows this layout at 1440. |
| 2 `CornerFrame.vue` deleted, mentions removed from `nuxt.config.ts` and `.claude/rules/theme.md`, 0 refs | met | Diff table rows (file `git rm`, `nuxt.config.ts:12`, `.claude/rules/theme.md:27-28`). Post-edit `grep -rn CornerFrame` gave `grep_exit=1`. |
| 3 1440: name and title 1 line each, no overflow. 375: avatar hidden, no overflow | met | 1440: `h1 x443 1 line · posLines 1 · overflowX false`, after fix `overflowX false`. The screenshot shows the name on 1 line and the title on 1 line. 375: `avatarBlockShown false · overflowX false`. |
| 4 build + lint + typecheck + `npm test` | met | `build=0`, `lint=0`, `typecheck=0 ts_errors=0`, `Test Files 8 passed (8) / Tests 20 passed (20)` |
| comments per code-comments.md | met (per note) | One new WHY template comment (decorative code text matching the editor theme). No `(#N)`. |

## Notes
- The 1440 line counts (`h1 ... 1 line`, `posLines 1`) were measured before the whitespace fix. The fix adds one space to the first line, so the block may be about 1ch wider. The after-fix screenshot confirms the name and title still sit on 1 line each.
- The UI was measured on the operator's `nuxt dev` (:3000) after HMR. Light mode, the VI locale and a prod build were not checked (the note says so). None of them is in the criteria.
- Disclosed: hero height went from 621 to 679px. `src="Avatar.png"` is display text that does not follow a future rename of the file.

## Forbidden states
None hit. The node is on the diagram, the note exists, the outputs are complete, there is no code in `haven/`, and the PM status is updated here.

## Proportionality
`Hero.vue`, the deleted `CornerFrame.vue`, the two doc mentions and the node row are all required by criteria 1-2. I did not judge the uncommitted `server/` dev-cache edits or the already-SEALED #385 diffs. The `server/` edits must not be staged with this node.

## Seal gate
The diff made no outward action (commit/push is left to `/ship`). OK.

## Supersedes
none (the note says `## Supersedes: none`).

## PM status
`hero-avatar-img-tag`: PENDING → SEALED. The full row was archived to `haven/diagrams/dev-loop-archive.md` after `hero-intro-full-avatar-128`, and the active row is now a pointer. The oldest pointer (`pages-nojekyll`, whose full row is already in the archive) was dropped to keep 20 pointers.
