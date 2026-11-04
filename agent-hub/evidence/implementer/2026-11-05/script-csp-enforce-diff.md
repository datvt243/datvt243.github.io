# 2026-11-05 - script-csp-enforce (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `script-csp-enforce` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #319 "feat(security): add a hash-based script-src CSP". Follow-up to `script-csp-report-only` (SEALED, PR #348, shipped in v1.9.0), whose Still open said: enforce after a release shows no violations. Branch `feature/319` off `staging` c3493b6 (created with `gh issue develop`).
- Status: `sealed_pending_verifier`

## Hub bytes before
79751 (measured before the node row was appended)

## Production check (the precondition)
`scratchpad/csp/probe.mjs` (puppeteer-core, headless Chrome, fresh profile with no extensions, 1440×900). It registers a `securitypolicyviolation` listener via `evaluateOnNewDocument` and also captures CSP console messages. It visits each path, then makes real link clicks from `/`, then reloads `/` with `prefers-color-scheme: light`.
`node probe.mjs https://resume-nuxt-vert.vercel.app / /en /projects /en/projects /github /en/github /blogs /en/blogs /contact /en/contact /does-not-exist`:
```
/ 200 hydrated=true          /en 200 hydrated=true
/projects 200 hydrated=true  /en/projects 200 hydrated=true
/github 200 hydrated=true    /en/github 200 hydrated=true
/blogs 504 hydrated=false    /en/blogs 504 hydrated=false
/contact 200 hydrated=true   /en/contact 200 hydrated=true
/does-not-exist 404 hydrated=true
click /projects true …/projects   click /github true …/github
click /blogs false …/github       click /contact true …/contact
violations 0 []
```
Live header at the time: `content-security-policy-report-only: script-src 'self' 'sha256-…' … https://giscu…`. Production `/blogs` was 504 because the blog upstream on the Render free tier was down (`/api/blogs/posts` → 503 "Unable to load posts"), so blog pages are covered locally below.

## Diff
| File | Why |
|---|---|
| `server/plugins/RenderHTML.ts` | `render:response` now sets the enforced `content-security-policy` to `frame-ancestors 'none'; ` + `scriptCsp(body)`, replacing `-report-only`. On HTML responses it overrides the routeRules `Content-Security-Policy` (one header is left, see below), so it repeats frame-ancestors. Comment updated. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

`server/utils/scriptCsp.ts` and its test are unchanged: the policy builder is the same. `nuxt.config.ts`'s routeRules comment ("script-src … set in RenderHTML.ts") is still accurate.

## Output
```
npm run build → build=0, ◆ ✨ Build complete in 14.3s!
  1 WARN: components-*.js (369:0): A comment "/* @__NO_SIDE_EFFECTS__ */" … (pre-existing; also in
  verifier/2026-10-26/{resume-pii-whitelist,security-headers-baseline}-seal.md, verifier/2026-11-01/upstream-no-retry-429-seal.md)
npm run lint → lint=0
npx nuxi typecheck → typecheck=0 ts_errors=0
npm test → Test Files  8 passed (8) / Tests  18 passed (18)
```

## Local prod build
- Build and server both run with `NODE_API`/`NUXT_PUBLIC_NODE_API=http://127.0.0.1:4199` and `MY_EMAIL`/`NUXT_PUBLIC_MY_EMAIL=mock@example.com`, plus `GITHUB_TOKEN` empty and `PORT=4188`.
- `scratchpad/csp/mock.mjs` on :4199 stands in for the resume (`/api/me/*`, data snapshotted from prod `/api/resume`), blog and GitHub upstreams, and logs every hit.
- `redirect.mjs` is a `node --import` preload that rewrites `https://api.github.com/` and `https://blog-api-nodejs-express.onrender.com/` to the mock.
- The mock post's content deliberately contains `<script>alert(1)</script>` and `onerror="alert(1)"`.

Headers (`curl -D -`):
```
/ /en /projects /github /blogs /blogs/p1 → content-security-policy: frame-ancestors 'none'; script-src 'self' 'sha256-Hs0T…' …
/contact (prerendered)  → Content-Security-Policy: frame-ancestors 'none'
/api/resume             → Content-Security-Policy: frame-ancestors 'none'
/nope with accept: text/html → content-security-policy: frame-ancestors 'none'; script-src 'self' …
grep -ic content-security on / and /nope (accept html) → 1 and 1   (single header, no Report-Only)
```
`/nope` and `/_nuxt/` without `accept: text/html` get Nitro's JSON/plain error response with its own `script-src 'none'; frame-ancestors 'none';`, which is unchanged.

Browser, pass 2 (after REOPEN `verifier/2026-11-05/script-csp-enforce-reopen.md`). Same `.output` build, fresh mock (`mock2.log`) and server (`srv2.log`).

The probe now prints a light-mode line. While adding it I found that the pass-1 "light mode" step never left dark mode: `colorMode.preference: 'dark'` in `nuxt.config.ts` ignores `prefers-color-scheme`. The first re-run printed `light reload / true html class=dark`. So the probe now also sets `localStorage['nuxt-color-mode']='light'` before the reload, which takes the color-mode inline script's stored-preference branch. The production run in "Production check" above had the same flaw: its light step stayed dark.

`node probe.mjs http://localhost:4188 / /en /projects /en/projects /github /en/github /blogs /en/blogs /blogs/p1 /en/blogs/p1 /contact /en/contact /does-not-exist`, verbatim (`scratchpad/csp/probe2.out`):
```
/ 200 hydrated=true
/en 200 hydrated=true
/projects 200 hydrated=true
/en/projects 200 hydrated=true
/github 200 hydrated=true
/en/github 200 hydrated=true
/blogs 200 hydrated=true
/en/blogs 200 hydrated=true
/blogs/p1 200 hydrated=true
/en/blogs/p1 200 hydrated=true
/contact 200 hydrated=true
/en/contact 200 hydrated=true
/does-not-exist 404 hydrated=true
click /projects true http://localhost:4188/projects
click /github true http://localhost:4188/github
click /blogs false http://localhost:4188/github
click /contact true http://localhost:4188/contact
light reload / true html class=light violations so far 0
violations 0 []
```
`click /blogs false` = no visible `/blogs` link on `/github`. Client nav into the blog is covered by `control.mjs` below. `grep -c onrender srv2.log` → 0.
`control.mjs` (negative control + blog client nav):
```
client nav to post true http://localhost:4188/blogs/p1 has Hello: true script in post html: false
violations before injection 0
injected inline script ran: false violations after: [{"dir":"script-src-elem","disp":"enforce","url":"/blogs/p1"}]
```
Upstreams: `grep -c onrender srv.log` → 0. Mock log has every upstream call (resume vi+en, categories, posts ×2, detail p1, GitHub user+repos, 15 visit POSTs). Nothing reached a real backend.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 one enforced header on SSR HTML (with frame-ancestors), no Report-Only; non-HTML and `/contact` frame-ancestors only | Headers block |
| 2 0 violations on the listed pages, client nav, light mode, all hydrated, 0 real-upstream hits | probe + control output, mock log |
| 3 unit test still pins the policy string | `tests/scriptCsp.test.ts` unchanged, 18/18 |
| 4 checks | Output block |
| comments per code-comments.md | One `//` line in `server/plugins/RenderHTML.ts` changed: `// Replaces the routeRules CSP on HTML pages, so it repeats its frame-ancestors.` It gives the WHY for the repeated `frame-ancestors 'none'` (not visible from the code), is a single line so `//` not `/** */`, and has no `(#N)` ref. The old Report-Only comment is gone because its condition is now met. |

## Supersedes: none
## Still open
- `/contact` is prerendered, so the runtime hook doesn't run and the page gets no script-src. Same as before; it has no third-party content.
- Giscus is not configured (`GISCUS_*` unset), so `giscus.app/client.js` never loaded in any run. It is allowed by host in the policy, but its own frames and styles are not covered by script-src.
- Production `/blogs` and `/blogs/[id]` could not be checked live (upstream 504). Re-check after the release.

## Noticed, not done
- #297 and #299: their code parts are already merged and released (PRs #349, #322). What remains is owner content and GitHub profile edits, which have no code task.

## Seal gate
none (commit/push left to `/ship`)
