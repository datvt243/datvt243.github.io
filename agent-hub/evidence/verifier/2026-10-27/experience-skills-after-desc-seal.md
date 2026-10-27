# 2026-10-27 - experience-skills-after-desc (verifier)

- Worker: verifier · Version: 0.1.0
- Node: `experience-skills-after-desc` (#336 follow-up, branch `feature/336`)
- Verdict: **SEAL**
- New PM status: SEALED (row archived to `haven/diagrams/dev-loop-archive.md`; oldest pointer `skills-tab-all-groups` dropped from the active file, its full row is already in the archive)

## Isolation proof
Separate Agent spawn, description "Verifier pass experience-skills-after-desc", started with a blank context and the operator's no-server / no-localhost:3000 constraint. The implementer wrote the diff in another pass. This pass wrote no product code.

## Reasoning
Audited `evidence/implementer/2026-10-27/experience-skills-after-desc-diff.md` and `git diff staging -- themes utils` (operator-requested). Only `themes/portfolio-dev/pages/resumeObject/Experiences.vue` differs vs staging. `utils/` has no diff.

| Criterion | Evidence |
|---|---|
| 1. `p.skills` is the last code line of each `article`, after `ul.description` | File lines 56-70: `<template v-if="el.descriptionItems.length">` (ul.description) closes, then the skills comment + `<p v-if="el.skills?.length">`, then `</article>`. Note's browser output: every article with skills ends in `"p.skills…"` (3 of 5). The two career-break articles have no skills and end in `li` |
| 2. Skills markup unchanged, just moved | Diff vs the `experience-skills-text` SEAL: same `<p v-if="el.skills?.length" class="code-line depth-1">`, `pugTag('p', 'skills')`, `el.skills.join(', ')`, same one-line comment. Only its position changed |
| 3. build/lint/typecheck/test | Note: `◆ ✨ Build complete in 14.3s!`, `lint=0`, `typecheck=0`, `Tests  10 passed (10)`. Lint/typecheck are exit codes only, so this pass re-ran: `npm run lint` rc=0 · `npx nuxi typecheck` rc=0 · `npm test` → `Test Files  4 passed (4)` / `Tests  10 passed (10)` |
| comments per code-comments.md | The existing one-line WHY comment moved with its block, unchanged |

The browser check ran on the operator's own dev server, as the note says. This pass loaded no page and started no server. The note's build ran against the mock (`NODE_API=NUXT_PUBLIC_NODE_API=http://localhost:4199`).

Forbidden states: none hit (node is on the diagram, note present, checks cited or re-run, no code in `haven/`, PM status updated here). Seal gate: none needed (no commit/push). Proportionality: pure move inside 1 product file. Supersedes: `none`. The other #336 rows (`experience-skills-inline`, `experience-skills-text`) are already SEALED, so no open row is left behind.

Non-blocking: the Vietnamese diacritics issue in "Noticed, not done" is out of scope and still needs its own issue.

## Re-run
partial: `npm run lint`, `npx nuxi typecheck`, `npm test` (no build, no server). Reason: the note gives lint and typecheck only as exit codes, not their output (citation-gap exception).
