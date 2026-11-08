# 2026-11-08 - resume-cache-empty (SEAL)
- Worker: verifier · Version: 0.1.0
- Node: `resume-cache-empty` (#421 + #419, branch `bug/421`, uncommitted)
- Note audited: `evidence/implementer/2026-11-08/resume-cache-empty-diff.md` (+ `-plan.md`)
- Verdict: **SEAL**

## Isolation proof
Fresh subagent spawned by the operator's session with the prompt "You are the VERIFIER of the agent-hub ... Run `/worker verifier` exactly as defined in `.claude/skills/worker/SKILL.md`", task "#421 + #419 (one branch bug/421, one PR closing both)...". I read only the implementer's notes on disk, not its reasoning. I did not write this diff.

## Re-run
full. Reason: the node is outward-facing (it changes the production `/api/resume` cache lifetime and the live `/` failure path). Re-ran `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`, and the runtime check against a local mock.

## Commands (doctrine/MEMORY.md, repo root)
They match the note's `## Command`. Build env: `NODE_API` and `NUXT_PUBLIC_NODE_API` set to `http://127.0.0.1:4599` at build time and at run time.
```
build exit 0
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 212ms · modules 710ms · app 640ms · types 411ms · client 2.83s · server 1.92s · nitro 9.51s
◆ ✨ Build complete in 16.2s!
lint exit 0

> nuxt-app@1.13.1 lint
> eslint .

typecheck exit 0
0                      (grep -ci error on the typecheck log)
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
test exit 0
 Test Files  10 passed (10)
      Tests  28 passed (28)
```

## Runtime re-run (my own mock, :4599; `PORT=3457 node .output/server/index.mjs`)
```
--- mode empty (data: {})
/api/resume 502
/api/resume 502
{ "error": true, "url": "http://127.0.0.1:3457/api/resume", "statusCode": 502, "statusMessage": "Unable to load resume data", "message": "Unable to load resume data" }
/ 502
Unable to load resume data
0                       (grep -c page-index)
Đã có lỗi phía máy chủ
--- mode full (fixture incl. top-level + generalInformation salary)
/api/resume 200
{"success":true,"resume":{"firstName":"Dat","lastName":"Vo","introduction":"Hi","socialMedia":{"github":"https://github.com/datvt243"},"generalInformation":{"positionDesired":"Dev"},"experiences":[],"educations":[],"projects":[]}}
0                       (grep -c '"salary"')
/ 200
<title>Resume Dat Vo</title>
1                       (grep -c page-index)
--- mock
HIT empty /api/me/votan.it@gmail.com?lang=vi
HIT empty /api/me/votan.it@gmail.com?lang=vi
HIT empty /api/me/votan.it@gmail.com?lang=vi
HIT full /api/me/votan.it@gmail.com?lang=vi
onrender in server log: 0
server/api/resume.ts:21:    maxAge: 60 * 60,
server/api/generate-pdf.ts:19:const CACHE_MAX_AGE_MS = 60 * 60 * 24 * 1000
```
All 3 empty calls reached the mock, so the 502 was not cached. Both servers were stopped afterwards (ports 3457/4599 free).

## Acceptance
| Criterion | Evidence | Result |
|---|---|---|
| (1) `/api/resume` maxAge 1h, PDF 1-day cache unchanged | note diff `+    maxAge: 60 * 60,`; my grep `server/api/resume.ts:21: maxAge: 60 * 60,`, `generate-pdf.ts:19 CACHE_MAX_AGE_MS = 60 * 60 * 24 * 1000`; `generate-pdf.ts` not in `git status` | cited + reproduced |
| (2) empty `data` → controlled 502, not cached, `/` → 502 error page | note: new test "fails as a 502 when the upstream sends no public field", runtime + Playwright (`HTTP status: 502`, heading "Đã có lỗi phía máy chủ"); re-run: `/api/resume 502` x2, `/ 502` with "Đã có lỗi phía máy chủ", `page-index` 0, 3 empty mock hits | cited + reproduced |
| (3) non-empty resume still renders `/` 200 | note full mode `/ 200`; re-run `/ 200`, `<title>Resume Dat Vo</title>`, `page-index` 1 | cited + reproduced |
| (4) matches `features/resume-home.md` Behavior #3/#5 | doc read: #3 "caches the result 1 hour", #5 "or a resume with no whitelisted field" → 502 not cached → fatal; Changelog row 2026-11-08 node `resume-cache-empty`; operator answers recorded (Open questions 1 + 3, plus AskUserQuestion "Fatal error (Recommended)" 2026-11-08) | cited |
| (5) build+lint+typecheck+test clean | note `build exit 0 · lint exit 0 · typecheck exit 0 · test exit 0`; re-run above | cited + reproduced |
| comments per code-comments.md | the only comment touched is the `fetchResume` JSDoc, which explains why (never cached, page fails instead of rendering blank); no `(#N)` refs, no new `//` | cited |

## Checks
- Feature doc: `## Feature doc: doctrine/features/resume-home.md`. This is a fix, so only Behavior #3/#5 apply; both have evidence. `## Feature doc changed` carries the operator's recorded answer. Doc Status left as is (a fix SEAL does not re-verify the whole doc).
- Doctrine proposal: none.
- Supersedes: none. The note's grep shows no other #421/#419 row on the active diagram.
- Truncation: the note's gate outputs are labelled `(tail)`, which past SEALs accepted. The `...` appears only inside quoted runtime JSON bodies, and I re-ran those checks myself without elision.
- Forbidden states: ADHOC_WORK no (node exists) · NO_EVIDENCE no · EDIT_UNVERIFIED no (typecheck cited + re-run) · CODE_IN_HAVEN no (the mock lives in the session scratchpad) · DIAGRAM_DRIFT no (PM updated with this SEAL).
- Seal gate: no commit/push/PR in this pass. The note records `none`.
- Proportionality: `git status` shows exactly the 5 files listed in the note's `## Diff`, plus the untracked `.vercel/` (not part of this note) and the evidence dir. That is the smallest root-cause fix in the shared fetcher. The `isValid` cleanup was correctly deferred to "Noticed, not done".

## PM status
`resume-cache-empty` PENDING → SEALED. The full row was archived to `haven/diagrams/dev-loop-archive.md`. The active row is now a pointer. The oldest pointer row (`hero-about-me-intro`) was dropped to keep 20.
