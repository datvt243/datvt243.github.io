> Evidence is who did what and why (`NO_EVIDENCE` if it's missing). Every
> worker action ends with a note.

## Layout
```
evidence/implementer/<date>/<slug>-plan.md
evidence/implementer/<date>/<slug>-diff.md
evidence/verifier/<date>/<slug>-{seal|reopen}.md
evidence/worker-runs.log
```
Date as `YYYY-mm-dd`, slug is kebab-case taken from the task name.

## Format — implementer note
- Title (date - node) · Worker · Version · Node (points to the diagram) ·
  Task (verbatim prompt)
- `## Hub bytes before` — [added 2026-09-02] byte count measured at
  `pick_next` step 7, before the diff starts — the verifier reads this
  back when writing `worker-runs.log`, don't skip it
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
- `## Isolation proof` — [added 2026-09-02] cites whatever makes this a
  real separate subagent context from the implementer pass (e.g. the
  Agent tool spawn's `description`/task string). Not a technical
  guarantee (no hook enforces it) — a citeable trail: missing, or
  identical to the implementer's own task string, is itself a red flag
  for later audit. See "Steps" 1b/13a in `recipes/verify_seal.md`.
- `## Reasoning` — cite evidence for each criterion
- `## Missing` — only present on REOPEN
- `## Re-run` — [added 2026-09-02] `none`/`partial`/`full`, declared
  honestly per what was actually done (see "Re-run scope" in
  `recipes/verify_seal.md`), with a reason if not `none`. The verifier
  reads this back when writing `worker-runs.log` (step 14) — not
  decorative.

## Format — worker-runs.log
- [added 2026-09-02] NOT a narrative note like the ones above — an
  **append-only file, 1 line per implementer or verifier pass that ends**.
  Written by `pick_next.md`/`implement.md`/`verify_seal.md` themselves —
  NOT by `/todo` — so it runs the same whether a task went through `/todo`
  or a standalone `/worker implementer` then `/worker verifier`.
- Two line shapes:
  - Implementer (only on `blocked`/`failed`, never reaching the verifier):
    `<ISO timestamp> role=implementer outcome=blocked|failed node=<slug>
    hub_bytes_before=<N> verifier_rerun=n/a`
  - Verifier (every verdict — SEAL or REOPEN):
    `<ISO timestamp> role=verifier outcome=SEAL|REOPEN node=<slug>
    rerun=none|partial|full hub_bytes_before=<N> hub_bytes_after=<N>`
  `hub_bytes_*` use this hub's own `/hub-tokens` "per-session total"
  formula.
- One line per round-trip (1 implementer pass → at most 1 verifier
  verdict), not one per node's whole lifetime — a node REOPENed 3 times
  has 3 verifier lines with the same `node=`, greppable by slug.
- **Purpose**: real, non-inferred data to spot patterns later — repeated
  REOPEN on the same kind of task, verifier re-running despite the
  audit-only default, an unusual jump in hub size between two runs. Not a
  real token count (no API exposes that) — a byte-proxy, same spirit as
  `/hub-tokens`.
- Cold storage — not re-read wholesale every worker session (unlike
  `doctrine/`, the active diagram), only opened when someone audits
  patterns on purpose. NEVER delete a line, even one recording a bad run.
- **Archiving convention** — [added 2026-09-02] same 15KB threshold/
  mechanism `/hub-tokens` already checks for `doctrine/domains/PROJECT.md`
  and `haven/diagrams/`: once `worker-runs.log` crosses 15KB, move lines
  older than the current work session into `evidence/worker-runs-archive.log`
  (create it if missing), oldest first, full text verbatim — nothing
  deleted, only relocated. Recent lines stay inline. `/hub-tokens` already
  counts this file; when it flags >15KB, do this pass before appending
  more lines.

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
