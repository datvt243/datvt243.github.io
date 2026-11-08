# 2026-11-08 - github-page-fixes (SEAL)
- Worker: verifier · Version: 0.1.0
- Node: `github-page-fixes` (#436, branch `bug/436`, uncommitted)
- Note audited: `evidence/implementer/2026-11-08/github-page-fixes-diff.md` (+ `-plan.md`)
- Verdict: **SEAL**

## Isolation proof
I am a fresh subagent. The operator's session spawned me with the prompt "You are the VERIFIER of the agent-hub ... Run `/worker verifier` exactly as defined in `.claude/skills/worker/SKILL.md`" and the task "#436 GitHub page: fix "no data" check, case-insensitive search, locale dates, empty state, new-tab profile link". That prompt also gave me the mock path `.../scratchpad/mock.py` on port 4599. I read only the implementer's notes on disk, not its reasoning. I did not write this diff.

## Re-run
full. Reason: the node is outward-facing because it changes the live production `/github` page. I re-ran `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`, the SSR check and a Playwright check.

## Commands (doctrine/MEMORY.md, repo root)
These match the note's `## Command`. `NODE_API` and `NUXT_PUBLIC_NODE_API` were both `http://127.0.0.1:4599`, at build time and at run time.
```
build exit 0
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 243ms · modules 740ms · app 610ms · types 380ms · client 2.52s · server 1.66s · nitro 8.46s
◆ ✨ Build complete in 14.6s!
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

## Runtime re-run (`PORT=3458 node .output/server/index.mjs`, mock :4599)
```
/github 200
/en/github 200
-- github
Cập nhật vào 8/11/2026</li>
<a href="https://github.com/datvt243" target="_blank" rel="noopener noreferrer"
-- en-github
Updated on 11/8/2026</li>
<a href="https://github.com/datvt243" target="_blank" rel="noopener noreferrer"
onrender: 0            (grep -c onrender on the server log)
```
I ran Playwright in my own new tab on `/en/github` and closed only that tab afterwards. `visibilityState` was `visible`. I waited 2.5s after each input and skipped `*leave*` rows.
```
{"upper":["resume-nodejs-api"],"upperEmpty":null,           (search "RESUME-NODE")
 "none":{"empty":"No repositories match"},                  (search "zzzz-no-such-repo")
 "cleared":{"empty":null}}                                  (search cleared, full list back)
console (warning level): Total messages: 0 (Errors: 0, Warnings: 0)
```
I stopped both servers afterwards and confirmed ports 3458 and 4599 were free.

## Acceptance
| Criterion | Evidence | Result |
|---|---|---|
| (1) `&&` guard | the note's diff `+    <div v-if="props.user && Object.keys(props.user).length">` | cited |
| (2) case-insensitive search | note: `RESUME-NODE` → `resume-nodejs-api`; my re-run gave the same: `["resume-nodejs-api"]` | cited + reproduced |
| (3) locale date, UTC, 0 hydration warnings | note: SSR vi `Cập nhật vào 8/11/2026` / en `Updated on 11/8/2026`, console 0 warnings; re-run gave the same strings and `Errors: 0, Warnings: 0`; diff keeps `{ timeZone: 'UTC' }` | cited + reproduced |
| (4) localized empty state | note: vi "Không có repository nào khớp" / en "No repositories match"; re-run (en) gave `"No repositories match"`, and `null` once cleared; both keys appear in the diff | cited + reproduced (en); vi cited |
| (5) profile link new tab | SSR `target="_blank" rel="noopener noreferrer"` in both locales, both in the note and in my re-run | cited + reproduced |
| (6) language filter + `/` still work | note: `slashFocusesSearch: true`; Vue → `{ count: 5, languages: ["Vue"] }` | cited |
| (7) doc Behavior #4/#6/#7 + Changelog | I read `doctrine/features/github-profile.md`: #4 "(new tab)", #6 "case-insensitive substring … localized "no repositories match" message", #7 "formatted in the current locale (`vi-VN` / `en-US`, UTC calendar date)", Changelog row 2026-11-08 `github-page-fixes` | cited |
| (8) build+lint+typecheck+test clean | note: `build exit 0 · lint exit 0 · typecheck exit 0 · test exit 0`; re-run results above | cited + reproduced |
| comments per code-comments.md | the only comment changed is the `Item.vue` JSDoc first line ("with no options" → "without a timeZone"). It still explains why the code pins UTC. There are no new comments and no `(#N)` refs. | cited |

## Checks
- Feature doc: the note's `## Feature doc` line is `doctrine/features/github-profile.md`. This is a fix, so only Behavior #4, #6 and #7 apply, and all three have evidence. The `## Feature doc changed` line records the operator's answers to Open questions 1-5 (2026-11-07). The doc's Status stays as it is, because a fix SEAL does not re-verify the whole doc.
- Doctrine proposal: none.
- Supersedes: none. The note's grep shows `#436` only on `github-page-fixes`.
- Truncation: the gate outputs are labelled `(tail)`, which past SEALs accepted. The `...` appears only inside a quoted HTML `class` attribute. I re-ran all gates and SSR checks myself without elision.
- Forbidden states:
  - ADHOC_WORK: no (the node exists).
  - NO_EVIDENCE: no.
  - EDIT_UNVERIFIED: no (typecheck is cited and I re-ran it; the UI evidence is concrete and I reproduced it).
  - CODE_IN_HAVEN: no (the mock lives in the session scratchpad).
  - DIAGRAM_DRIFT: no (PM status updated with this SEAL).
- Seal gate: there was no commit, push or PR in this pass, and the note records `none`.
- Proportionality: `git status` shows exactly the 7 files in the note's `## Diff`, plus the untracked `.vercel/` (not part of this note) and the evidence notes. Total diff stat: 19 insertions and 9 deletions. Out-of-scope items (`noData` casing, the `resule` typo) were correctly left under "Noticed, not done".
- PM status: I collapsed the row to a pointer and appended the full row to `dev-loop-archive.md`. That made 21 pointer rows, so I deleted the oldest one, `hero-avatar-inline`, whose full row is already in the archive.
