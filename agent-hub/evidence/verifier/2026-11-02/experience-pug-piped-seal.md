# 2026-11-02 - experience-pug-piped (verifier: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `experience-pug-piped` (#371), branch `feature/371`, uncommitted
- Notes graded: `evidence/implementer/2026-11-02/experience-pug-piped-plan.md`, `evidence/implementer/2026-11-02/experience-pug-piped-diff.md`
- New PM status: PENDING → SEALED (row collapsed to a pointer, full row appended to `haven/diagrams/dev-loop-archive.md`)

## Verdict: SEAL

## Reasoning
| Criterion | Evidence | Result |
|---|---|---|
| 1. `h2.position` (+ `h2.career-break`) and `p.skills` = tag line, then `|` text line one indent deeper, own line numbers; `p.company`/`time.period`/`li` unchanged | Rows quoted with padding: tag lines 17.23px, piped lines 34.46px, every row `::before` `counter(line)`. I opened `.playwright-mcp/experience-piped.png`: line 2 `h2.position` / line 3 `| Frontend Developer (SAPUI5 / TypeScript)`, line 13 `p.skills` / line 14 `| SAPUI5, …, Git, Jira` (wrap aligned after the `|`), line 18 `h2.career-break` / line 19 `| Nghỉ việc tạm thời — Phát triển chuyên môn`, and lines 4-5 `p.company Laidon Group` / `time.period 12/2024 - present` plus `li …` lines still on one line each | cited |
| 2. a11y: tag line + `|` `aria-hidden`; h2/p text is just the position/skills | aria-hidden `true` on tag rows, the pipe is an `aria-hidden` `.tag-label.pipe`. The a11y text is quoted: `Frontend Developer (SAPUI5 / TypeScript)` and `SAPUI5, TypeScript, JavaScript, XML Views, OData, JSONModel, Jest, Git, Jira` | cited |
| 3. mobile <48rem: tag line and `|` hidden, no indent, no `- ` marker | 375×800: `pipeShown: false`, padding `0px`, `::before` marker `none`, `h2.position:hidden`, `p.skills:hidden`. These are concrete quoted computed values (a project extension allows them in place of a screenshot) | cited |
| 4. real browser desktop + 375px, no horizontal scroll | Desktop on the operator's dev server (HMR from the working tree), `visibilityState visible`, screenshot above. 375px: `innerWidth 375`, `scrollWidth 360` | cited |
| 5. build + lint + typecheck + test clean | `◆ ✨ Build complete in 14.3s!`, lint exit 0 (`> eslint .`, no findings), typecheck exit 0 (no error lines), `Test Files  8 passed (8)` / `Tests  18 passed (18)`. Same detail level as the accepted `skills-file-tabs` and `hero-main-familiar-api` notes | cited |
| comments per code-comments.md | Row present: 1 new HTML comment giving the why (Pug piped layout), the skills comment updated, no issue refs | cited |
| Step 4 commands | `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`, as in `doctrine/MEMORY.md`. The Typecheck row has no `baseline:` | ok |
| Step 5 truncation | No command output is cut. The one `G…` shortens a UI row whose full text is quoted in the a11y line and shown in the screenshot | ok |
| 7b Supersedes/Still open | `none` / `none`. No other #371 row is on the active diagram | ok |

## Forbidden states / seal gate / proportionality
- Forbidden states: none of the 5 hit. The node exists, both notes are written, there is no code in `haven/`, and PM status is updated here (no `DIAGRAM_DRIFT`).
- Seal gate: `none`. Nothing was committed or pushed.
- Proportionality: `git status` / `git diff --stat` show only `Experiences.vue | 33 +++++++++++++++-------` (24+/10-) plus the diagram row and the two notes. That matches the note's 1-file `## Diff` table, and nothing is unclaimed.
- Carry into the PR (from `## Noticed, not done`): the UI check ran on the dev server, not a production `.output` build, though the build itself is clean. No mobile screenshot was taken because the Playwright element screenshot timed out, so mobile rests on the quoted measurements. Keep the untracked `.playwright-mcp/` out of the commit.

## Isolation proof
Spawned as a separate verifier subagent via the Agent tool. The task string starts "You are the VERIFIER worker of the agent-hub in the repo ... Node: `experience-pug-piped` ... You are a separate subagent; you did NOT write this diff." It differs from the implementer's task string (the Vietnamese #371 operator text). This context didn't write the diff and didn't open its source content. It read the two notes, the diagram row, `git status`/`git diff --stat`, the screenshot `experience-piped.png` and the hub docs.

## Re-run
none. Audit only (the default). Nothing was rebuilt, linted, tested or re-driven in the browser. None of the three exceptions applies: the change isn't outward-facing, isn't a `/release` gate, and isn't listed in PROJECT.md. Viewing an existing screenshot is not a re-run.

## PM status
- `experience-pug-piped`: PENDING → SEALED. The full row was appended to `haven/diagrams/dev-loop-archive.md` and the active row replaced by a pointer.
- Pointer cap (20): adding this pointer made 21, so I dropped the oldest pointer `blog-off-nav` (2026-10-27) from the active diagram. Its full row is already in the archive.
