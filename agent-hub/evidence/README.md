> Evidence is who did what and why (`NO_EVIDENCE` if it's missing). Every
> worker action ends with a note.

## Layout
```
evidence/implementer/<date>/<slug>-plan.md
evidence/implementer/<date>/<slug>-diff.md
evidence/verifier/<date>/<slug>-{seal|reopen}.md
```
Date as `YYYY-mm-dd`, slug is kebab-case taken from the task name.

## Format — implementer note
- Title (date - node) · Worker · Version · Node (points to the diagram) ·
  Task (verbatim prompt)
- `## Diff` — table of files | file | why |
- `## Command` — the verbatim command from `doctrine/MEMORY.md` (`npm run
  build`, `npm run lint` — NEVER `npm test`, this project has no test
  suite)
- `## Output` — verbatim, not your own paraphrase
- `## Browser verification` — only needed if the node changes visual/
  behavior: screenshot path or a citeable computed style via Chrome CDP,
  or clearly write "N/A — no visual change" if not applicable
- `## Acceptance` — a table | Criterion | Evidence | (evidence points to
  a specific line of output — don't just say "build's fine", must quote
  it verbatim)
- `## Noticed, not done` — things noticed outside scope but not fixed
- `## Seal gate` — record the approval if there was an outward-facing
  action, or "none"

## Format — verifier verdict
- Worker · Node · New PM status (PENDING/SEALED/REOPEN)
- `## Reasoning` — cite evidence for each criterion
- `## Missing` — only present on REOPEN

## The three rules of this directory
1. **VERBATIM, ALWAYS** — never claim something without citeable evidence.
2. **NEVER DELETE** — a wrong note gets a correction added, not deleted.
3. **BAD NOTES STAY** — a note about a failed task is still kept; keeping
   a clean trail matters less than keeping the doctrine's integrity.

## Relationship with `agent-hub/histories/`
`histories/` is the old work-log (before this hub existed) — still kept
as-is, not moved/deleted, but is NO LONGER where new audit trail gets
written. Since 2026-08-16, every implementer/verifier action gets written
here.
