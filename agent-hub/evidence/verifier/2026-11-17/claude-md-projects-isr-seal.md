# 2026-11-17 - claude-md-projects-isr (SEAL)
- Worker: verifier · Version: 0.1.0
- Node: `claude-md-projects-isr` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: issue #434 "CLAUDE.md: /projects is ISR 60s, not "no routeRule"", branch `bug/434`
- Judged: `evidence/implementer/2026-11-17/claude-md-projects-isr-plan.md`, `evidence/implementer/2026-11-17/claude-md-projects-isr-diff.md`

## Verdict: SEAL

## Isolation proof
Fresh Agent-tool subagent spawned with the verifier prompt "You are the VERIFIER in the agent-hub ... Run exactly the `/worker verifier` procedure as a separate, isolated pass" (task #434, node `claude-md-projects-isr`); blank context, did not write the diff (step 1 self-check: not self-written).

## Re-run: none
Audit-only (default). Output in the note is verbatim and uncut, commands match `doctrine/MEMORY.md`, node is a doc-only, non-outward-facing change; no exception case applies.

## Cited
| Criterion | Evidence (from diff note) |
|---|---|
| 1. `CLAUDE.md` `/projects` row reads `ISR 60s` | `git diff CLAUDE.md`: `+| \`/projects\` | ISR 60s | \`useResumeStore\` |`; anchor `nuxt.config.ts:156` `'/projects': { isr: 60 },` |
| 2. no stale "no routeRule" claim | grep output lists only `dev-loop.prime-mermaid.md:86` (this node's row) and `doctrine/features/projects.md:51` (answered Open question 1) |
| 3. build+lint+typecheck+test clean | "Build complete in 14.9s!" exit 0; `eslint .` exit 0, no problems; `npx nuxi typecheck` exit 0, 0 error lines; `Tests  28 passed (28)` |
| comments per code-comments.md | n/a — markdown table cell only, no code comment |
| Feature doc `doctrine/features/projects.md` Behavior #1 | "`/projects` and `/en/projects` are ISR-cached 60s" — the fix makes CLAUDE.md agree; operator answer to Open question 1 recorded ("The config is right; fix CLAUDE.md — #434"). Doc not edited, so no `## Feature doc changed` needed. |
| Review | `skipped — docs` on a docs task (label `documentation`) — allowed |
| Supersedes / Still open | `## Supersedes: none`; `grep "#434"` on the diagram → only this node |

## Missing
none

## Forbidden states
- `ADHOC_WORK`: no — node exists on the diagram.
- `NO_EVIDENCE`: no — plan + diff notes present.
- `EDIT_UNVERIFIED`: no — build/lint/typecheck/test output quoted verbatim; typecheck run standalone per MEMORY.md.
- `CODE_IN_HAVEN`: no — only a markdown row in `haven/`.
- `DIAGRAM_DRIFT`: no — node row added; PM status now SEALED by this pass.

## Seal gate
No outward-facing action; none required.

## Proportionality
One table cell in `CLAUDE.md` + the node row. Matches the node, nothing extra. Pre-existing unrelated working-tree changes are listed under "Noticed, not done", not part of this diff.

## Doctrine proposal
none in the note.

## PM status
`claude-md-projects-isr` IN_PROGRESS → SEALED. Full row appended to `haven/diagrams/dev-loop-archive.md`; active row replaced by a pointer; oldest pointer (`hero-avatar-img-tag-revert`, full row already in the archive) deleted to keep 20 pointer rows. Feature doc status untouched (fix SEAL proves one Behavior item).
