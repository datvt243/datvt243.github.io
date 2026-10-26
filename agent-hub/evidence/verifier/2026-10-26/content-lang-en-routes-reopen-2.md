# 2026-10-26 - content-lang-en-routes (verdict: REOPEN, pass 2)

- Worker: verifier · Version: 0.1.0
- Node: `content-lang-en-routes` (issue #289 + `/en` routeRules gap, branch `bug/289`, uncommitted)
- New PM status: unchanged (IN_PROGRESS). Nothing archived on a REOPEN.
- Notes audited: `evidence/implementer/2026-10-26/content-lang-en-routes-diff.md` (`## Supersedes` = REOPEN 1 rework), `evidence/verifier/2026-10-26/content-lang-en-routes-reopen.md`

## Isolation proof
Separate subagent spawned via the Agent tool with the task "You are the agent-hub **verifier** ... Node `content-lang-en-routes` ... The implementer reworked it (see `## Supersedes` ...) ... You did not write this change." The implementer's task string was the REOPEN 1 rework. This context did not write the diff; `git diff` of the code files was read only for steps 7 (comments) and 10 (proportionality).

## Reasoning
| Check | Result |
|---|---|
| Step 4: commands | `npm run build`, `npm run lint`, `npx nuxi typecheck` present. No "tests pass". |
| Step 5: truncation | None. My re-run matches (Raw). |
| Step 6: behavior evidence | Concrete, but it groups leaves only by "has Vietnamese letters or not" and labels every `vi:nonViText` leaf as "skill names, job titles, code-styled lines". That is incomplete: it also holds translated English UI labels (below). |
| **AC1: declared language matches content on `/` and `/en`** | **`/` met; `/en` not met.** On `/` every Vietnamese API text and every Vietnamese label in the regions is now under `vi`. Correct. On `/en` the Vietnamese API prose is now under `vi` (fixed), but the wrapper/`<article>` also covers i18n labels rendered in English, and they are now declared Vietnamese. My CDP run on `:4153` → mock `:4199`, visible leaves in `<main>`: `/en/projects` under `lang="vi"`: "Project 1", "Role: Frontend Developer", "View project", "Project 2", "Role: Full-stack Developer", "Project 3". `/en` under `lang="vi"`: "Career break — Professional development". Off-screen tabs in the same wrapper have the same issue (`AboutMe.vue` `resume.aboutMeHeading` → "About me", `resume.downloadCv` → "Download CV"). So the mismatch moved from `/en` content to `/en` labels instead of going away. |
| Diff note "Noticed, not done" | Stale. It still says the labels "now sit under `lang="en"`" on `/` and "the content dominates those regions". After the rework, those labels sit under `vi`. That is right on `/`, but on `/en` it mislabels English UI text. The trade-off the note documents is not the one the code makes. |
| AC2: `/en` route rules | Unchanged from pass 1 (`git diff nuxt.config.ts`: same 4 added rules). Pass 1 verified it on the Vercel preset. Not re-run. **Met.** |
| AC3: build/lint/typecheck | Re-run: build "◆ ✨ Build complete in 14.2s!"; lint exit 0, no output; typecheck 0 "error TS". **Met.** |
| Comments per code-comments.md | `app.config.ts` `/** */` explains WHY, has no `(#N)` refs, and is accurate for the data. The routeRules `/** */` extension is fine. **Met.** |
| Step 7b | Note has `## Supersedes` for REOPEN 1. No other #289 row. |
| Step 8: forbidden states | None hit. Row stays IN_PROGRESS, all 3 commands present, no code in haven. |
| Step 9: seal gate | No outward-facing action. |
| Step 10: proportionality | Small and in scope. The problem is placement: `:lang` is on containers that mix API data with i18n labels. |

## Missing
1. **AC1 on `/en`.** English i18n labels inside the `lang="vi"` regions: `projects.projectLabel`, `projects.role`, `projects.viewProject` (`projects/Index.vue` L78/81/97), `resume.careerBreak` (`Experiences.vue` L21), plus `AboutMe.vue`'s heading and download label. The smallest fix is either of these:
   - (a) Put `:lang="resumeContentLang"` on the elements that render API prose (project description, experience description list, education entries, about-me intro body) instead of the `<article>`/wrapper.
   - (b) Keep the wrapper and give those few label nodes `:lang="locale"`.

   Re-check `/en` and `/en/projects` for English-label leaves under `vi`, not only for Vietnamese leaves.
2. Update the diff note's "Noticed, not done" line so it matches the code's actual trade-off.

## Re-run
partial: build, lint, typecheck, and CDP on a fresh `:4153` (prod build) against mock `:4199` (mode ok). The node is outward-facing (a11y/SEO on production routes). Warm cache, no `.nuxt`/`.output` deletion. No Vercel-preset build: route rules are unchanged since pass 1. `:4153` was stopped afterwards; mock `:4199` was left running. Script: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/4e0a01cf-e1e6-4af1-827c-1ec4609b53dd/scratchpad/v289b/cdp.cjs`.

## Raw
```
CDP (visible text leaves in <main>, closest [lang] : has-Vietnamese-letters)
/            200 html vi-VN | vi-VN:viText 7 vi-VN:nonVi 19 | vi:viText 17 vi:nonVi 69
/en          200 html en-US | en-US:nonVi 25 en-US:viText 1 | vi:viText 15 vi:nonVi 71
               vi:nonVi includes "Career break — Professional development"
/projects    200 html vi-VN | vi:viText 10 ("Dự án 1","Vai trò: …","Xem dự án", descriptions) vi:nonVi 23
/en/projects 200 html en-US | vi:viText 3 (descriptions) | vi:nonVi 30 incl.
               "Project 1","Role: Frontend Developer","View project","Project 2","Role: Full-stack Developer","Project 3"
```
