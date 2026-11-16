# 2026-11-16 - vi-docs-to-english (REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `vi-docs-to-english` (`haven/diagrams/dev-loop.prime-mermaid.md`) — stays PENDING (no PM change on REOPEN)
- Note audited: `evidence/implementer/2026-11-16/vi-docs-to-english-plan.md`
- Task: #459 "kiểm tra các file skill md, agent-hub và các file md ở root, nếu content là tiếng Việt, hãy đưa về tiếng Anh"

## Verdict: REOPEN
forbidden_hit: `EDIT_UNVERIFIED` (criterion 2 claimed without cited output)

## Cited (holds)
- Crit 1: note cites a post-diff diacritic scan (file: line-count) over the node's scope; remaining hits are README/CLAUDE/agent-hub 1-line names or UI strings plus `dev-loop-archive.md` (35, verbatim operator quotes/locale strings — archive contract is verbatim). No `.claude/**` file appears. Scope decision for `evidence/`/`histories/` matches the node.
- Crit 3: commands match `doctrine/MEMORY.md` (`npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`, repo root). Output: `Build complete in 16.8s!`, `lint exit=0`, `typecheck exit=0`, `Tests  28 passed (28)`. No truncation markers.
- Comments per code-comments.md: n/a, no code touched.
- Feature doc: `none` with reason (docs/tooling only) — acceptable.
- Review: `skipped — docs` on a docs task — acceptable.
- Supersedes: none; only one row for #459 on the active diagram.

## Missing
- Crit 2 ("translated skills keep every step number, cross-reference, command and frontmatter key"): the evidence cell is a paraphrase — "`head` of both files: ... intact; harness re-listed `worker`" — with no verbatim output. Even the frontmatter part is a summary, and step numbers, cross-references and commands have no evidence at all. `todo/SKILL.md` had 103/166 lines rewritten, `worker/SKILL.md` 53/86: precisely the kind of rewrite where a step number or a `step 1.2`/`step 4` cross-ref silently shifts.
- To fix: cite verbatim output that compares old against new for each of the two skill files, e.g.
  `diff <(git show HEAD:.claude/skills/todo/SKILL.md | grep -oE '^(#+ .*|[0-9]+[a-z]?(\.[0-9]+)?\.)|step [0-9]+[a-z]?(\.[0-9]+)?|`[^`]+`' ) <(grep -oE '<same pattern>' .claude/skills/todo/SKILL.md)`
  (same for `worker/SKILL.md`), or at minimum the verbatim `head -6` of both files plus the before/after lists of step-number/heading lines and backticked commands. Any differences shown must be wording-only, with each one explained.
- Optional, not blocking: README TOC anchors "rewritten to match the new English headings" have no evidence either. A heading/anchor list would close this.

## Forbidden states
ADHOC_WORK no (node exists) · NO_EVIDENCE no · EDIT_UNVERIFIED **yes** (crit 2) · CODE_IN_HAVEN no · DIAGRAM_DRIFT no (PENDING row added).

## Seal gate
Not outward-facing (no commit/push/PR) — none required.

## Proportionality
4 files, all within the task (3 translations + node row). `issues-ls/SKILL.md` is declared pre-existing and not part of this diff. Not a reason to reopen.

## Doctrine proposal: none

## Isolation proof
Fresh Agent-tool spawn for this verify pass. Prompt began "You are the agent-hub VERIFIER for the repo at /Users/_david/Workspace/Project/resume/datvt243.github.io (current branch feature/459). Follow `.claude/skills/worker/SKILL.md` for `<wid>` = verifier exactly ..." — not the implementer's task string. This context never saw the implement pass.

## Re-run: none
Audit-only, per "Re-run scope": the gap is a missing citation, so REOPEN instead of re-running.
