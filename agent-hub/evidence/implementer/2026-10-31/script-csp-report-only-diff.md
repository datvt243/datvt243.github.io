# 2026-10-31 - script-csp-report-only (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `script-csp-report-only` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #319 "feat(security): add a hash-based script-src CSP" — follow-up to #301 (`security-headers-baseline`, archived); #301 says try it as `Content-Security-Policy-Report-Only` first. Branch `feature/319` off `staging` 5ff1ea6.
- Status: `sealed_pending_verifier`

## Hub bytes before
80106 (measured before the node row was appended)

## Approach
Build-time hashes (the issue's framing) would break when runtime config (`NUXT_PUBLIC_*`) changes the inline `window.__NUXT__.config` script. Instead a Nitro `render:response` hook hashes the inline scripts of each rendered HTML response and sets the header on that same response; ISR stores header + body together, so they stay paired. JSON data blocks (`__NUXT_DATA__`, `ld+json`) aren't executed and get no hash.

First browser run (before the NuxtImg allowance) showed 68 report-only violations, all `script-src-attr inline`: `@nuxt/image`'s `NuxtImg.vue:62` adds `onerror="this.setAttribute('data-error', 1)"` on the server (10 imgs on `/`, 2 on `/projects`). Allowed via `'unsafe-hashes'` + the sha256 of that exact string only — hashing every `on*` attribute found in the page would also whitelist an injected one.

## Acceptance criteria
1. SSR HTML routes send `Content-Security-Policy-Report-Only` with `script-src 'self'` + one sha256 per inline script + NuxtImg onerror hash + `https://giscus.app`; `object-src 'none'; base-uri 'self'`. Enforced `frame-ancestors` CSP untouched.
2. 0 CSP violations in Chrome on `/`, `/en`, `/projects`, `/en/projects`, a client-side nav, and light color scheme.
3. Unit test for the policy builder.
4. build + lint + typecheck + `npm test` clean.

## Diff
| File | Why |
|---|---|
| `server/utils/scriptCsp.ts` (new) | builds the policy from an HTML string |
| `server/plugins/RenderHTML.ts` | `render:response` hook sets the Report-Only header on `text/html` responses |
| `tests/scriptCsp.test.ts` (new) | importmap + inline hashed, `src`/JSON/ld+json skipped, duplicates collapsed, exact policy string |
| `nuxt.config.ts` | `routeRules` comment no longer says "No script-src CSP yet"; points to the plugin |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Output
```
npm run lint → lint=0
npx nuxi typecheck → typecheck=0, `grep -c "error TS"` = 0
npm test → Test Files  6 passed (6) / Tests  14 passed (14)   (+1 new)
npm run build → ◆ ✨ Build complete in 13.8s!
```
Headers (`curl -D -`, prod build :4188, mock API :4199):
```
/: content-security-policy: frame-ancestors 'none'
content-security-policy-report-only: script-src 'self' 'sha256-uWJ4…' 'sha256-yMtE…' 'sha256-fRwI…' … https://giscus.app; …
(/en, /projects same shape)
/contact: Content-Security-Policy: frame-ancestors 'none'   ← no Report-Only (prerendered, see Still open)
```
`grep -c onrender /tmp/srv319.log` → 0.

## Browser verification
puppeteer-core, headless Chrome, fresh profile (no extensions), 1440×900; `securitypolicyviolation` listener injected before each document + console capture.
- Before NuxtImg allowance: `violations 68` (all `script-src-attr inline`) — proves the listener catches report-only violations.
- After: visited `/`, `/en`, `/projects`, `/en/projects`; clicked the visible `/projects` link from `/` (client nav → `http://localhost:4188/projects`); switched to `prefers-color-scheme: light` and reloaded → `violations 0 []`. All 4 pages hydrated.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 header shape | curl output |
| 2 0 violations | Browser verification |
| 3 unit test | `npm test` 14/14 |
| 4 checks | Output block |
| comments per code-comments.md | WHY comments only: util doc block, NuxtImg constant, Report-Only line in plugin, updated routeRules block |

## Supersedes: none

## Still open
- Enforcing: switch the header name to `Content-Security-Policy` after a release shows no violations in production (no `report-uri`, so that means checking the browser console on the live site). Issue #319 should stay open until then.
- `/contact` is prerendered, so it gets no runtime hook and no Report-Only header.

## Noticed, not done
- Not visited: `/github` (server calls the GitHub API), `/blogs`, `/blogs/[id]` (external blog API), and a blog post with Giscus configured (GISCUS_* unset, so its client.js never loads locally).
- Vercel may add its own scripts (toolbar/analytics on preview deployments); not observable locally.

## Seal gate
none (commit/push left to `/ship`)
