# 2026-10-20 - experience-career-break (diff)

- Worker: implementer · Version: 0.1.0
- Node: `experience-career-break` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task (verbatim): `/todo #243, file api-standand.md là tôi thêm vào, hãy tính luôn nó khi ship` → issue #243 "feat(experience): hiển thị career break như LinkedIn"
- Branch: `feature/243`
- Status: `sealed_pending_verifier`

## Hub bytes before
156912 (see `experience-career-break-plan.md`)

## Diff
| File | Why |
|---|---|
| `types/resume-document.ts` | `Experience` gets optional `isCareerBreak?: boolean`, `careerBreakType?: string` (optional, so old API data still type-checks) |
| `models/Experience.ts` | `ExperienceModel` gets `isCareerBreak = false`, `careerBreakType = ''` defaults |
| `utils/ResumeAdapter.ts` | `toExperience` maps both: `Boolean(raw.isCareerBreak)`, `raw.careerBreakType ?? ''`, so missing fields fall back to `false`/`''` |
| `i18n/locales/{vi,en}.json` | `resume.careerBreak` + `resume.careerBreakTypes.*` (12 keys), copied verbatim from backend `origin/267-phn-experience-b-sung:src/locales/{vi,en}.ts` `cv.careerBreak`/`cv.careerBreakTypes`. Written via JSON round-trip, and the file was confirmed byte-identical under `JSON.stringify(_, null, 2)+'\n'` before the edit, so formatting is unchanged |
| `themes/portfolio-dev/pages/resumeObject/Experiences.vue` | A career-break entry renders `h2.career-break` "<careerBreak> — <type label>" (falls back to the bare label when the type is empty or unknown, guarded by `te()`), and skips the `p.company` line. Normal entries go through the unchanged `v-else`/`v-if` branch |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | `currentExperience` = first non-career-break entry, so "most recently at {company}" never names an empty company |
| `server/utils/createPDFAts.ts` | ATS CV title for a career break = the same label pair from the locale JSON. `Object.hasOwn` guards prototype keys (e.g. `constructor`) |

## Command
```
npm run build
npm run lint
npx nuxi typecheck
```

## Output
`npm run build` (tail, verbatim):
```
Σ Total size: 99.2 MB (80.7 MB gzip)

[@nuxt/image]  WARN  sharp binaries for darwin-arm64 cannot be found. Please report this as a bug with a reproduction at https://github.com/nuxt/image.

[nitro] ✔ You can preview this build using node .output/server/index.mjs
│
└  ✨ Build complete!
```
The only warnings are `grep -i -E "error|warn"`: `[@nuxtjs/i18n] WARN bundle.optimizeTranslationDirective…` and `[@nuxt/image] WARN sharp binaries…`. Both predate this diff (config/env, not touched here). No `error` lines other than the `error-500.mjs`/`error-*.mjs` chunk filenames.

`npm run lint` (verbatim):
```
> nuxt-app@1.3.0 lint
> eslint .

```
`npx nuxi typecheck` (verbatim, full tail, no errors):
```
[nuxt:tailwindcss] ℹ Using default Tailwind CSS file
ℹ Nuxt Icon server bundle mode is set to local
✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
```

## Browser verification
`npm run dev -- --port 3243`. Used Chrome `:9888` in an incognito context (`createBrowserContext()`, per the Vimium trap). The live API has no career-break entry yet (backend #267 isn't released), so two entries were pushed into the Pinia `resume` state client-side: `{isCareerBreak:true, careerBreakType:'travel', isCurrent:true, startDate: future, description:'<ul><li>Backpacking SEA</li></ul>'}` and `{isCareerBreak:true, careerBreakType:'bogus', startDate:1, endDate:2}`.
- vi `/`: h2 list = `["h2.career-breakNghỉ việc tạm thời — Du lịch", "h2.positionFRONTEND DEVELOPER (SAPUI5)", …, "h2.positionWEB DESGNER", "h2.career-breakNghỉ việc tạm thời"]`. First article innerText = `article.experienceh2.career-breakNghỉ việc tạm thời — Du lịchtime.period02/2027 - presentul.descriptionliBackpacking SEA`, with no `p.company` line. Hero summary = `5+ năm kinh nghiệm — gần đây nhất tại Laidon Group`, even though the career break sorts first.
- en `/en`: `h2.career-breakCareer break — Travel` … `h2.career-breakCareer break`; summary `5+ years experience — most recently at Laidon Group`.
- Screenshot of the career-break article in the experiences tab (en): `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/a9c8bcb5-b081-4c5b-a5d0-77c353aec8c4/scratchpad/cb-pane-en.png`. It shows `h2.career-break Career break — Travel` / `time.period 02/2027 - present` / `ul.description` / `li Backpacking SEA`.
- The only console errors were the pre-existing `…/api/me/<email>/visit` CORS block on localhost (visit tracker). It's unrelated to this diff, and there were no hydration warnings.

ATS template (`pageRenderAts` loaded via `jiti` with the `@` alias, entries: normal, `travel` break, `constructor`-type break):
```
vi [ 'entry-title">Nghỉ việc tạm thời — Du lịch', 'entry-title">Dev — Acme', 'entry-title">Nghỉ việc tạm thời' ]
en [ 'entry-title">Career break — Travel', 'entry-title">Dev — Acme', 'entry-title">Career break' ]
```

## Acceptance
| Criterion | Evidence |
|---|---|
| Type + model + adapter carry both fields, missing → `false`/`''` | Diff table rows 1-3; adapter `Boolean(raw.isCareerBreak)`, `raw.careerBreakType ?? ''` |
| Career break shows the vi/en label + type | Browser: `Nghỉ việc tạm thời — Du lịch` / `Career break — Travel` |
| Date range shown | Browser: `time.period02/2027 - present` |
| Description shown | Browser: `liBackpacking SEA` |
| No empty position/company line | First article innerText has no `p.company` |
| Unknown/empty type → bare label | Browser: `bogus` → `h2.career-breakNghỉ việc tạm thời` / `Career break`; ATS: `constructor` → `Career break` |
| Normal entries + old data unchanged | Browser: real API entries (no new fields) still render `h2.position…`; ATS `Dev — Acme` |
| Hero skips career breaks | Summary still `…Laidon Group` with a current career break sorted first |
| ATS PDF vi/en | ATS output above |
| build + lint + typecheck clean | Output section |
| comments per code-comments.md | 3 comments added/changed: `models/Experience.ts` JSDoc on `careerBreakType` (what the valid values are, which the type can't show), `Experiences.vue` JSDoc on `careerBreakTitle` (fallback behavior, WHY), `Hero.vue` existing block amended (why a career break is skipped). No issue refs, no narration |

## Noticed, not done
- The visit-tracker CORS error on localhost is pre-existing.
- `[@nuxtjs/i18n] optimizeTranslationDirective` warning is pre-existing.
- `API-STANDARD.md` (untracked, operator-added, relates to #244) is not part of this node. The operator asked to include it in the ship commit.

## Seal gate
None. No outward-facing action in this pass. Commit/push is `/ship`'s job.
