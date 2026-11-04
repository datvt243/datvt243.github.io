# 2026-11-05 - resume-plain-mappers (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `resume-plain-mappers` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #304 "refactor: consider replacing Prototype models + ResumeAdapter class with plain mapping functions" (P3 audit suggestion). The operator chose to do it (AskUserQuestion in the `/todo` run). Branch `feature/304` off `staging` 2a82901 (created with `gh issue develop`).
- Status: `sealed_pending_verifier`

## Hub bytes before
79751 (measured before the node row was appended)

## Approach
Each `to*` mapper returns a plain object. The getters that lived on the model prototypes (`dateRangeLabel`, `descriptionItems`, `descriptionText`, `startDateLabel`/`endDateLabel`, `slug`, `fullName`, `links`) are now computed in the mapper as plain fields, so every consumer reads the same property names unchanged. This is safe because the store recomputes them in Pinia getters from raw `resume` state: they are never stored or serialized (the SSR payload holds only raw `resume`).

The type names `ExperienceModel` … `SocialMediaModel` stay, as `ReturnType<typeof to*>` aliases exported from `utils/ResumeAdapter.ts`. `stores/resume.ts` is their only importer, so no theme file changes.

`SocialMediaModel.links` used `Object.entries(this)`. As a plain field that would have to exclude itself, so it is now built from an explicit `urls` object with the same field order (github, linkedin, website).

## Diff
| File | Change |
|---|---|
| `models/*` (9 files) | deleted |
| `utils/cloneDeep.ts` | deleted. Its only user was `BaseModel.clone()` (grep before deleting: `utils/index.ts` export + `models/BaseModel.ts`). |
| `utils/index.ts` | drop the `cloneDeep` export |
| `utils/ResumeAdapter.ts` | class → 7 exported functions + 3 private date helpers + 7 type aliases. Field comments kept. The circular-import note is dropped (there are no models any more). |
| `stores/resume.ts` | imports the types and functions from `@/utils/ResumeAdapter`; `resumeAdapter.toX` → `toX` |
| `tests/resumeAdapter.test.ts` | the same 2 cases, plus derived labels (experience/education/project/hero) and social `links` (empty dropped, field order) |
| `haven/diagrams/dev-loop.prime-mermaid.md` | node row appended |

`git diff --stat HEAD` → `15 files changed, 154 insertions(+), 287 deletions(-)` (incl. diagram row).

## Output
Build and server use `NODE_API`/`NUXT_PUBLIC_NODE_API=http://127.0.0.1:4199` and `MY_EMAIL`/`NUXT_PUBLIC_MY_EMAIL=mock@example.com`, with GitHub tokens empty.
```
npm test → Test Files  8 passed (8) / Tests  20 passed (20)   (was 18; +2 cases)
TZ=Pacific/Honolulu   npx vitest run tests/resumeAdapter.test.ts → Tests  4 passed (4)
TZ=Pacific/Kiritimati npx vitest run tests/resumeAdapter.test.ts → Tests  4 passed (4)
npm run build → build=0, ◆ ✨ Build complete in 13.6s!
  only WARN: components-*.js (369:0): A comment "/* @__NO_SIDE_EFFECTS__ */" (pre-existing, see verifier/2026-11-05/script-csp-enforce-seal.md)
npm run lint → lint=0
npx nuxi typecheck → typecheck=0 ts_errors=0
```

## SSR identity (criterion 2)
Scratchpad `r304/`.
- **Baseline:** the `.output` built from code identical to `staging` 2a82901 (`git diff --quiet 2a82901 -- . ':!agent-hub'` → "tree == staging") with the same mock env.
- **Server:** :4188 with `node --import csp/redirect.mjs`, mock `csp/mock.mjs` on :4199.
- **Snapshot:** `snap.sh` curls 10 routes with `accept: text/html`: `/ /en /projects /en/projects /?tab=experience /en?tab=skills /?tab=education /en?tab=education /?tab=about-me /en?tab=about-me`. It replaces `/_nuxt/<hash>` with `/_nuxt/X`.
- **Baseline is stable:** two baseline snapshots 61s apart (one ISR window) matched (`snapshot stable`).
- **Baseline contains the getter output:** `tab=exp` has 4 `MM/YYYY - MM/YYYY` ranges, `present`, and education years.

After rebuilding on this branch: the raw diff differed only in the per-build id (`_payload.json?_b=<uuid>` and `buildId:"<uuid>"`; before `8dcbd25a-…`, after `a0653382-…`). With those two also normalized:
```
__tab_about-me.html 0 / __tab_education.html 0 / __tab_experience.html 0 / _.html 0 / _en_projects.html 0
_en_tab_about-me.html 0 / _en_tab_education.html 0 / _en_tab_skills.html 0 / _en.html 0 / _projects.html 0
total_diff_lines=0
```
`grep -c onrender` on both server logs → 0.

## Browser (criterion 3)
`r304/ui.mjs`: puppeteer-core, headless Chrome, fresh profile, 1440×900. It records console error/warn, any message matching `hydrat`, and `pageerror`. Verbatim from `ui.out`:
```
/ 200 hydrated=true
/en 200 hydrated=true
/projects 200 hydrated=true
/en/projects 200 hydrated=true
/?tab=education 200 hydrated=true
/en?tab=about-me 200 hydrated=true
/?tab=skills 200 hydrated=true
home {"dates":["12/2024 - present","05/2024 - 11/2024","02/2022 - 05/2024"],"social":5,"name":"VÕ TẤN ĐẠT"}
tab about-me.md true http://localhost:4188/?tab=about-me
about-me visible links: ["https://github.com/datvt243","https://www.linkedin.com/in/datvt243/","https://resume-nuxt-vert.vercel.app/","https://github.com/datvt243","https://www.linkedin.com/in/datvt243/","https://github.com/datvt243"]
tab educations.json true http://localhost:4188/?tab=education
tab skills.ts true http://localhost:4188/?tab=skills
client nav /projects true http://localhost:4188/projects project dates: ["12/2024 - present","06/2024 - 10/2026"]
console msgs 0 []
onrender=0
```
The first run of this script had a useless about-me check (it ran after the skills tab was clicked, giving `false`). It was replaced by the visible-links check above and the whole script re-run.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 `models/` gone, no class, `cloneDeep` gone, grep 0 | `ls models` → "No such file or directory"; `grep -c "class " utils/ResumeAdapter.ts` → 0; `grep -rn -E '@/models\|~/models\|cloneDeep\|resumeAdapter\.\|class ResumeAdapter'` over ts/vue/md: 37 hits, all in `agent-hub/` history (evidence notes, archive, the new node row), 0 in code |
| 2 SSR byte-identical (build id normalized) | SSR identity block |
| 3 hydrate, 0 console errors, social links + dates visible | Browser block |
| 4 unit test covers mappers incl. derived labels + `links` | `tests/resumeAdapter.test.ts`, 20/20, passes in UTC−10 and UTC+14 |
| 5 checks | Output block |
| comments per code-comments.md | WHY comments only. File doc block = why the mappers exist and compute labels here. `// The API sends null or omits…` = why `toDate` takes null/undefined. The test's `// Mid-month…` = why the dates are on the 15th. Field `/** */` docs (careerBreakType, descriptionItems, slug, descriptionText, links, dateRangeLabel) moved from the models verbatim. `toSkill`'s `'Other'` note kept, with "the model's" dropped. No `(#N)`. Opt-ins: none enabled. |

## Supersedes: none
## Still open: none

## Noticed, not done
- Type names keep the `*Model` suffix (now `ReturnType` aliases) to avoid touching names for no behavior gain. Renaming them is optional.
- Nuxt auto-imports top-level `utils/*.ts`, so `toHero`/`toSkill`/… are now auto-import names too (as `resumeAdapter` was before). The build log showed no duplicate auto-import warning.
- `agent-hub/doctrine/domains/PROJECT.md` line 107 (2026-10-26 Decisions row) says "`ResumeAdapter`" tests. It is a historical row and was left as is.

## Seal gate
none (commit/push left to `/ship`)
