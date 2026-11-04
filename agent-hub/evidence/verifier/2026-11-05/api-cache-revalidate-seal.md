# 2026-11-05 - api-cache-revalidate (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `api-cache-revalidate` (#379, `bug/379`)
- Note judged: `evidence/implementer/2026-11-05/api-cache-revalidate-diff.md`
- Verdict: **SEAL**

## Isolation proof
Separate Agent-tool subagent, spawned with the task string "You are the VERIFIER worker of the agent-hub ... Judge the implementer note `agent-hub/evidence/implementer/2026-11-05/api-cache-revalidate-diff.md` ..." and its own scratchpad dir `scratchpad/v379/` (the implementer's runs live in `scratchpad/r379/`). I did not write this diff.

## Re-run
partial — node is outward-facing (changes cache-control on every live `/api/*` response of the production site). Re-ran: `r379/switch.mjs` old/new A→B scenario (fresh profiles `v379/prof-{old,new}`), `r379/headers.sh` + 304 header probe against the on-disk `.output`, `npm run lint`, `npx nuxi typecheck`, `npm test`. Build not re-run: read `r379/build-final.log` tail and confirmed `.output/server/chunks/nitro/nitro.mjs` contains the plugin (`toLowerCase() === "cache-control" ? "no-cache" : value`), `out-old` does not.
Disclosure: I also read `server/plugins/ApiCacheControl.ts` (16 lines) while locating the diagram row — beyond `EvidenceOnly`; it matches the note's description and did not change the verdict.

## My output (mock :4199, server :4188, `node --import csp/redirect.mjs`)
```
v-old/B-fresh after switch http://localhost:4188/ {"mainSAPUI5":false,"familiarLabel":false,"lang":"vi-VN"}
v-old/B-fresh api ["/api/resume?lang=vi status=200 fromCache=true cc=max-age=1036800"]
v-new/B-fresh after switch http://localhost:4188/ {"mainSAPUI5":true,"familiarLabel":true,"lang":"vi-VN"}
v-new/B-fresh api ["/api/resume?lang=vi status=200 fromCache=false cc=no-cache"]
errors 0 on all 4 visits
/api/resume?lang=vi|en, /api/github, /api/blogs/categories, /api/blogs/detail/p1 → 200 cc=no-cache
/api/blogs/posts, /, /en, /contact → cc= (unchanged); /_nuxt/DoMtfn2M.js cc=public, max-age=31536000, immutable; /api/generate-pdf 200 application/pdf
revalidate ×4 -> 304; 304 /api/resume?lang=vi: cache-control: no-cache; 304 /api/github: cache-control: no-cache
mock hits during headers run: 8 total (resume en 2, vi 1, categories 1, posts 1, detail 1, user 1, repos 1)
onrender=0 · lint=0 · typecheck=0 ts_errors=0 · Test Files 8 passed (8) / Tests 20 passed (20)
```
All servers/mocks killed (no listener on 4188/4199 afterwards). Port 3000 untouched.

## Criteria
| Criterion | Verdict | Cited |
|---|---|---|
| 1 no-cache on 5 cached API URLs (200 + 304), 304 works, server cache used, other routes unchanged | met | note Headers block; matched by my re-run above |
| 2 (clarified) A→B data change reaches the switch, not fromCache; old build reproduces; 0 console errors | met | note Browser block; my `v-old/B-fresh` vs `v-new/B-fresh` lines |
| 3 build+lint+typecheck+test | met | note Output block (commands match `doctrine/MEMORY.md`); build log tail `◆ ✨ Build complete in 14.6s!`; my lint/typecheck/test re-run |
| comments per code-comments.md | met | one `/** */` WHY block, no `(#N)`, opt-ins off |

## Criterion 2 clarification — judged
Honest: the node row was written in this same pass, the change is labeled `[clarified: ...]` inline, and the reason is correct HTTP semantics — a copy stored with `max-age` is served without a request until it expires, so no server change can reach it. Sufficient: the replacement scenario tests what the fix can actually do (data changes after a browser has stored a copy), and it is falsifiable (the old build fails it: `fromCache=true`, skills gone). The unreachable residue (existing ≤12-day copies, operator's browser needs a "Clear site data") is disclosed under `## Still open`, not hidden.

## Forbidden states
none hit (node on diagram, evidence present, outputs real, no code in haven, PM status updated here).

## Proportionality
One 16-line plugin, `nuxt.config.ts` unchanged; two failed alternatives reverted. Within the node.

## Seal gate
No outward action in the diff pass (commit/push left to `/ship`). OK.

## Supersedes
none (note: `## Supersedes: none`; no other open row for #379 on the active diagram).

## PM status
`api-cache-revalidate` IN_PROGRESS → SEALED; full row archived to `dev-loop-archive.md`; active row now a pointer; oldest pointer (`experience-skills-text`, already in archive) dropped to keep 20.
