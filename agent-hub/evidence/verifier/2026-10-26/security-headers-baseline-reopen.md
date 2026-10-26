# 2026-10-26 - security-headers-baseline (verdict: REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `security-headers-baseline` (issue #301, branch `feature/301`, worktree `scratchpad/wt301`, uncommitted)
- New PM status: unchanged (IN_PROGRESS). Nothing is archived on a REOPEN.
- Notes audited: `evidence/implementer/2026-10-26/security-headers-baseline-plan.md`, `evidence/implementer/2026-10-26/security-headers-baseline-diff.md`

## Isolation proof
Separate subagent spawned through the Agent tool with the task "You are the agent-hub **verifier** for the Nuxt 4 portfolio ... Node `security-headers-baseline`, issue #301 ... Note the implementer deliberately did not add a script/style CSP and explains why — judge whether that's a sound scoping of the issue ... You did not write this change." The implementer's task was issue #301 itself. This context did not write the diff. I read `git diff nuxt.config.ts` only for steps 7 (comments) and 10 (proportionality), as the operator asked.

## Reasoning
| Check | Result |
|---|---|
| Step 4: commands | `npm run build`, `npm run lint`, `npx nuxi typecheck` present. No "tests pass". |
| Step 5: truncation | None. My re-run matches (Raw). |
| Step 6: behavior evidence | Concrete (per-route header lists, Chrome's framing-refusal message). Re-run independently. |
| AC1: 4 headers everywhere (node build) | **Met.** 18 routes checked (Raw): SSR/ISR pages vi+en, prerendered `/contact` + `/en/contact`, a blog post, `/api/resume`, `/api/blogs/posts`, `/api/generate-pdf` (application/pdf), `/favicon.ico`, `/sitemap.xml`, `/rss.xml`, `/_nuxt/*.js`, `/_nuxt/*.css`, `/_nuxt/builds/latest.json`, HTML 404. All 4/4. JSON 404 carries Nitro's own stricter error headers (`script-src 'none'; frame-ancestors 'none'`, `no-referrer`), as the note says. Every asset type checked has a correct `Content-Type`, so `nosniff` breaks nothing. |
| AC2: Vercel output | **Met.** Route 0 is `HEADERS /(.*)` with the 4 headers and `continue=true`, ahead of the existing `/_nuxt` cache-control header routes. ISR routes are still there, incl. `/en`, `/en/projects`, `/en/github`, `/en/blogs`, `/en/blogs/(?:.*)` and their `_payload.json` twins. `.vercel/` deleted, default build re-run. |
| AC3: no breakage; framing refused | **Met.** Incognito context on Chrome :9888: 11 pages (vi+en main pages + 1 blog post) → 200, Vue app mounted, 0 console errors/warnings, 0 page errors. The only `requestfailed` is `/api/visit net::ERR_ABORTED`. That is a CDP quirk for an empty 204 body: an in-page `fetch('/api/visit')` returns `204 ok=true` and the plugin's `console.error` never fires. Not caused by this diff. Framing from another origin (`127.0.0.1` page with iframes of `localhost:4162/en` and `/contact`) → both blocked: "Framing 'http://localhost:4162/' violates ... \"frame-ancestors 'none'\"". |
| AC4: build/lint/typecheck | **Met.** build rc=0 "◆ ✨ Build complete in 13.4s!" (1 pre-existing WARN `components-*.js (369:0): A comment`); lint rc=0; typecheck rc=0, 0 "error TS". |
| **Comments per code-comments.md** | **Not met.** The `/** */` WHY block claims: "Nuxt's inline payload and color-mode scripts would need per-request nonces, which ISR-cached pages can't carry." Two factual errors, checked against the SSR HTML of `/en` (Raw): (1) the payload is a `type="application/json"` data block, which `script-src` does not govern. The inline scripts that do execute are the color-mode script, the `window.__NUXT__={}` config script and the `importmap`. (2) Nonces are not the only option. Those three scripts are the same for every request of a build, so `'sha256-…'` hashes would work with ISR. The real cost is that the hashes must be regenerated on every build (or whenever runtime config changes). The plan note itself says "a hash/unsafe-inline policy would be either fragile or meaningless", but the comment drops that. As written, a later reader concludes a script CSP is impossible on this site, which is wrong. This is a security rationale, so the claim has to be accurate. |
| Scope: no script/style CSP | **Sound.** The issue asks for a CSP allowlist (Google Fonts, Giscus, Maps) "thử ở staging trước". A hash-based script CSP would need build-time hash generation kept in sync with Nuxt's output. `'unsafe-inline'` would allow inline scripts, which removes most of a CSP's XSS value. Both are a separate node at P2. Clickjacking (the concrete risk) is covered by `frame-ancestors` + `X-Frame-Options`. The note lists it under "Noticed, not done". Recommend the operator track the script CSP as a follow-up issue so #301's "Closes" does not drop it silently. |
| Step 7b | No other #301 row on the active diagram. |
| Step 8: forbidden states | None hit. |
| Step 9: seal gate | No outward-facing action (uncommitted, nothing pushed/deployed). |
| Step 10: proportionality | 1 routeRule (4 headers) + its comment + the diagram row. In scope. |

## Missing
1. Comments per code-comments.md: in `nuxt.config.ts`, correct the WHY block's CSP rationale. Something like: "No script-src CSP: the inline color-mode, `window.__NUXT__` config and importmap scripts would need per-request nonces (ISR-cached HTML can't carry them) or per-build hashes kept in sync with Nuxt's output — a separate change." Keep the frame-ancestors/Giscus sentence, which is correct. A comment-only change: after it, re-run build + lint + typecheck. No runtime re-check is needed.

## Re-run
full: build (Vercel preset + default), lint, typecheck, curl on 18 routes and my own CDP script, run because the operator asked for an independent re-check and the node is outward-facing (security headers on every production route). Warm cache. The `.vercel/` dir is deleted. The `:4162` server is stopped. The `:4199` mock is still running (it was already up). Read-only `curl -sI` baseline against production. Scripts and logs are in `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/4e0a01cf-e1e6-4af1-827c-1ec4609b53dd/scratchpad/v301/` (`build-vercel.log`, `build.log`, `lint.log`, `tc.log`, `curl.out`, `cdp.cjs`, `cdp.out`, `visit.cjs`, `visit2.cjs`).

## Raw
```
prod baseline  curl -sI https://resume-nuxt-vert.vercel.app/en → HTTP/2 200, only strict-transport-security
vercel  0 HEADERS /(.*) {"Content-Security-Policy":"frame-ancestors 'none'","X-Frame-Options":"DENY","X-Content-Type-Options":"nosniff","Referrer-Policy":"strict-origin-when-cross-origin"} continue=true
        ISR: / /en /projects /en/projects /github /en/github /blogs /en/blogs /blogs/(?:.*) /en/blogs/(?:.*) /api/resume (+ _payload.json twins)
curl (4hdr = count of the 4 exact header lines)
/ /en /projects /en/projects /github /en/github /blogs /en/blogs → 200 text/html 4hdr=4
/contact /en/contact (prerendered) → 200 text/html 4hdr=4
/blogs/67123bdf9c6e9bcf4f7bf006 → 200, 4/4
/api/resume /api/blogs/posts → 200 application/json 4hdr=4
/api/generate-pdf?lang=en → 200 application/pdf 4hdr=4
/favicon.ico /sitemap.xml /rss.xml → 200 4hdr=4
/_nuxt/-Z-znGDJ.js text/javascript, /_nuxt/entry.T_rdgwy9.css text/css, /_nuxt/builds/latest.json application/json → 4/4
/nope Accept:text/html → 404 text/html 4/4 ; /nope JSON → content-security-policy: script-src 'none'; frame-ancestors 'none'; referrer-policy: no-referrer
CDP  / /en /projects /en/projects /github /en/github /blogs /en/blogs /contact /en/contact /blogs/<id> → 200 vueApp=true, console errors []
     (requestfailed /api/visit ERR_ABORTED only; in-page fetch /api/visit -> 204 ok=true)
FRAMING console= "Framing 'http://localhost:4162/' violates the following Content Security Policy directive: \"frame-ancestors 'none'\". The request has been blocked." ×2
inline <script> in /en SSR HTML: importmap (43 B), ld+json, color-mode IIFE (1210 B), window.__NUXT__={};…config (1019 B), application/json __NUXT_DATA__ (payload)
```
