# 2026-10-26 - security-headers-baseline (plan)

- Worker: implementer · Version: 0.1.0
- Node: `security-headers-baseline` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #301 "chore(security): add basic security headers", branch `feature/301` (git worktree `scratchpad/wt301`), rebased onto `staging` 843a936.

## Hub bytes before: 77920

## Facts
Production `curl -I /en` (2026-10-26): only `strict-transport-security`. Embedded third-party content: Giscus iframe (post comments, currently unconfigured); no Maps iframe is rendered (`google_map` in app.config is unused).

## Plan
`nuxt.config.ts` routeRules `'/**'` headers: `Content-Security-Policy: frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. No script/style CSP: Nuxt's inline payload + color-mode scripts would need nonces, and ISR-cached HTML can't carry per-request nonces; a hash/unsafe-inline policy would be either fragile or meaningless — out of scope, noted.

## Acceptance criteria
1. The 4 headers on SSR/ISR pages, prerendered pages, API, static files (node build).
2. Vercel build output: header route for `/(.*)` with `continue: true`, ISR routes unchanged.
3. No console errors on the 5 main pages; framing the site is refused.
4. build/lint/typecheck; comments per code-comments.md.
