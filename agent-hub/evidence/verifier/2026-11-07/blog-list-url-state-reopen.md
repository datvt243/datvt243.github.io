# 2026-11-07 - blog-list-url-state (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `blog-list-url-state` (#415 this repo's half + #429 + #430, branch `bug/415`, uncommitted working tree)
- Note judged: `evidence/implementer/2026-11-07/blog-list-url-state-diff.md` (+ `-plan.md`)
- Verdict: **REOPEN**
- New PM status: IN_PROGRESS

## Isolation proof
Separate Agent-tool subagent, spawned with the task string "You are the agent-hub VERIFIER for the repo at /Users/_david/Workspace/Project/resume/datvt243.github.io (branch `bug/415`, already checked out ...) You are a fresh, isolated subagent: you did NOT write this diff. Do exactly `/worker verifier` for node `blog-list-url-state` ...". Blank context. I did not write this diff and did not open it.

## Re-run
none. Audit-only. The gaps below are evidence the note doesn't have. The recipe says to REOPEN, not re-run to fill a note's holes.

## Criteria
| Criterion | Verdict | Cited / missing |
|---|---|---|
| (1) ISR `allowQuery` on `/blogs` + `/en/blogs`, emitted in Vercel output | met | `blogs-isr.prerender-config.json` and `en/blogs-isr.prerender-config.json`: `"allowQuery": [ "category", "page", "per-page", "__isr_route" ]`, `expiration: 60`. |
| (2) page/per-page in URL, reload keeps state, reactive key | met | `click "2" → URL ?page=2`; `Show: 10 → "/blogs?per-page=10" (page dropped)`; reload `{"url":"/blogs?per-page=10&page=3",...,"activePage":"3"}`; keys `blogs-posts::2:20`, `blogs-posts::3:10`. Same on `/en/blogs`. |
| (3) categories error → error text only | met | `BLOG_CAT_FAIL=1`: `/blogs catErr: vi=1 ... noCats: vi=0 en=0`, `/en/blogs catErr: ... en=1 | noCats: vi=0 en=0`. |
| (4) 500ms delay on every loading phase | met | phase2 `2ms skel=0` → `525ms skel=33` → `1027ms skel=0 ... items=60`. |
| (5) build + lint + typecheck + test | met | `build exit 0` (node + vercel presets), `lint exit 0`, `tc exit 0`, `Tests  27 passed (27)`. Commands match `doctrine/MEMORY.md`. |
| comments per code-comments.md | met (per note) | 4 comments listed, why-only, no issue refs. |
| Feature doc Behavior #3 (cited by the note), "No categories → localized 'No categories'" | **missing** | The diff changed exactly this branch (`v-else` → `v-else-if="!error"`). The note says under Noticed, not done: "An empty successful categories list ... not exercised live". The OK-case line `catLinks=1 noCats=0` is with categories present, and `catLinks=1` isn't explained when the fake serves 2 categories. |
| Feature doc Behavior #7 (cited by the note), "An empty successful result shows 'No data'" | **missing** | The `ListRender.vue` loading-state logic was rewritten (watch on idle/pending, timer reset/clear). No run shows an empty successful posts result still rendering "No data" (and no skeletons) after the rewrite. Phases 1/2 cover error and data only. |

## Missing (fix these, then re-submit)
1. Behavior #3 empty path: with the fake blog API returning `[]` for `/categories` (no error), SSR or browser output on `/blogs` and `/en/blogs` showing the localized "No categories" text present and the error text absent. Quote the counts.
2. Behavior #7 empty path: with posts returning an empty successful list (`total: 0`), a browser sample on the new build showing "No data" rendered and `skel=0` once settled.
3. Say what `catLinks` counts (the OK case reports `catLinks=1` while the fake serves 2 categories), or re-measure it as the number of category links.
Same mock setup as before (resume → mock :4199, blog API faked in-process, no real backend calls).

## Doctrine proposal
none in the note.

## Forbidden states
none hit. Node row exists, note present, outputs verbatim (no `...`/truncation), no code in `haven/`, PM row updated here.

## Seal gate
No outward action in the implementer pass (no commit/push/delete). OK.

## Proportionality
OK. 4 files, each mapped to #415/#429/#430. `layouts/blog.vue` untouched.

## Supersedes / Still open
Supersedes `none` (I grepped the active diagram: only this row for #415/#429/#430). Still open: the upstream blog API half of #415 (ignores `category`, `categoryIds: null`) is outside this repo. Accepted. The PR should reference #415, not close it.

## PM status
`blog-list-url-state`: PENDING → IN_PROGRESS with a REOPEN pointer appended to the row. Not collapsed or archived.
