# 2026-10-26 - security-headers-baseline (diff)

- Worker: implementer · Version: 0.1.0
- Node: `security-headers-baseline` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #301, branch `feature/301` (worktree `scratchpad/wt301`, private `node_modules/.cache`), rebased onto `staging` 843a936
- Status: `sealed_pending_verifier`

## Hub bytes before
77920

## Diff
| File | Why |
|---|---|
| `nuxt.config.ts` | routeRules `'/**'` with the 4 headers; `/** */` WHY: why no script-src CSP (inline scripts need nonces, ISR can't carry them) and why frame-ancestors doesn't affect the embedded Giscus iframe. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output (after rebase onto 843a936)
```
npm run build → rc=0, "◆ ✨ Build complete in 14.3s!", 1 pre-existing WARN (components-*.js (369:0): A comment)
npm run lint → rc=0
npx nuxi typecheck → 0 "error TS"
```
(`npm test` does not exist on this branch yet — #300 not merged.)

## Runtime (node build :4161 → mock :4199)
Before rebase, `curl -D -` on 11 routes: `/`, `/en`, `/contact` (prerendered), `/en/contact`, `/projects`, `/blogs`, `/api/resume`, `/api/generate-pdf?lang=en`, `/favicon.ico`, `/sitemap.xml`, `/nope` → all carry
`content-security-policy: frame-ancestors 'none' | referrer-policy: strict-origin-when-cross-origin | x-content-type-options: nosniff | x-frame-options: DENY`
(`/nope` JSON 404 shows Nitro's own stricter error-response CSP `script-src 'none'; frame-ancestors 'none'` + `referrer-policy: no-referrer`).
After rebase: `/`, `/en/github`, `/en/contact`, `/en/blogs`, `/api/resume` → 200, 4/4 headers each.

## Vercel preset (`NITRO_PRESET=vercel npm run build`, before rebase; `.vercel/` deleted afterwards)
```
HEADERS /(.*) {'Content-Security-Policy': "frame-ancestors 'none'", 'X-Frame-Options': 'DENY', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin'} continue=True
isr routes: 15 (unchanged; first route in the list is the header route)
```

## Browser (CDP :9888 incognito)
`/en`, `/en/projects`, `/en/contact`, `/en/github`, `/en/blogs` → 200, `errors: []`; a blog post page loads without errors; an iframe of the site from its own origin is refused: console "Framing 'http://localhost:4161/' violates the following Content Security Policy directive: \"frame-ancestors…\"".

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. Headers everywhere | curl tables |
| 2. Vercel output | HEADERS /(.*) continue=True; 15 ISR routes |
| 3. No breakage; framing refused | browser lines |
| 4. checks; comments per code-comments.md | rc=0 / 0 TS errors; one `/** */` WHY block (2+ sentences); no `(#N)` refs |

## Noticed, not done
- No script-src/style-src CSP (see plan): would need nonce support incompatible with ISR caching.
- No Permissions-Policy (not in the issue).
- Production check (`curl -I` on the deployed site) only possible after release.

## Seal gate
none.

## Supersedes
REOPEN 1 (`evidence/verifier/2026-10-26/security-headers-baseline-reopen.md`): the `nuxt.config.ts` comment wrongly called the payload an executing script and nonces the only option. Reworded: the inline config/importmap/color-mode scripts would need build-time hashes; `'unsafe-inline'` would void the CSP. Comment only; build/lint/typecheck re-run below.


REOPEN 1 re-check: `npm run build` rc=0 (Build complete in 16.3s), `npm run lint` rc=0, `npx nuxi typecheck` rc=0.
