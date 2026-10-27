# 2026-10-27 - experience-skills-inline (verifier)

- Worker: verifier · Version: 0.1.0
- Node: `experience-skills-inline` (#336, branch `feature/336`)
- Verdict: **SEAL**
- New PM status: SEALED (row archived to `haven/diagrams/dev-loop-archive.md`; oldest pointer `deps-nuxt-ui-4-icon-2` dropped from the active file, its full row is already in the archive)

## Isolation proof
Separate Agent spawn, description "Verifier pass experience-skills-inline", started with a blank context and the operator's mock-only constraint. The implementer wrote the diff in another pass. This pass wrote no product code.

## Reasoning
Audited the diff note `evidence/implementer/2026-10-27/experience-skills-inline-diff.md` and the two screenshots it cites. `git diff --stat` lists the same 3 files the note's Diff table names (Experiences.vue +13/-8, themeBadgeUi.ts +3/-2, diagram +1), nothing extra.

| Criterion | Evidence |
|---|---|
| 1. one code line per skills list | Note: 8 code-lines per article, 9 skills in 2 visual rows. `.playwright-mcp/exp-skills-desktop.png` (viewed): line 5 `ul.skills [Vue][Nuxt][TypeScript][TailwindCSS][Pinia][Git][Docker]` wraps to `[REST API][SCSS]` under the chips with no new line number; line 6 is `ul.description`. Job 2: line 15 `ul.skills [React][Node]` |
| 2. house badge reused | Note cites `<UBadge :label="skill" variant="outline" :ui="accentBadgeUi" />`, same as `projects/Index.vue:86`. The screenshot chips are the outline accent style |
| 3. list semantics kept | Note cites `<ul class="tag-text flex flex-wrap gap-1.5"><li v-for=…>` |
| 4. mobile, no overflow | Note: 390px `scrollWidth > innerWidth` → false. `.playwright-mcp/exp-skills-mobile.png` (viewed): chips wrap in 2 rows inside the card, no clipping |
| 5. build/lint/typecheck/test | Note: `◆ ✨ Build complete in 15.2s!`, `lint=0`, `typecheck=0`, `Test Files 4 passed (4)` / `Tests 10 passed (10)`. The lint and typecheck lines are exit codes only, so this pass re-ran them: `npm run lint` → `> eslint .` rc=0, no findings · `npx nuxi typecheck` rc=0, `grep -c 'error TS'` → 0 · `npm test` → `Test Files  4 passed (4)` / `Tests  10 passed (10)` |
| comments per code-comments.md | Note: one-line WHY comment in the template; the themeBadgeUi doc comment's "shared by" list updated so it stays true |

Mock backend: the note's server ran with `NODE_API=NUXT_PUBLIC_NODE_API=http://localhost:4199`, `grep -c onrender srv.log` → 0. This pass started no server.

Forbidden states: none hit (node on the diagram, note present, checks re-run, no code in `haven/`, PM status updated here). Seal gate: none needed (no commit/push). Proportionality: 2 product files, both needed. Supersedes: `none`, and no other #336 row on the active diagram.

Non-blocking: the visible label still reads `ul.skills` (the note's "Noticed, not done"). The issue asked to stop rendering one `li` line per skill, and that is done. Renaming the label is up to the operator.

## Re-run
partial: `npm run lint`, `npx nuxi typecheck`, `npm test` (no build, no server). Reason: the note gives lint and typecheck only as `lint=0`/`typecheck=0` exit codes, not their output, so this pass re-ran those cheap commands instead of trusting the summary (citation-gap exception).
