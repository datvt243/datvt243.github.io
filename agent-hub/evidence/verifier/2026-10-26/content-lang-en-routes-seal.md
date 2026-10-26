# 2026-10-26 - content-lang-en-routes (verdict: SEAL, pass 3)

- Worker: verifier · Version: 0.1.0
- Node: `content-lang-en-routes` (issue #289 + `/en` routeRules gap, branch `bug/289`, uncommitted)
- New PM status: SEALED (row archived to `haven/diagrams/dev-loop-archive.md`, pointer left in place; oldest pointer `ui-review-239` dropped per step 12c)
- Notes audited: `evidence/implementer/2026-10-26/content-lang-en-routes-diff.md` (`## Diff (current, after REOPEN 2)`, `## Supersedes`), prior verdicts `content-lang-en-routes-reopen.md`, `content-lang-en-routes-reopen-2.md`

## Isolation proof
Separate subagent spawned via the Agent tool with the task "You are the agent-hub **verifier** ... Node `content-lang-en-routes` (#289 + `/en` routeRules gap), third pass ... The implementer took option (a) ... You did not write this change." The implementer's task string was the REOPEN 2 rework. This context did not write the diff; `git diff` of the code files was read only for steps 7 (comments) and 10 (proportionality), as the operator asked.

## Reasoning
| Check | Result |
|---|---|
| Step 4: commands | `npm run build`, `npm run lint`, `npx nuxi typecheck` present. No "tests pass". |
| Step 5: truncation | None. My re-run matches (Raw). |
| Step 6: behavior evidence | Concrete (two-way checker output, before/after). I did not rely on it alone: its label check only catches exact/prefix `en.json` matches and skips `{}`-interpolated labels. My own dump lists EVERY text node under a `vi*` lang on `/en` and `/en/projects` (whole `<body>`, hidden tabs included), for manual review. |
| **AC1: declared language matches content** | **Met.** All 4 pages: 0 Vietnamese text nodes outside `vi*` (whole body, incl. header/footer and hidden About-me/Education tabs). On `/en` the only text under `vi` is API data: hero name, the 3 About-me intro sentences, the experience bullets, the education entry, and the 3 project descriptions on `/en/projects`. No English UI label is under `vi` any more ("Project 1", "Role:", "View project", "Career break …", "About me", "Download CV" all resolve to `en-US`). The rest under `vi` is code syntax: the `li` pug-tag labels (`aria-hidden`) and the JSON keys `"school"`/`"major"`/… in the Education code block. That is the same on `/`. Skills and Languages tabs carry no `lang` and hold no Vietnamese text in the data (mock scan: Vietnamese strings exist only in introduction, name, experience/project/education descriptions, education school/major, address, career; address/career are not rendered by these pages). SSR has `<span lang="vi">` in the HTML (curl), and there are 0 console errors/warnings (no hydration mismatch) on all 4 pages. |
| REOPEN 2 missing #2 (stale "Noticed, not done") | Fixed. The note now lists the actual trade-offs (tech terms inside `vi` bullets, the PDF route, og:locale). |
| AC2: `/en` route rules | `git diff nuxt.config.ts` shows the same 4 added rules + comment as pass 1, which verified them on the Vercel preset. Not re-run. **Met.** |
| AC3: build/lint/typecheck | Re-run: build "◆ ✨ Build complete in 12.9s!" (1 pre-existing WARN); lint rc=0; typecheck rc=0, 0 "error TS". **Met.** |
| Comments per code-comments.md | `app.config.ts` `/** */` gives the WHY (single-language data, wrong voice on `/en`). The routeRules `/** */` extension gives the WHY for the `/en` twins. No `(#N)` refs. REOPEN 2 rework adds no comments. **Met.** |
| Theme rules | All markup changes are in `themes/portfolio-dev/`. `pages/*.vue` are untouched. |
| Step 7b | `## Supersedes` covers REOPEN 1 and 2. No other #289 row on the active diagram. |
| Step 8: forbidden states | None hit. |
| Step 9: seal gate | No outward-facing action (uncommitted, nothing pushed/deployed). |
| Step 10: proportionality | 5 theme files plus `app.config.ts` and `nuxt.config.ts`. Each change is 1 `useAppConfig()` line plus 1 `:lang`, except AboutMe, which wraps each sentence in a span. All in scope. |

## Missing
none.

## Re-run
partial: build, lint, typecheck, and my own CDP dump on a fresh `:4153` (prod build) against mock `:4199` (mode ok). The node is outward-facing (a11y/SEO on production routes). Warm cache. No Vercel-preset build: route rules are unchanged since pass 1. `:4153` was stopped afterwards; mock `:4199` was left running. Scripts and logs: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/4e0a01cf-e1e6-4af1-827c-1ec4609b53dd/scratchpad/v289c/` (`cdp.cjs`, `cdp.out`, `console.cjs`, `console.out`, `build.log`, `lint.log`, `tc.log`).

## Raw
```
CDP (all text nodes in <body>, hidden incl.; viBad = Vietnamese text not under vi*; underVi = every text under vi* on /en*)
/            200 html vi-VN | viBad [] | lang els: H1=vi, SPAN=vi ×3, UL=vi ×5, DIV=vi
/en          200 html en-US | viBad [] | underVi: "Võ Tấn Đạt", 3 intro sentences, experience bullets (+ "li" tag labels),
               education block ("school","Trường Cao đẳng Kỹ thuật Cao Thắng","major","Công nghệ Thông tin",
               "startDate","09/2011","endDate","07/2014","description","Cao đẳng, Công nghệ Thông tin")
/projects    200 html vi-VN | viBad [] | lang els: P=vi ×3
/en/projects 200 html en-US | viBad [] | underVi: the 3 project descriptions only
console errors/warnings: / [] /en [] /projects [] /en/projects []
curl /en: <span lang="vi">Frontend Developer với hơn 4 năm kinh ng…
```
