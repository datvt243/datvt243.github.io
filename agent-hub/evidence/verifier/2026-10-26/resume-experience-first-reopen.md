# 2026-10-26 - resume-experience-first (verdict: REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `resume-experience-first` (issue #295, branch `feature/295`)
- New PM status: unchanged (IN_PROGRESS). Nothing is archived on a REOPEN.
- Notes audited: `evidence/implementer/2026-10-26/resume-experience-first-plan.md`, `evidence/implementer/2026-10-26/resume-experience-first-diff.md`

## Isolation proof
This pass ran as a separate subagent, spawned through the Agent tool with the task "You are the agent-hub **verifier** ... Node: `resume-experience-first`, issue #295 ... You did NOT write this change; judge it independently." The implementer's task was issue #295 "show Experience first" (plan note). This context did not write the diff. I did not open `git diff`. I only ran `git diff --stat` and read the current `Index.vue` to get the tab keys for the deep-link checks.

## Reasoning
| Check | Result |
|---|---|
| Step 4: commands match `doctrine/MEMORY.md` | `npm run build`, `npm run lint`, `npx nuxi typecheck`. No "tests pass". |
| Step 5: truncation | Each command gives its key line. My re-run reproduces them (below). |
| Step 6: behavior evidence | Concrete: tab order, entry `top` px values, screenshot paths. Reproduced below. |
| AC1: role visible on first load without a click (1440 & 390) | **1440 `/` and `/en`:** active tab `experiences.pug`, entry "Frontend Developer (SAPUI5 / TypeScript)" at top 641 of 900 (visible). **390 `/` and `/en`:** Experience is the active tab, but its first entry is at top 1063 of 844, so it is below the fold. The current role still shows in the viewport through the hero: "> Frontend Developer" and "4+ years experience — most recently at Laidon Group" (top 341; screenshot `scratchpad/v295/390-en.png`). That hero line was already there and this diff did not add it. At 390 the criterion is met by that line, and the Experience content is now one scroll away instead of a click. The implementer's 390 claim is accurate and openly stated. Moving the sidebar is #298. |
| AC2: deep links + shortcuts 1–5 | `?tab=experience` → clean `/en`, Experience. `about-me`/`skills`/`education`/`languages` → that tab's label, with the query kept. `?tab=bogus` → Experience. Keys on `/`: 2→`?tab=about-me`, 3→`?tab=skills`, 4→`?tab=education`, 5→`?tab=languages`, 1→`/` Experience. `data-shortcut` order: `1:experiences.pug,2:about-me.md,3:skills.ts,4:educations.json,5:languages.json`. |
| Back/Forward sync | With router push: `/?tab=education` → `/?tab=about-me`. Back → `educations.json`, back → `/` `experiences.pug`, forward → `educations.json`. |
| AC3: build/lint/typecheck | Re-run, all clean (below). |
| **Comments per code-comments.md** | **Missing.** The note's `## Acceptance` table has no "comments per code-comments.md" row. The standard's Enforcement says: "Verifier: that row missing ... → REOPEN". The diff note does mention "one `//` WHY line". I saw the comment in `Index.vue` while reading the keys ("First = default tab: experience is what a recruiter looks for, and the hero already covers about-me."), and it looks compliant. The gate needs the row in the note, though. My reading of the source does not replace it. |
| Step 7b: Supersedes / Still open | The active diagram has no other #295 row. |
| Step 8: forbidden states | ADHOC_WORK: no, the node row exists. NO_EVIDENCE: no. EDIT_UNVERIFIED: no, typecheck is cited. CODE_IN_HAVEN: no. DIAGRAM_DRIFT: no. |
| Step 9: seal gate | No commit, push or PR. "none" is acceptable. |
| Step 10: proportionality | `git diff --stat`: `Index.vue` 3 lines, diagram 1 line. In proportion. |

## Re-run
full. The operator's spawn prompt asked for an independent re-run, and the change is visitor-facing: it is the default view of `/`. With `scratchpad/p0/env.sh` sourced:
```
npm run build → "◆ ✨ Build complete in 17.9s!"
npm run lint → "> eslint ." only, rc=0
npx nuxi typecheck → rc=0, 0 "error TS"
CDP :9888 (incognito; server :4144 → mock :4199 mode ok), script scratchpad/v295/run.cjs + hist.cjs:
[1440,"/",  {"active":"experiences.pug","role":"641/900","expVisible":true}]
[1440,"/en",{"active":"experiences.pug","role":"641/900","expVisible":true}]
[390,"/",   {"active":"experiences.pug","role":"1063/844","expVisible":true}]
[390,"/en", {"active":"experiences.pug","role":"1063/844","expVisible":true}]
deep experience→/en experiences.pug | about-me→/en?tab=about-me about-me.md | skills→skills.ts | education→educations.json | languages→languages.json | bogus→experiences.pug
keys 2,3,4,5,1 → about-me.md, skills.ts, educations.json, languages.json, / experiences.pug
history push education, about-me; back education; back / experiences; fwd education
```
Screenshots: `scratchpad/v295/{1440,390}-{vi,en}.png`. The real resume backend was not called. The :4144 server and the :4199 mock are stopped.

## Missing
- The `## Acceptance` row "comments per code-comments.md" (`doctrine/standards/code-comments.md` Enforcement). To fix, add that row to the diff note and cite the one `//` line. No code change is needed. Everything else checked out on re-run.
