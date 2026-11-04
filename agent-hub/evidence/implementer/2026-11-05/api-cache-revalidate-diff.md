# 2026-11-05 - api-cache-revalidate (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `api-cache-revalidate` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #379 (created by `/todo` from the operator's report "khi tôi đổi lang thì mainSKills bị mất"). Branch `bug/379` off `staging` 38e00cc (created with `gh issue develop`).
- Status: `sealed_pending_verifier`

## Hub bytes before
79743 (measured before the node row was appended)

## Diagnosis (operator's browser, localhost:3000, before any change)
- After `/en` → vi, the Pinia `resume.generalInformation` keys were `positionDesired,career,yearsOfExperience,personalSkills,professionalSkills,foreignLanguages,professionalSkillsGroup,openToWork`, with no `mainSkills`/`familiarSkills`.
- `curl localhost:3000/api/resume?lang=vi` and `?lang=en`: both have `mainSkills` (5) and `familiarSkills` (4).
- In-page fetches:
  - `fetch('/api/resume?lang=vi')` → no `mainSkills`, `etag W/"x6u1oCFcdL"`, `date: Sun, 01 Nov 2026 09:12:31 GMT`, `cache-control: max-age=1036800`.
  - The same URL with `{cache:'no-store'}` → has `mainSkills`, `etag W/"AWM6HF0pev"`, `date: Wed, 04 Nov 2026 18:25:12 GMT`.
- So it was a browser HTTP cache entry from before `mainSkills` was added (`hero-main-familiar-api`, 2026-11-02).
- Production: `curl -sI https://resume-nuxt-vert.vercel.app/api/resume?lang=vi|en` → `cache-control: max-age=1036800`.
- Source: `node_modules/nitropack/dist/runtime/internal/cache.mjs:279` writes `max-age=${opts.maxAge}` into the cached response. On a conditional hit, h3's `handleCacheHeaders` writes `public, max-age=…, s-maxage=…` and calls `res.end()` itself (nitropack `cache.mjs` ~l.305).

## Acceptance criteria clarified
(2) "with a pre-seeded stale cached response, switching shows the main skills" → "same profile, mock data changes between two visits; on the second visit the switch shows the skills and the API is not served from cache; the old build reproduces the bug in the same scenario". A copy a browser already stored with `max-age` is never re-requested before it expires, so no server change can satisfy the original wording.

## Approaches tried (each on a local prod build against the :4199 mock)
1. `routeRules['/api/**'].headers['Cache-Control'] = 'no-cache'` → the cached APIs still sent `cc=max-age=1036800`; only the uncached `/api/blogs/posts` got `no-cache`. The cached handler overwrites route-rule headers. Reverted.
2. Nitro plugin with a `beforeResponse` hook → 200s got `no-cache`, but the 304 still sent `cache-control: public, max-age=1036800, s-maxage=1036800`. A revalidating browser stores that and goes back to trusting its copy for 12 days. Replaced.
3. **Kept:** Nitro plugin with a `request` hook that, for `/api/` paths, wraps `event.node.res.setHeader` so any `cache-control` becomes `no-cache`. It covers both the 200 path and the 304 that h3 ends inside the handler.

## Diff
| File | Change |
|---|---|
| `server/plugins/ApiCacheControl.ts` (new, 16 lines) | the `request`-hook wrapper (approach 3) plus a WHY doc block |
| `haven/diagrams/dev-loop.prime-mermaid.md` | node row appended; criterion 2 clarified |

`nuxt.config.ts` is unchanged in the end (`git diff nuxt.config.ts | wc -l` → 0).

## Output (final build, mock env)
```
npm run build → build=0, ◆ ✨ Build complete in 14.6s!  (only WARN: the pre-existing components-*.js "@__NO_SIDE_EFFECTS__" comment)
npm run lint → lint=0
npx nuxi typecheck → typecheck=0 ts_errors=0
npm test → Test Files  8 passed (8) / Tests  20 passed (20)
```

## Headers (criterion 1)
Scratchpad `r379/headers.sh`. Server on :4188 with `node --import csp/redirect.mjs`, mock `csp/mock.mjs` on :4199.

Before (`headers-before.txt`, unchanged branch):
```
/api/resume?lang=vi | 200 | cc=max-age=1036800 | etag=W/"9T5KMWZ8NI"
/api/resume?lang=en | 200 | cc=max-age=1036800 | etag=W/"9cU3CKK0A2"
/api/github | 200 | cc=max-age=1036800    /api/blogs/categories | 200 | cc=max-age=1036800    /api/blogs/detail/p1 | 200 | cc=max-age=1036800
/api/blogs/posts?page=1&perPage=20 | 200 | cc=     / | cc=    /en | cc=    /contact | cc= | etag="746c-…"
/_nuxt/DoMtfn2M.js | cc=public, max-age=31536000, immutable
/api/generate-pdf | 200 Content-Type: application/pdf   (no cache-control)
revalidate (If-None-Match) resume vi / github / categories / detail p1 -> 304 ×4
```
After (`headers-after.txt`, approach 3):
```
/api/resume?lang=vi | 200 | cc=no-cache | etag=W/"9T5KMWZ8NI"
/api/resume?lang=en | 200 | cc=no-cache | etag=W/"9cU3CKK0A2"
/api/github | 200 | cc=no-cache    /api/blogs/categories | 200 | cc=no-cache    /api/blogs/detail/p1 | 200 | cc=no-cache
/api/blogs/posts?page=1&perPage=20 | 200 | cc=     / | cc=    /en | cc=    /contact | cc= | etag="746c-…"
/_nuxt/DoMtfn2M.js | cc=public, max-age=31536000, immutable
/api/generate-pdf | 200 Content-Type: application/pdf   (no cache-control)
revalidate -> 304 ×4
--- 304 response headers per API:
/api/resume?lang=vi: HTTP/1.1 304 Not Modified cache-control: no-cache
/api/resume?lang=en: HTTP/1.1 304 Not Modified cache-control: no-cache
/api/github: HTTP/1.1 304 Not Modified cache-control: no-cache
/api/blogs/categories: HTTP/1.1 304 Not Modified cache-control: no-cache
/api/blogs/detail/p1: HTTP/1.1 304 Not Modified cache-control: no-cache
```
- The etags are identical before and after, so the bodies are unchanged.
- The server cache still holds: mock upstream hits for the whole headers run are identical before and after: resume en 2, resume vi 1, categories 1, posts 1, detail 1, GitHub user 1, repos 1. That is one hit per resource across ~10 requests each (the 2nd resume-en hit is the PDF render).
- HTML routes, `/contact`, `/_nuxt/` assets and the PDF keep their headers.

## Browser (criterion 2)
Scratchpad `r379/switch.mjs`, run by a shell loop. It uses headless Chrome (puppeteer-core `launch`) with a profile persisted across two visits (`prof-old`/`prof-new`, deleted before each build's pair).
- **Visit A:** mock `STALE=1`, which strips `mainSkills`/`familiarSkills` from both locales.
- Between visits the server and mock are restarted (empty server memory cache).
- **Visit B:** mock serves the full data.
- **Each visit:** load `/en`, click `button[aria-label*="Switch language"]`, wait 2.5s, then read the hero text above the editor and the `/api/resume` responses (`fromCache`).
- **Builds:** `out-old` = this branch without the plugin (moved out for one build, then restored); `out-new` = with it.

Verbatim (`r379/switch.out`):
```
old/A-stale /en SSR {"mainSAPUI5":false,"familiarLabel":false,"lang":"en-US"}
old/A-stale after switch http://localhost:4188/ {"mainSAPUI5":false,"familiarLabel":false,"lang":"vi-VN"}
old/A-stale api ["/api/resume?lang=vi status=200 fromCache=false cc=max-age=1036800"]
old/A-stale errors 0 []
old/B-fresh /en SSR {"mainSAPUI5":true,"familiarLabel":true,"lang":"en-US"}
old/B-fresh after switch http://localhost:4188/ {"mainSAPUI5":false,"familiarLabel":false,"lang":"vi-VN"}
old/B-fresh api ["/api/resume?lang=vi status=200 fromCache=true cc=max-age=1036800"]
old/B-fresh errors 0 []
new/A-stale /en SSR {"mainSAPUI5":false,"familiarLabel":false,"lang":"en-US"}
new/A-stale after switch http://localhost:4188/ {"mainSAPUI5":false,"familiarLabel":false,"lang":"vi-VN"}
new/A-stale api ["/api/resume?lang=vi status=200 fromCache=false cc=no-cache"]
new/A-stale errors 0 []
new/B-fresh /en SSR {"mainSAPUI5":true,"familiarLabel":true,"lang":"en-US"}
new/B-fresh after switch http://localhost:4188/ {"mainSAPUI5":true,"familiarLabel":true,"lang":"vi-VN"}
new/B-fresh api ["/api/resume?lang=vi status=200 fromCache=false cc=no-cache"]
new/B-fresh errors 0 []
onrender=0
```
- `old/B-fresh` is the operator's bug, reproduced (`fromCache=true`, skills gone after the switch).
- `new/B-fresh` is fixed.

Two earlier attempts of this run are not counted:
- The first used a mock copy that read its data from the wrong folder, so every page was a 502. The `click()` on a null button came from there.
- The skill detector was also rewritten. It now checks for `SAPUI5` and the "Familiar with"/"Đã làm quen với" label in the hero text above `PERSONAL-INFO`.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 no-cache on all cached APIs (200 and 304), 304 still works, server cache used, other routes unchanged | Headers block |
| 2 data change reaches the language switch; the old build reproduces the bug | Browser block |
| 3 checks | Output block |
| comments per code-comments.md | One `/** */` block (multi-line → JSDoc style), WHY only: why browsers must revalidate, why 304 stays cheap, why setHeader is wrapped (both failed alternatives named). No `(#N)`. Opt-ins: none enabled. |

## Supersedes: none
## Still open
- Copies browsers already stored with `max-age=1036800` stay until they expire (≤12 days from when each was fetched). The operator's own browser needs one "Clear site data" (or a DevTools "Disable cache" reload) to see the fix.
- Production behavior (Vercel ISR on `/api/resume`, Vercel's own header handling) is verified only after a release.

## Noticed, not done
- The rewrite applies to every `/api/` response that sets cache-control. Today those are only the 4 cached handlers. A future handler that wants browser caching would need an exemption here.
- `/api/blogs/posts` sends no cache-control (unchanged). Browsers don't heuristically cache it because it has no `Last-Modified`.

## Seal gate
none (commit/push left to `/ship`)
