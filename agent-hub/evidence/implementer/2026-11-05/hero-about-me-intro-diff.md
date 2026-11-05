# 2026-11-05 - hero-about-me-intro (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `hero-about-me-intro` (row after `api-cache-revalidate` in `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #385, created by `/todo` from the operator's request "tôi muốn đem phần aboutme ra ngoài, nằm dưới "4+ years experience ..." dưới góc nhìn review của HR và tech leader hãy cho tôi đánh giá về độ phù hợp hay không".
  - The review came first. Then the operator chose, via AskUserQuestion: replace the experienceSummary line (not keep both), and remove the about-me.md tab.
  - Branch `feature/385` is off `staging` 296d2b4, created with `gh issue develop`.
  - #383 (PR #384) is not merged yet, so this branch still shows "Hi there! I am".
- Status: `sealed_pending_verifier`

## Hub bytes before
79739 (measured before the node row was appended)

## Diff
| File | Change |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | Removed the `currentExperience`/`yearsOfExperience` computeds and their doc block, plus the `experienceSummary` `<p>`. Added `introParts` with a WHY JSDoc. It uses the same tag-stripping and `<strong>/<b>` split as the old `AboutMe.vue` `toMarkdownLine`. Added a `<p v-if="hero.introduction">` right under `> {positionDesired}`, styled `max-w-[65ch] text-sm leading-relaxed text-theme-muted mt-2`. Odd parts render as `<strong>`, all through text interpolation, with no v-html. There is no `:lang`, because the intro is fetched in the active locale (`app.config.ts:31-35`). |
| `themes/portfolio-dev/pages/resumeObject/Index.vue` | Removed the `about-me` entry from `sections` and the `<ThemeResumeObjectAboutMe>` line. Rewrote the line-7 comment, which said "hero already covers about-me" and was false before this change. |
| `themes/portfolio-dev/pages/resumeObject/AboutMe.vue` | Deleted (`git rm`). Its only user was Index.vue:103. |
| `i18n/locales/en.json`, `vi.json` | Removed `resume.aboutMeHeading` and `resume.experienceSummary`. Before the change, their only users were AboutMe.vue:124 and Hero.vue:74. |
| `.claude/rules/theme.md:77` | Shortcut list now says personal-info tabs `1`–`4` (was `5`). |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Appended the node row. |

`grep -rn "aboutMeHeading\|experienceSummary\|ResumeObjectAboutMe\|about-me\|splitHtmlIntoSentences"` (excluding node_modules/.nuxt/.output/agent-hub/public) was run before the edit. Its only hits were the lines listed above.

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test`, from the repo root.

## Output
```
build=0   (only WARN: the pre-existing components-*.js "A comment" one)
lint=0
typecheck=0 ts_errors=0
test=0    Test Files  8 passed (8) /      Tests  20 passed (20)
```

## UI
**Setup:** prod build on :4188 with `node --import redirect.mjs`. `NODE_API`/`NUXT_PUBLIC_NODE_API`/`NUXT_NODE_API` pointed at the mock on :4199. Server log: `onrender=0`.

**SSR (curl):**
```
== /    summary-line: 0 about-me.md: 0 &lt;p&gt;-in-text: 0
   intro: "Frontend Developer với hơn 4 năm kinh nghiệm xây dựng ứng dụng SPA doanh nghiệp bằng JavaScript/TypeScript, Vue.js và SAPUI5, …"
== /en  summary-line: 0 about-me.md: 0 &lt;p&gt;-in-text: 0
   intro: "Frontend Developer with 4+ years building enterprise SPAs with JavaScript/TypeScript, Vue.js and SAPUI5, …"
```
"summary-line" counts the strings `most recently at` and `gần đây nhất tại`.

**Bold split:** the mock intro has no `<strong>`, so the expression was run under node on samples:
```
'<p>Led a <strong>JS → TS</strong> migration, <b>big</b> data.</p><br/>' → ["Led a ","JS → TS"," migration, ","big"," data."]
'<p>No bold <a href=x>link</a>.</p>' → ["No bold link."]
'' → [""]
```

**Browser (Playwright MCP, tab visible):** loaded `/en?tab=about-me`, waited 1.5s, then dispatched keydown 2, 3, 4, 1 with 400ms between keys.
```
afterDeepLink: "experiences.pug"
sidebar: ["c=Contact me","d=Download CV","1=experiences.pug","2=skills.ts","3=educations.json","4=languages.json"]
key2: "skills.ts skill-group.ts ?tab=skills"   key3: "educations.json ?tab=education"
key4: "languages.json ?tab=languages"         key1: "experiences.pug "
intro: "Frontend Developer with 4+ years building enterprise SPAs wi"
```
- Console: `Total messages: 0 (Errors: 0, Warnings: 0)`.
- Screenshot at 1440×900 (scratchpad `hero-385.png`): the intro wraps to 10 lines at about 65ch under "> Frontend Developer". The tech stack and "Familiar with" rows stay above the fold, and the panel's top edge shows at about y=825.

**Not checked:** light mode, the mobile width, and the VI locale in the browser (VI was checked in SSR only).

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 intro under position, summary line gone, both locales | SSR block plus browser `intro` |
| 2 4 tabs, keys 1–4, `?tab=about-me` falls back | Browser block |
| 3 AboutMe.vue and the dead keys removed, 0 refs | Diff table plus the pre-edit grep. A post-edit rerun is left to the verifier. |
| 4 checks | Output block |
| comments per code-comments.md | One new JSDoc on `introParts` (WHY: no v-html). The removed doc block had an `(issue #179)` ref, which is now gone. The Index.vue comment was updated to the new truth. No `(#N)` added. |

## Supersedes: none
## Still open: none

## Noticed, not done
- **Not mine, not in this diff:** `server/api/{resume,github,blogs/categories,blogs/detail/[id]}.ts`, `server/utils/cacheGetPost.ts` and `server/api/generate-pdf.ts` have uncommitted `shouldBypassCache: () => import.meta.dev` / `!import.meta.dev` edits. They were written at 09:19:47, after this branch was created, by something other than this pass. They are dev-only, so they don't affect the prod build checked above. They were left untouched and must not be staged with this node.
- `?tab=about-me` stays in the URL until another tab is picked. That is the same behavior as any unknown tab value.
- The intro still opens with "Frontend Developer", which repeats the `> Frontend Developer` title right above it. Rewording it is backend content, the operator's call.
- When PR #384 merges, this node's diagram row and #383's rows both append after `api-cache-revalidate`, which is a likely merge conflict in `dev-loop.prime-mermaid.md`.

## Seal gate
none (commit/push left to `/ship`)

## Re-pass after REOPEN (`evidence/verifier/2026-11-05/hero-about-me-intro-reopen.md`)
There were no code changes in this pass, only the two missing proofs. It ran on the operator's own dev server, `http://localhost:3000` (`nuxt dev`, pid 63541, cwd = this repo, branch `feature/385`), because the operator asked for it: "tôi đang ở http://localhost:3000/en, hãy test ở đây". This server uses the operator's own env, so it is the real backend, not the mock. About 4 page loads in total.

**Criterion 1, VI locale in a real browser (Playwright, operator's tab).** Clicked `button[aria-label*="Switch language"]` on `/en` and waited for `lang=vi-VN` plus 2.5s:
```
{"vis":"hidden","url":"http://localhost:3000/","lang":"vi-VN",
 "lineAboveIntro":"> Frontend Developer — JavaScript / TypeScript · Vue.js · SAPUI5",
 "introText":"Frontend Developer với hơn 4 năm kinh nghiệm xây dựng ứng dụng SPA doanh nghiệp bằng JavaScript/TypeScript, Vu",
 "introHasTags":false,"summaryLine":false,
 "sidebar":["c=Liên hệ","d=Tải CV","1=experiences.pug","2=skills.ts","3=educations.json","4=languages.json"]}
```
- Console: `Total messages: 5 (Errors: 0, Warnings: 0)`. The 5 messages are info/log only: Vue's `<Suspense>` notice and the Nuxt DevTools banner.
- `vis: hidden`: the operator switched tabs during the wait. The locale switch had already completed (lang and url changed).
- The same run on `/en` (EN, this dev server):
  ```
  introText "Frontend Developer with 4+ years building enterprise SPAs with JavaScript/TypeScript, Vue."
  introHasTags false, summaryLine false, same 4-tab sidebar
  keys 2/3/4/1 → skills.ts / educations.json / languages.json / experiences.pug
  ```

**Criterion 3, post-edit grep (same pattern and excludes as before):**
```
themes/portfolio-dev/pages/resumeObject/Index.vue:7:// First = default tab: experience is what a recruiter looks for; the hero carries the about-me introduction.
grep_exit=0
AboutMe.vue exists=1(1=no)
```
The only hit is the rewritten prose comment, not a reference. There is no `ResumeObjectAboutMe`, `aboutMeHeading`, `experienceSummary`, `'about-me'` tab key or `splitHtmlIntoSentences` left.

**Seen on dev, not a defect of this diff:**
- In `nuxt dev`, a tab click's `?tab=` reaches the URL between 1s and 3s later. Samples: `200ms ''`, `1000ms ''`, `3000ms ?tab=skills`, and `afterEach` saw `/en?tab=skills`. The prod build on :4188 had it within 400ms.
- `select()`/`router.replace` are unchanged against `staging` (`git diff staging -- Index.vue | grep router|query` → empty). A direct `router.replace` resolves immediately.
- This was not investigated further. It is likely dev-server latency, possibly from the uncommitted dev-only `shouldBypassCache` edits.

**Real data, for the operator:** the live position is "Frontend Developer — JavaScript / TypeScript · Vue.js · SAPUI5". So the intro's opening "Frontend Developer with 4+ years … JavaScript/TypeScript, Vue.js and SAPUI5" repeats it more than the mock suggested. That is backend content.
