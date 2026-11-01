# 2026-11-01 - projects-readable-mobile (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `projects-readable-mobile` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #297 "feat(projects): turn projects into short case studies and add this portfolio". Operator scope: UI/code part only, no invented resume content. Branch `feature/297` off `staging` 4f4d858.
- Status: `sealed_pending_verifier`

## Hub bytes before
80106 (measured before the node row was appended)

## Approach
- Description: removed `line-clamp-3` so the full text always shows. The operator gave an expand/collapse control as an example only. With today's descriptions (1-2 sentences, 3-6 lines at 390px) a toggle would add JS overflow measuring and a button that does nothing on short entries. Showing the full text is less code and makes every description readable.
- Slug: dropped the `// _{{ p.slug }}` suffix. The label is now just `Project N`.
- Filter: new optional `collapseBelowLg` prop on `ThemeFolder`, passed through `ThemeFilterFolder`, and set only on `/projects`. Below `lg` (the breakpoint where `ThemePanel` stacks the sidebar above the content) the list starts closed. At `lg` and above it starts open, as before. SSR can't know the viewport, so the list renders with `hidden lg:block` until mount, then `matchMedia('(min-width: 64rem)')` sets the real state. This avoids a layout shift. The toggle stays the existing `<button aria-expanded>`. Other users of `ThemeFolder`/`ThemeFilterFolder` (`/github`) get the prop's default `false`, so nothing changes for them.

## Acceptance criteria
1. On `/en/projects`, no description is truncated: no `line-clamp`, and `scrollHeight <= clientHeight` for every description at 390px and 1440px.
2. No raw slug (`_aihr-…`) in the rendered page.
3. At 390px the tech filter list starts collapsed, so the first project sits right under the filter header. The button toggles it by click and by keyboard (Enter), `aria-expanded` matches the state, and filtering still works.
4. At 1440px the filter starts open, as before.
5. build + lint + typecheck + `npm test` clean; no console errors.

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/projects/Index.vue` | drop `line-clamp-3`, drop `_slug` label, pass `collapse-below-lg` |
| `themes/portfolio-dev/components/FilterFolder.vue` | forward the optional `collapseBelowLg` prop to `ThemeFolder` |
| `themes/portfolio-dev/components/Folder.vue` | `collapseBelowLg`: `null` (unresolved) state, CSS-driven before mount, resolved by `matchMedia` on mount |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | node row appended |

## Command
`npm run lint`, `npx nuxi typecheck`, `npm test`, `npm run build` (repo root, Node v24.19.0; build with `NODE_API` and `NUXT_PUBLIC_NODE_API` = `http://127.0.0.1:4199` mock)

## Output
```
> nuxt-app@1.8.0 lint
> eslint .
lint=0

npx nuxi typecheck → typecheck=0 ; grep -c "error TS" → 0

 Test Files  6 passed (6)
      Tests  14 passed (14)

npm run build → build=0
◆ ✨ Build complete in 13.8s!
```
The prod server (`PORT=4188`, `NODE_API` and `NUXT_PUBLIC_NODE_API` = mock :4199, mock = `mock2.py` + `me2-{vi,en}.json` copied from the 2026-10-31 session scratchpad): `grep -c onrender srv.log` → `0`, checked both before and after the browser run.

SSR HTML of `/en/projects` (`curl | grep -o '_aihr[^<]*\|line-clamp-3\|hidden lg:block' | sort | uniq -c`):
```
   1 hidden lg:block
```
(no `_aihr…` slug, no `line-clamp-3`)

## Browser verification
puppeteer-core, headless Chrome, fresh profile (no extensions), `bringToFront()` + `document.visibilityState` checked (`"visible"`). Script: scratchpad `check.mjs`. Verbatim:
```
390px loaded {"vis":"visible","ariaExpanded":"false","listDisplay":"none","firstArticleTop":147,"labels":["Project 1","Project 2","Project 3"],"descs":[{"clipped":false,"clamp":"none","lines":6},{"clipped":false,"clamp":"none","lines":3},{"clipped":false,"clamp":"none","lines":4}]}
390px after toggle click {"vis":"visible","ariaExpanded":"true","listDisplay":"block","firstArticleTop":611,...}
390px after Enter {"vis":"visible","ariaExpanded":"false","listDisplay":"none","firstArticleTop":147,...}
390px after picking first tech {"vis":"visible","ariaExpanded":"true","listDisplay":"block","firstArticleTop":656,"labels":["Project 1"],"descs":[{"clipped":false,"clamp":"none","lines":4}]}
1440px loaded {"vis":"visible","ariaExpanded":"true","listDisplay":"block","firstArticleTop":111,"labels":["Project 1","Project 2","Project 3"],"descs":[{"clipped":false,"clamp":"none","lines":4},{"clipped":false,"clamp":"none","lines":2},{"clipped":false,"clamp":"none","lines":3}]}
1440px after toggle click {"vis":"visible","ariaExpanded":"false","listDisplay":"none","firstArticleTop":111,...}
console errors/warnings: []
```
At 390px, SimpleMDG's description is 6 lines. Before this change `line-clamp-3` cut it at 3. With the filter collapsed, the first project starts at y=147 instead of y=611.
Screenshots (scratchpad, not committed): `projects-390.png`, `projects-1440.png`, `projects-390-open-filtered.png`. Checked visually at 390px: collapsed `PROJECTS` folder header, full descriptions, `Project N` labels with no slug.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 full description | `"clipped":false,"clamp":"none"` for all 3 at 390 and 1440; SSR grep has no `line-clamp-3` |
| 2 no raw slug | labels `["Project 1","Project 2","Project 3"]`; SSR grep has no `_aihr` |
| 3 mobile collapsed + toggle + a11y | `390px loaded` `ariaExpanded:"false"`, `listDisplay:"none"`, top 147; click → `"true"`/`block`; Enter → `"false"`/`none`; filter pick → 1 project |
| 4 desktop unchanged | `1440px loaded` `ariaExpanded:"true"`, `listDisplay:"block"` |
| 5 checks | Output block; `console errors/warnings: []` |
| comments per code-comments.md | one WHY block in `Folder.vue` (why `null` + CSS before mount); no WHAT/issue refs |

## Supersedes: none

## Still open
- #297 stays open for the content part (problem/role/decisions/result case-study text, the "This portfolio" entry, screenshots). The PR must NOT use `Closes #297`; use `Refs #297`.

## Noticed, not done
- Case-study content, a "This portfolio" project entry, real screenshots, and project text that duplicates the experience section all depend on resume backend data. Out of scope (operator: no invented content).
- Placeholder thumbnails ("MDG"/"AiHR") left unchanged. No trivial improvement found.
- `Project.slug` getter (`models/Project.ts:17`) has no caller left. Kept so the model stays unchanged.
- `/github` has the same filter-above-list layout on mobile. Not changed (scope is `/projects`), but adding `collapse-below-lg` there would be a one-attribute follow-up.
- Not tested: `/vi/projects` (same component), light mode.

## Seal gate
none (no commit/push/PR; left to the operator)

## Correction (REOPEN round 1, 2026-11-01)
Responds to `evidence/verifier/2026-11-01/projects-readable-mobile-reopen.md`. No code changed. Everything above stays as written. The first run's output had only been printed, never saved to a file, so I re-ran it.

The re-run used the same `.output` prod build (built with mock env, code unchanged since) and a fresh headless profile (`prof/` deleted first). The server ran on `PORT=4188` with `NODE_API` and `NUXT_PUBLIC_NODE_API` = mock `http://127.0.0.1:4199`. The only change to `check.mjs` is that it also prints raw `sh`/`ch`. Its `clipped` expression, verbatim (line 13):
```
const descs = [...document.querySelectorAll('article p.max-w-2xl')].map((p) => ({ sh: p.scrollHeight, ch: p.clientHeight, clipped: p.scrollHeight > p.clientHeight, clamp: getComputedStyle(p).webkitLineClamp, lines: Math.round(p.clientHeight / parseFloat(getComputedStyle(p).lineHeight)) }))
```
So `"clipped":false` means `scrollHeight <= clientHeight`, which is criterion 1 as written.

Full output (`node check.mjs > check-out.txt; echo exit=$?`), verbatim and complete:
```
exit=0
390px loaded {"vis":"visible","ariaExpanded":"false","listDisplay":"none","firstArticleTop":147,"labels":["Project 1","Project 2","Project 3"],"descs":[{"sh":120,"ch":120,"clipped":false,"clamp":"none","lines":6},{"sh":60,"ch":60,"clipped":false,"clamp":"none","lines":3},{"sh":80,"ch":80,"clipped":false,"clamp":"none","lines":4}]}
390px after toggle click {"vis":"visible","ariaExpanded":"true","listDisplay":"block","firstArticleTop":611,"labels":["Project 1","Project 2","Project 3"],"descs":[{"sh":120,"ch":120,"clipped":false,"clamp":"none","lines":6},{"sh":60,"ch":60,"clipped":false,"clamp":"none","lines":3},{"sh":80,"ch":80,"clipped":false,"clamp":"none","lines":4}]}
390px after Enter {"vis":"visible","ariaExpanded":"false","listDisplay":"none","firstArticleTop":147,"labels":["Project 1","Project 2","Project 3"],"descs":[{"sh":120,"ch":120,"clipped":false,"clamp":"none","lines":6},{"sh":60,"ch":60,"clipped":false,"clamp":"none","lines":3},{"sh":80,"ch":80,"clipped":false,"clamp":"none","lines":4}]}
390px after picking first tech {"vis":"visible","ariaExpanded":"true","listDisplay":"block","firstArticleTop":656,"labels":["Project 1"],"descs":[{"sh":80,"ch":80,"clipped":false,"clamp":"none","lines":4}]}
1440px loaded {"vis":"visible","ariaExpanded":"true","listDisplay":"block","firstArticleTop":111,"labels":["Project 1","Project 2","Project 3"],"descs":[{"sh":80,"ch":80,"clipped":false,"clamp":"none","lines":4},{"sh":40,"ch":40,"clipped":false,"clamp":"none","lines":2},{"sh":60,"ch":60,"clipped":false,"clamp":"none","lines":3}]}
1440px after toggle click {"vis":"visible","ariaExpanded":"false","listDisplay":"none","firstArticleTop":111,"labels":["Project 1","Project 2","Project 3"],"descs":[{"sh":80,"ch":80,"clipped":false,"clamp":"none","lines":4},{"sh":40,"ch":40,"clipped":false,"clamp":"none","lines":2},{"sh":60,"ch":60,"clipped":false,"clamp":"none","lines":3}]}
console errors/warnings: []
onrender=0   (grep -c onrender srv.log, after the run)
```
For every description at 390px and 1440px, in every state, `sh == ch` (e.g. SimpleMDG at 390px: `"sh":120,"ch":120`, 6 lines), which passes criterion 1. Every other field matches the first run. The 3 previously elided lines are shown in full above.

Verifier's non-blocking items: `/vi/projects` and light mode are still unchecked (listed in Noticed, not done). The untracked `review/` and `.playwright-mcp/` folders were there before this node (they show in the session's starting git status) and are not part of this node. Keep them out of the commit.
