# 2026-11-05 - hero-about-me-intro (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `hero-about-me-intro` (#385, `feature/385`)
- Note judged: `evidence/implementer/2026-11-05/hero-about-me-intro-diff.md`
- Verdict: **REOPEN**

## Isolation proof
Separate Agent-tool subagent, spawned with the task string "You are the VERIFIER worker for the agent-hub ... Target: evidence note `agent-hub/evidence/implementer/2026-11-05/hero-about-me-intro-diff.md` (node `hero-about-me-intro` ..., issue #385) ... You are a separate subagent spawn, independent of the implementer." Blank context; I did not write this diff and did not open it.

## Re-run
none — audit-only. The gaps below are missing evidence in the note, and the recipe says REOPEN rather than re-run to fill a note's holes. Node is outward-facing (live hero), but that exception is for confirming evidence that exists, not producing evidence the implementer skipped.

## Criteria
| Criterion | Verdict | Cited / missing |
|---|---|---|
| 1 intro under position, bold kept, summary line gone, "checked in SSR HTML and a real browser for both locales" | **missing** | SSR covers `/` (vi) and `/en`. Browser covers `/en` only. The note itself says under "Not checked": "the VI locale in the browser (VI was checked in SSR only)". The node's own acceptance text requires a real browser check for both locales. |
| 2 4 tabs, keys 1–4, `?tab=about-me` falls back | met | Browser block: sidebar list of 4 tabs + c/d, key1–4 results, `afterDeepLink: "experiences.pug"`, console 0 errors. |
| 3 AboutMe.vue + `aboutMeHeading`/`experienceSummary` removed, "0 references left" | **missing** | Only a PRE-edit grep is cited. The note says "A post-edit rerun is left to the verifier." 0 references after the change is the implementer's claim to prove; the verifier does not open the diff (`EvidenceOnly`). |
| 4 build + lint + typecheck + `npm test` | met | Output block: build=0, lint=0, typecheck=0 ts_errors=0, Test Files 8 passed (8) / Tests 20 passed (20). Commands match `doctrine/MEMORY.md`; same format as previously sealed notes. |
| comments per code-comments.md | met (per note) | One `/** */` WHY JSDoc on `introParts`, `(issue #179)` ref removed, Index.vue comment updated, no `(#N)` added. |

## Missing (to fix, then re-submit)
1. Real-browser check of `/` (vi): the intro shows under `> {positionDesired}`, with no tags visible and no summary line. Quote the text read back and the console count.
2. A post-edit run of the same grep (`aboutMeHeading\|experienceSummary\|ResumeObjectAboutMe\|about-me\|splitHtmlIntoSentences`, same exclusions), with its verbatim output showing 0 hits (or only the allowed ones, each explained).

## Forbidden states
none hit (node on diagram, note present, outputs given, no code in haven, PM status updated here).

## Proportionality
Hero.vue, Index.vue, AboutMe.vue deletion, 2 locale files, the theme.md shortcut line. All within the node. The uncommitted `server/` dev-cache edits are disclosed as not part of this node and were not judged.

## Seal gate
No outward action in the diff pass (commit/push left to `/ship`). OK.

## Supersedes
none (note: `## Supersedes: none`; no other open row for #385 on the active diagram).

## PM status
`hero-about-me-intro`: PENDING → IN_PROGRESS, REOPEN pointer appended to the row. Not collapsed or archived.
