# 2026-09-07 — cleanup-pdf-only-types (verifier seal)

- Worker: verifier
- Node: `cleanup-pdf-only-types` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Note graded: `evidence/implementer/2026-09-07/cleanup-pdf-only-types-{plan,diff}.md`

## Verdict: SEAL

## Isolation proof
This verify pass ran as a separate spawned subagent (background job),
given the distinct task string `/worker verifier "#142"` by the
orchestrator, with instructions naming the specific claims to
independently re-check — not the implementer's own task string (`/todo
#142`, cited in the implementer's plan note). This session's first real
actions were loading `agent-hub/haven/workers/verifier/manifest.yaml` →
`SOUL.md` → `recipes/verify_seal.md` (only file present in `recipes/`,
`MEMORY.md` absent, confirmed via directory listing) → the implementer's
plan + diff notes → the real repo files the diff touches → independent
`grep`/read re-verification below. Never wrote any part of the graded
diff in this session. Confirmed I did not author this diff
(`NeverVerifyOwnWork`).

## Bundle read
`agent-hub/haven/workers/verifier/manifest.yaml`, `SOUL.md`,
`recipes/verify_seal.md` (only file in `recipes/`) read in full.
`MEMORY.md` does not exist for this worker (confirmed via `cat` — not
found). `agent-hub/CLAUDE.md` WAS auto-injected as a nested
system-reminder the moment this session's first `Read`/`Bash cat` touched
`agent-hub/` content (confirmed — the 5 forbidden states + seal-gate rule
appeared verbatim in a system-reminder), so per the recipe's step-3 guard
it was NOT re-read directly.

## Cross-check: working tree vs the diff note
`git status --short` at the start of this pass showed `types/
resume-document.ts` and `agent-hub/haven/diagrams/dev-loop.prime-
mermaid.md` modified, plus this node's own new evidence files under
`agent-hub/evidence/implementer/2026-09-07/` — matching the diff note's
own "Scope check" section (other modified/untracked files in the tree
belong to the earlier, already-SEALED `blog-api-runtime-validation`
node from the same session, correctly out of scope here).
`git diff HEAD -- types/resume-document.ts` reproduced, byte-for-byte,
the same 4-field removal (`Certificate.link`/`.images`,
`Award.link`/`.images`) shown in the implementer's diff note — no
discrepancy.

## Independent re-verification: the core claims (not re-reading the note's cited output)
Per this task's explicit instructions, re-ran the grep sweeps myself
against the real files on disk, rather than trusting the note's citations:

1. `grep -rn "\bItem\b\|\bReference\b\|\bCertificate\b\|\bAward\b"` across
   the whole repo (`--include="*.ts" --include="*.vue" --include="*.js"`,
   excluding `node_modules`/`.nuxt`/`agent-hub`/`.output`/`.git`, then
   re-run again with no `--include` filter as a broader sweep): the only
   hits are the 4 interface declarations in `types/resume-document.ts`
   (plus one hit that is just the word "Award" inside a code comment, not
   a usage) and `server/utils/createPDF.ts`'s import + 7 real usages
   (`_layoutItem(props: Item)`, `renderReferences`/`.map((e: Reference)`,
   `renderCertificates`/`.map((el: Certificate)`, `renderAwards`/
   `.map((el: Award)`). Confirms `createPDF.ts` is the only real consumer.
2. Checked for other importers of `types/resume-document.ts` itself
   (`grep -rln "resume-document"`): `types/index.ts` (a barrel `export *
   from './resume-document'` — re-exports everything but doesn't consume
   `Item`/`Reference`/`Certificate`/`Award` specifically), `types/
   resume-api.ts` (imports only `Resume`, `GeneralInformation`),
   `pages/index.vue` (imports only `Resume`), `server/utils/createPDF.ts`
   (imports all 4 types, the only real consumer). No hidden second
   consumer.
3. Read `server/utils/createPDF.ts`'s `_layoutItem` (lines 126-127),
   `renderReferences` (lines ~340-349), `renderCertificates` (lines
   353-370), `renderAwards` (lines 372-390) directly off disk:
   - `Item`: destructures `title, subTitle, startDate, endDate, isCurrent,
     description, skills` — all 7 fields on the (untouched) `Item`
     interface are used.
   - `Reference`: uses `e.fullName, e.company, e.position, e.phone` — all
     4 fields on the (untouched) `Reference` interface are used.
   - `Certificate`: destructures `organization, name, startDate, endDate,
     description, isNoExpiration` — exactly the 6 fields left on the
     trimmed interface, none extra, no `.link`/`.images` read, no spread
     of the raw `el` object that would smuggle them back in.
   - `Award`: destructures `organization, name, issueDate, description`
     — exactly the 4 fields left on the trimmed interface, same check,
     no `.link`/`.images` read.
4. `grep -n "\.link\b\|\.images\b\|link\b\|images\b"` against the real
   `createPDF.ts`: the only `.link` matches are unrelated HTML `<link
   rel=...>` tags in the PDF's HTML template (lines 404/406-409) — zero
   property reads of `.link`/`.images` off any `Certificate`/`Award`
   object. Independently reproduces the note's "0 matches" claim (the
   note's own grep pattern didn't include bare `<link`, mine did, and it
   still confirms no property access).

All 4 of the implementer's citations reproduce independently — no
discrepancy found in either the "who consumes these types" claim or the
"which fields are actually read" claim.

## Acceptance criteria — one by one
| # | Criterion | Evidence | Met? |
|---|---|---|---|
| 1 | Dedicated review pass before trimming, not a drive-by deletion | Note's Review steps 1-4 + this pass's independent re-run of the same greps, reproducing identical results | ✅ |
| 2 | Confirms whether `createPDF.ts` still needs all 4 shapes | Yes — re-confirmed `Item`/`Reference`/`Certificate`/`Award` are all still used as parameter types in `createPDF.ts`, none deleted | ✅ |
| 3 | Confirms which fields (if any) can be trimmed | Yes — re-confirmed `Certificate.link`/`.images` and `Award.link`/`.images` are declared but never destructured/read anywhere in `createPDF.ts`, independently, by reading the function bodies | ✅ |
| 4 | Diff matches exactly what's claimed (`Item`/`Reference` untouched) | `git diff HEAD -- types/resume-document.ts` reproduces the note's diff byte-for-byte; `Item`/`Reference` interfaces unchanged | ✅ |
| 5 | Build clean | Note cites `npm run build`: exit 0, `✨ Build complete!`, verbatim, not truncated | ✅ |
| 6 | Lint clean | Note cites `npm run lint`: `✖ 30 problems (0 errors, 30 warnings)`, verbatim, matches the current session baseline | ✅ |
| 7 | No visual/behavior verification needed | Correctly reasoned: TS interfaces are erased at compile time, `nuxt.config.ts` has `typescript.typeCheck: false`, so a pure type-level field removal cannot have a visual/behavior effect — no CDP evidence required for this node | ✅ |

## Forbidden-states scan
| State | Hit? | Why |
|---|---|---|
| `ADHOC_WORK` | No | Traces to the `cleanup-pdf-only-types` node, appended per `pick_next.md`'s "no diagram match yet" branch, referencing issue #142 |
| `NO_EVIDENCE` | No | Plan + diff notes exist, this seal note now exists |
| `EDIT_UNVERIFIED` | No | Build/lint output is verbatim and not truncated; the core "only consumer" / "fields unused" claims were independently re-grepped and re-read off disk by this pass, not just trusted from the note |
| `CODE_IN_HAVEN` | No | Only `haven/diagrams/dev-loop.prime-mermaid.md` (a status/notes row, not code) touched under `haven/`; the real code change is under `types/` |
| `DIAGRAM_DRIFT` | No (fixed by this seal) | Row updated IN_PROGRESS → SEALED below, in place |

No "tests pass" claim anywhere in either note — this project has no test
suite; both notes correctly say "build clean"/"lint clean" instead.

## Proportionality (`SmallestDiff`)
Diff is exactly 4 removed lines across 2 interfaces in 1 file
(`Certificate.link`/`.images`, `Award.link`/`.images`), plus 2 explanatory
comments — `Item`/`Reference` correctly left untouched since every field
on them is used. The note explicitly declined the issue's "consolidate
Certificate/Award into Item" option as out of scope (a real behavior
refactor, not a type trim) — correct call, not scope creep either way.

## Seal gate
No outward-facing action taken by either pass — no `commit`/`push`/PR.
This note only updates the diagram's PM status (an allowed verifier
action) and appends one `worker-runs.log` line, both within
`haven/workers/verifier/manifest.yaml`'s `writes:` scope.

## PM status update
`haven/diagrams/dev-loop.prime-mermaid.md`'s `cleanup-pdf-only-types` row
updated in place (`AppendOnly` — not moved/reordered) from `IN_PROGRESS`
to `SEALED`, with this verifier pass's independent re-verification summary
appended to the same row's notes cell, pointing back to this evidence
file.

## Re-run
`partial` — did not re-run `npm run build`/`npm run lint` from cold cache
(the note's output is verbatim, not truncated, matches `doctrine/
MEMORY.md`'s exact commands, and this is a pure type-only change with no
visual/behavior surface — none of the 3 "Re-run scope" exceptions in
`recipes/verify_seal.md` apply to the build/lint step itself). Did
independently re-run the `grep` sweeps this task specifically asked for
(the "only consumer"/"fields unused" claims) plus a direct read of every
relevant function body in `server/utils/createPDF.ts` off disk — not a
cold-cache rebuild, but a real, independent reproduction of the node's
core factual claim, per this task's explicit orchestrator instructions
and consistent with "Re-run scope" exception #2 (worth the
independent-confirmation cost given `createPDF.ts` backs a real
production feature, PDF generation, even though this specific diff has
no runtime footprint).

## Hub bytes before / after
- `hub_bytes_before` (reused from the implementer's plan note's own
  `## Hub bytes before` line, per step 14's "reuse, don't re-read"
  instruction): ~83191
- `hub_bytes_after` (measured via the exact script in
  `.claude/skills/hub-tokens/SKILL.md`, run AFTER the PM status update
  above): 85914

## Cleanup
No scratch files created by this pass beyond this evidence note and the
diagram edit. `git status --short` after this pass's writes shows only:
this node's own already-existing diff (unchanged by this pass), the
diagram edit made by this seal, and this new evidence file — nothing
else.
