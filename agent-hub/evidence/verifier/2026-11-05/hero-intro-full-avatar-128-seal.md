# 2026-11-05 - hero-intro-full-avatar-128 (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `hero-intro-full-avatar-128` (#385 follow-up, `feature/385`)
- Note judged: `evidence/implementer/2026-11-05/hero-intro-full-avatar-128-diff.md`
- Verdict: **SEAL**

## Isolation proof
Separate Agent-tool subagent, spawned with the task string "You are the VERIFIER worker ... Target: evidence note `agent-hub/evidence/implementer/2026-11-05/hero-intro-full-avatar-128-diff.md` (node `hero-intro-full-avatar-128` ..., a #385 follow-up). The change makes the hero intro full-width and the avatar 128px. ... You are a separate subagent spawn, independent of the implementer." That string differs from the implementer's task (the operator's "tôi thấy ảnh hơi mờ" / "cho aboutme rộng 100%" follow-ups). Blank context. I did not write this diff and did not open it.

## Re-run
none. Audit only: the outputs are in the same format as the notes sealed before, the commands match `doctrine/MEMORY.md`, and the UI block covers every criterion. The node is not outward-facing and not a `/release` gate. I started no server or build and loaded no page.

## Criteria
| Criterion | Verdict | Cited |
|---|---|---|
| 1 at 1440×900 the intro `<p>` spans the hero's full width, no max-width | met | `hero w960 ... intro x240 w960 ... maxWidth "none"`. Before: `intro w775`. |
| 2 avatar `<img>` 128×128, srcset 1x/2x = 128/256 | met | `img 128×128 at x253 · natural 128 · srcset "/_ipx/s_128x128/Avatar.png 1x, /_ipx/s_256x256/Avatar.png 2x"` |
| 3 375px: no overflow, avatar hidden | met | `375×812: avatarShown false · overflowX false` |
| 4 build + lint + typecheck + `npm test` | met | `build=0`, `lint=0`, `typecheck=0 ts_errors=0`, `Test Files 8 passed (8) / Tests 20 passed (20)` |
| comments per code-comments.md | met (per note) | None added or changed; the existing avatar comment is still true. |

## Notes
- The UI was measured on the operator's `nuxt dev` (:3000) after HMR, with the tab hidden (layout still computes). Computed values are quoted, so the evidence is concrete. No screenshot of the final state is cited, only `compare.png` for the blur diagnosis; the criteria are all numeric, so the quoted values suffice.
- The blur diagnosis says `sharpen` would not work on the Vercel image provider. That is the implementer's understanding, not checked on a deploy. It does not affect this node, because sharpen was not applied.
- Disclosed: about 120 characters per line at 960px (the operator asked for full width), and a sharper avatar needs a better source photo.

## Forbidden states
None hit. The node is on the diagram, the note exists, the outputs are complete, there is no code in `haven/`, and the PM status is updated here.

## Proportionality
Only `Hero.vue` (`width/height 104 → 128`, `max-w-[90ch]` removed) plus the node row, both inside the node. I did not judge the uncommitted `server/` dev-cache edits or the already-SEALED `hero-about-me-intro` / `hero-avatar-inline` diffs. The `server/` edits must not be staged with this node. A later node (avatar as an `<img>` code tag) may change `Hero.vue` again; this verdict covers only the state in this note.

## Seal gate
The diff made no outward action (commit/push is left to `/ship`). OK.

## Supersedes
none (the note says `## Supersedes: none`; the other #385 rows on the active diagram are already SEALED pointers).

## PM status
`hero-intro-full-avatar-128`: PENDING → SEALED. The full row was archived to `haven/diagrams/dev-loop-archive.md` after `hero-avatar-inline`, and the active row is now a pointer. The oldest pointer (`vi-glyph-fallback`, whose full row is already in the archive) was dropped to keep 20 pointers.
