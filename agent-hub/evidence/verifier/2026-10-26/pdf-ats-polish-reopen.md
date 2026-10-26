# 2026-10-26 - pdf-ats-polish (verdict: REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `pdf-ats-polish` (issue #284, branch `bug/284`, git worktree `scratchpad/wt284`)
- New PM status: unchanged (IN_PROGRESS). Nothing is archived on a REOPEN.
- Notes audited: `evidence/implementer/2026-10-26/pdf-ats-polish-plan.md`, `evidence/implementer/2026-10-26/pdf-ats-polish-diff.md`

## Isolation proof
This pass ran as a separate subagent, spawned through the Agent tool with the task "You are the agent-hub **verifier** for the Nuxt 4 portfolio repo. This change lives in a separate **git worktree** ... Node `pdf-ats-polish`, issue #284 ... You did not write this change." The implementer's task was issue #284 (plan note). This context did not write the diff. The operator's spawn prompt asked me to check every consumer of `pageRenderAts`/`useDownloadResume` and the comments, so I did read the code diff (`git diff`) for that. My verdict rests on the evidence below, not on reading the code alone.

## Reasoning
| Check | Result |
|---|---|
| Step 4: commands match `doctrine/MEMORY.md` | `npm run build`, `npm run lint`, `npx nuxi typecheck`. No "tests pass". |
| Step 5: truncation | Key lines quoted. My re-run reproduces them (below). |
| Step 6: behavior evidence | Concrete: header, per-page line counts, glyph counts, download name. Reproduced below. |
| AC1: no missing glyph | Re-run: en/vi `arrows 0 \| "->" 2 \| replacement-char 0` (baseline `arrows 2`). Met. |
| AC2: no orphan heading | Re-run: page 1 ends in body text, page 2 ends `Stack: HTML5, Pug, SCSS, Grunt`, page 3 starts `PROJECTS` / `DỰ ÁN`. No heading is the last line of a page. Met. |
| AC3: file name | Re-run: `Content-Disposition: attachment; filename="Vo-Tan-Dat-CV.pdf"` (en and vi). CDP click on hero "Download CV" gives `{"dl":["Vo-Tan-Dat-CV.pdf"],"errs":[]}`. Met. |
| AC4: skills grouped, tab unchanged | PDF: 10 group lines (`Languages:` … `Familiar with:`), was 1 flat line. Old inline Skills.vue rule vs new `groupSkills` on the mock data (43 skills, 0 listed groups, 0 without a group): `identical true`. The one difference is a skill with no `group`: the old code made a `null` label group, the new code puts it under `Other`. That is a fix, and the current data does not have this case. CDP screenshot `scratchpad/p1/v-skills.png`: `skills.ts` renders the enum and the groups as before. Met. |
| **#284 acceptance "PDF ≤ 2 trang"** | **Not met.** Re-run: 3 pages (38 / 38 / 21 lines), both langs. The note says so openly. I agree that layout alone cannot reach 2 pages: the note's 10pt / 12mm try still gives 3 pages, and 21 lines is half a page of content. What is left is content. The data has 3 jobs + 2 career breaks + 3 projects (2 of them repeat jobs), and each job's `description` already ends with a `Stack:` paragraph, so `Stack:` is printed twice for each of the 3 jobs. The operator edits that data by hand, so it is out of this node's scope. But the plan replaced the issue's criterion with "report honestly", and the note has no `## Still open` line handing the 2-page item over. A PR with `Closes #284` would close the issue with its checkbox unmet. |
| **Comments per code-comments.md** | **Rule violation.** `server/utils/createPDFAts.ts`: `// The download's file name: the person's name in ASCII, e.g. "Vo-Tan-Dat-CV".` says WHAT the next line does (name + "CV", diacritics stripped, dashes), not WHY. The standard's Delete list has "Says WHAT instead of WHY", and the note's row calls it "WHY only". The other three comments are fine: the arrow `/** */` (Vercel Chromium has no glyph), the client `//` (reuse the server's name, no second rule), and the moved `groupSkills` `/** */`. |
| Consumers | `pageRenderAts`: one caller, `server/api/generate-pdf.ts`. The fresh path and the cache-hit path both use `fileName`. `useDownloadResume`: `Hero.vue` and `AboutMe.vue` (`onBioClick` → `downloadResume()`). Both still work. The fetch is same-origin, so `Content-Disposition` is readable. The `useResumeStore` it dropped is not used elsewhere. `groupSkills`: `Skills.vue` and `createPDFAts.ts`. |
| Step 7b: Supersedes / Still open | No other #284 row on the active diagram. |
| Step 8: forbidden states | ADHOC_WORK: no, the node row exists. NO_EVIDENCE: no. EDIT_UNVERIFIED: no, typecheck is cited. CODE_IN_HAVEN: no. DIAGRAM_DRIFT: no. |
| Step 9: seal gate | No commit, push or PR. "none" is acceptable. |
| Step 10: proportionality | 6 files, all named by the issue's 4 points. Minor: `groupSkills`'s `other = 'Other'` parameter is never passed by either caller, so it is unused flexibility. Not a REOPEN reason on its own. |

## Re-run
full. The operator's spawn prompt asked for an independent re-run, and the PDF is outward-facing (the recruiter download). In the worktree, with `scratchpad/p0/env.sh` sourced:
```
npm run build → rc=0, "◆ ✨ Build complete in 13.6s!", 0 ERROR, 1 WARN (components-*.js (369:0): A comment, pre-existing)
npm run lint → rc=0, "> eslint ." only
npx nuxi typecheck → rc=0, 0 "error TS"
server :4160 (.output) → mock :4199 (mode ok, already running, left up)
en: Content-Disposition: attachment; filename="Vo-Tan-Dat-CV.pdf"
    pages 3 | p1 38 lines last 'module legacy liên quan và viết unit test bằng Jest cho busi'
            | p2 38 lines last 'Stack: HTML5, Pug, SCSS, Grunt' | p3 21 lines first 'PROJECTS'
    arrows 0 | "->" 2 | replacement-char 0
vi: same file name; pages 3 (38/38/21), p3 first 'DỰ ÁN'; arrows 0 | "->" 2 | replacement-char 0
baseline base-en: pages 3 (40/37/15), arrows 2, 'Skills: JavaScript (ES6+), TypeScript, …' one line
groupSkills vs old rule (scratchpad/p1/v-group.mjs): skills 43 listed 0 nogroup 0 groups 10 identical true
CDP :9888 incognito /en (scratchpad/p1/v-cdp.cjs): {"dl":["Vo-Tan-Dat-CV.pdf"],"errs":[]}, screenshot scratchpad/p1/v-skills.png
```
The real resume backend was not called at runtime. The :4160 server is stopped.

## Missing
1. Comment: delete the `// The download's file name: …` line in `server/utils/createPDFAts.ts`, or rewrite it as a WHY. Then fix the comments row in the note.
2. #284's "PDF ≤ 2 trang": add a `## Still open` line to the diff note. It must say that this criterion is not met by this node, give the reason (content length, owned by the operator's manual data edits; layout alone gives 3 pages even at 10pt), and say that the PR uses `Refs #284`, not `Closes #284`, unless the operator accepts closing the issue without it. No code change is needed for this item.

All other criteria passed on re-run. This is a note fix plus a one-line comment fix, so the next pass needs only a partial re-run (lint + typecheck).

## Noticed, not done
- Each job's `Stack:` line is printed twice: once from the `description` HTML and once from `skills`. This costs 3 lines and is the cheapest content saving for the 2-page goal. Fix it in the data (drop the paragraph from `description`) or as a separate node.
- The `en` PDF body is Vietnamese, because the data has one language. This is a data matter.
