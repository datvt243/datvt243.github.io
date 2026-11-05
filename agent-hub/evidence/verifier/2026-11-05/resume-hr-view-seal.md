# 2026-11-05 - resume-hr-view (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `resume-hr-view` (#397, branch `feature/397`, uncommitted working tree)
- New PM status: SEALED (row archived to `haven/diagrams/dev-loop-archive.md`; oldest pointer `projects-readable-mobile` trimmed, its full row already in the archive)
- Notes audited: `evidence/implementer/2026-11-05/resume-hr-view-plan.md`, `resume-hr-view-diff.md`

## Isolation proof
Separate Agent-tool spawn with the task string "You are the VERIFIER worker of the agent-hub ... (run `/worker verifier` semantics yourself; you have a fresh context, separate from the implementer)". This context did not write the diff; it saw the implementer's work only through the two notes and its own browser re-run.

## Reasoning
| Criterion (issue #397 / node row) | Evidence | Status |
|---|---|---|
| (1) Dev/HR switch next to light/dark, vi + en label | Note: en `"Switch to HR view (plain resume)"`, vi `"Chuyển sang chế độ HR (CV thông thường)"`. Re-run: header button order `["Keyboard shortcuts","EN, Switch language","Switch to developer view","Switch to light mode","Open menu"]` (switch sits right before light/dark); text `DEV/HR`; after toggle, en `"Switch to developer view"`, vi `"Chuyển sang chế độ developer"`; at 375px rect `[154,0,81,44]`, visible | cited + reproduced |
| (2) Default Dev; existing UI + `?tab=` deep links | Re-run: `curl /en` SSR HTML → `experiences.pug` count 1, no `<h2 class=hr-heading>` (only hit is the scoped CSS rule). `/en?tab=skills` → `.editor-scope` present, tablist `"skills.ts skill-group.ts"`; switching back from HR restores the same tablist with `?tab=skills` kept | cited + reproduced |
| (3) HR view: experience, skills, education, languages, desktop + mobile | Re-run: h2s `["EXPERIENCE","SKILLS","EDUCATION","LANGUAGES"]` at 1280 (scrollWidth 1265 = clientWidth 1265) and 375 (360 = 360). Screenshots `.playwright-mcp/verify-hr-dark-1280.png` (full page), `verify-hr-light-375.png`, `verify-hr-light-375-sections.png`. The education entry shows `College Diploma, Information Technology` once, which covers the description-vs-major edit the note says came after its own screenshots | cited + reproduced |
| (4) No refetch, ISR safe | Re-run: `/api/resume` resource entries = 0 before toggle, after toggle, and after the round trip; `/api/` resources after toggle = `["/api/visit"]` only. SSR renders Dev (row 2). Note: state is `useState` default `dev`, no cookie/query | cited + reproduced |
| (5) Light + dark | Re-run: dark `html.dark`, body `rgb(2, 6, 23)`, h2 `rgb(251, 146, 60)`; light `html.light`, body `rgb(255, 255, 255)`, h2 `rgb(194, 65, 12)`; both readable in screenshots | cited + reproduced |
| Off-`/` switch goes home (note's design) | Re-run vi `/projects` → click → path `/`, h2s `["KINH NGHIỆM LÀM VIỆC","KỸ NĂNG","HỌC VẤN","NGOẠI NGỮ"]` | reproduced |
| build + lint + typecheck + test | Note Output: `lint=0`, `typecheck=0`, `Test Files  8 passed (8)` / `Tests  20 passed (20)`, `build=0`, `◆ ✨ Build complete in 13.8s!`; same exit-code format the prior seals accepted (e.g. `ats-pdf-address-label`). Commands match `doctrine/MEMORY.md`. My own mock build: `build=0`, `◆ ✨ Build complete in 14.0s!` | cited (+ build reproduced) |
| Comments per code-comments.md | Note row: `/** @file */` WHY in `useResumeView.ts` (ISR reason), one-line `//` WHY in Header, `Hr.vue` overview + `/** */` on `careerBreakTitle`, no issue refs | cited |

- Forbidden states: none hit. Node row existed (no `ADHOC_WORK`), notes present (no `NO_EVIDENCE`), verified (no `EDIT_UNVERIFIED`), no code in `haven/`, PM status now updated (no `DIAGRAM_DRIFT`).
- Seal gate: no outward-facing action in the implement pass (`none`, no commit/push), so none was needed.
- Proportionality: the files listed (composable, header, Index.vue `v-if`/`v-else`, new Hr.vue, two locale files) are what the five criteria need. The off-`/` navigate is required for a header switch that shows on every page. "Noticed, not done" items (`careerBreakTitle` duplication, no persistence) were correctly left out.
- Supersedes / Still open: `none` / `none`. No other open row for #397 on the active diagram.

## Re-run
partial. Reason: user-facing exception (a new view and header control on the live site's home page, same precedent as `ats-pdf-address-label-seal.md`). Re-ran: `NODE_API=http://localhost:4599 NUXT_PUBLIC_NODE_API=http://localhost:4599 npm run build` (build=0), `node .output/server/index.mjs` on :3498 with the same env against the local mock (`python3 -I mock.py`, :4599, saved live JSON), `curl /en`, and the Playwright checks above (new tab selected, `visibilityState: "visible"`). `grep -c onrender verify-server.log` → `0`. Servers stopped after. Did not re-run lint/typecheck/`npm test`: the note's results are verbatim and the source hasn't changed since.
