# 2026-11-07 - blog-list-url-state (verdict, round 2)

- Worker: verifier · Version: 0.1.0
- Node: `blog-list-url-state` (#415 this repo's half + #429 + #430, branch `bug/415`, uncommitted working tree)
- Note judged: `evidence/implementer/2026-11-07/blog-list-url-state-diff.md`, re-read from disk, incl. `## Re-pass after REOPEN (round 1)`
- Previous verdict: `evidence/verifier/2026-11-07/blog-list-url-state-reopen.md`
- Verdict: **SEAL**
- New PM status: SEALED

## Isolation proof
Round 2 of the same verifier subagent, resumed by the coordinator's message "Round 2 for node `blog-list-url-state`: re-read `agent-hub/evidence/implementer/2026-11-07/blog-list-url-state-diff.md` from disk (new section `## Re-pass after REOPEN (round 1)` ...) ... (`spawn=resumed`)". Round 1 was spawned fresh with the task string "You are the agent-hub VERIFIER ... you did NOT write this diff". My context holds only my round-1 verdict, not the implementer's reasoning. I did not write or open the diff.

## Re-run
none. Audit-only. The re-pass note supplies verbatim evidence for each round-1 missing item.

## Criteria
| Criterion | Verdict | Cited |
|---|---|---|
| (1) ISR `allowQuery` on both rules, in Vercel output | met | `blogs-isr.prerender-config.json` / `en/blogs-isr.prerender-config.json`: `"allowQuery": [ "category", "page", "per-page", "__isr_route" ]`. |
| (2) URL state + reactive key | met | `?page=2`; `"/blogs?per-page=10" (page dropped)`; reload `"activePage":"3"`; keys `blogs-posts::2:20`, `blogs-posts::3:10`; same on `/en/blogs`. |
| (3) categories error → error text only | met | `[BLOG_CAT_FAIL=1]` `catLinks=0 noCats(vi|en)=0 catErr(vi|en)=1` on both locales. |
| (4) 500ms on every loading phase | met | phase2 `2ms skel=0` → `525ms skel=33` → `1027ms ... items=60`. |
| (5) build + lint + typecheck + test | met | `build exit 0` (both presets), `lint exit 0`, `tc exit 0`, `Tests  27 passed (27)`. The re-pass changed no code ("No code change, only measurements", same `.output`), so these still hold. |
| comments per code-comments.md | met (per note) | 4 why-comments, no issue refs. |
| Behavior #3 empty path (round-1 missing 1) | met | `[BLOG_CAT_EMPTY=1]` `/blogs ... noCats(vi|en)=1 catErr(vi|en)=0`, `vi-noCats=1 en-noCats=0`; `/en/blogs` `vi-noCats=0 en-noCats=1`. |
| Behavior #7 "No data" (round-1 missing 2) | met | `BLOG_POSTS_EMPTY=1` settled `{"skel":0,"noData":"Không có dữ liệu","items":0}` / `{"skel":0,"noData":"No data","items":0}`, both from SSR and client nav. |
| `catLinks` meaning (round-1 missing 3) | met | Now counts `href` values containing `category=`. OK case `catLinks=2` matches the fake's 2 categories. The old `1` was a `category=vue` grep. |

## Doctrine proposal
none.

## Forbidden states
none hit. No backend calls beyond the mock: the resume mock log shows `?lang=en`, `?lang=vi`, `/visit` only, and `onrender` lines → `0` apart from the fake's own logging.

## Seal gate
No outward action. OK.

## Proportionality
OK. 4 files, no code added in the re-pass.

## Supersedes / Still open
Supersedes none. Still open: the upstream blog API half of #415. The PR should reference #415, not `Closes #415`. #429 and #430 can close.

## PM status
SEALED. The full row is archived to `haven/diagrams/dev-loop-archive.md` and the active row is replaced by a pointer. The oldest pointer row (`resume-plain-mappers`) was dropped (21 > 20). The feature doc status is unchanged (fix SEAL; doc already `verified`).
