# 2026-10-20 - experience-career-break (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `experience-career-break` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Verdict: **SEAL**
- New PM status: SEALED (was PENDING, row updated in place)

## Isolation proof
This pass ran as a general-purpose subagent spawned by `/todo` with the Agent tool description "Verifier pass experience-career-break". The implementer's task string was `/todo #243, file api-standand.md là tôi thêm vào, hãy tính luôn nó khi ship`. That is a different spawn and a different task string. The pass was paused at a usage limit and resumed in the same subagent context, and the diff was not authored here.

## Reasoning
Audited `evidence/implementer/2026-10-20/experience-career-break-{plan,diff}.md`. The diff itself was not opened. `git status --short` lists exactly the 8 code files in the diff table plus the diagram.

| Criterion | Cited evidence |
|---|---|
| Type + model + adapter carry both fields, missing → `false`/`''` | Diff table rows 1-3: `Boolean(raw.isCareerBreak)`, `raw.careerBreakType ?? ''` |
| vi/en label + type on `/` | Browser: `h2.career-breakNghỉ việc tạm thời — Du lịch` (vi), `h2.career-breakCareer break — Travel` (en) |
| Date range + description | Browser: `time.period02/2027 - present`, `liBackpacking SEA`. The screenshot `cb-pane-en.png` was opened and shows the same 5 lines |
| No empty position/company line | First article innerText has no `p.company` |
| Unknown/empty type → bare label | `bogus` → `h2.career-breakNghỉ việc tạm thời` / `Career break`. ATS `constructor` → `Career break` |
| Normal entries + old data unchanged | Real API entries still render `h2.positionFRONTEND DEVELOPER (SAPUI5)` …. ATS `Dev — Acme` |
| Hero skips career breaks | `5+ năm kinh nghiệm — gần đây nhất tại Laidon Group` / `…most recently at Laidon Group` with a current break sorted first |
| ATS PDF vi/en | `entry-title">Nghỉ việc tạm thời — Du lịch`, `entry-title">Career break — Travel` |
| build + lint + typecheck clean | `✨ Build complete!`. Lint `> eslint .` with no findings. `npx nuxi typecheck` printed only info lines and no errors. All 3 commands match `doctrine/MEMORY.md` |
| Verified in a real browser | Chrome `:9888` incognito context, concrete innerText quotes + screenshot path |
| comments per code-comments.md | The row is present: 3 comments (JSDoc on `careerBreakType`, JSDoc on `careerBreakTitle`, the amended Hero block). Each says WHY, with no issue refs |

- Build output is an explicit tail plus a stated `grep -i -E "error\|warn"` summary. It has no `...`/"truncated" marker. The 2 warnings (`@nuxtjs/i18n optimizeTranslationDirective`, `@nuxt/image sharp`) are pre-existing config/env and come from no file in this diff.
- Forbidden states: `ADHOC_WORK` no (the node exists). `NO_EVIDENCE` no. `EDIT_UNVERIFIED` no (no "tests pass" claim, typecheck cited). `CODE_IN_HAVEN` no (only the diagram row in `haven/`). `DIAGRAM_DRIFT` resolved by this SEAL.
- Seal gate: no outward-facing action in the note ("None").
- Proportionality: every file maps to a criterion. `API-STANDARD.md` is out of scope and was correctly left untouched.

## Re-run
none. Audit only. The node is not outward-facing and not a `/release` gate, and `PROJECT.md` names no re-run requirement for this class. The note's evidence is verbatim and concrete.
