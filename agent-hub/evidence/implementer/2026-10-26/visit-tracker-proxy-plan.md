# 2026-10-26 - visit-tracker-proxy (plan)

- Worker: implementer · Version: 0.1.0
- Node: `visit-tracker-proxy` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #285 "bug: VisitTracker POST blocked by CORS on every page load", branch `bug/285` off freshly pulled `staging` (`a3d27c1`). Operator chose "Proxy qua server Nuxt" (AskUserQuestion, 2026-10-26).

## Hub bytes before: 77964

## Root cause
`plugins/VisitTracker.client.ts` POSTs from the browser straight to `${NODE_API}/api/me/<email>/visit`; the backend (resume-nodejs-api `src/server.ts` `cors(corsConfig())`) does not allow this site's origin → 3 console errors per page.

## Backend facts read (sibling repo, not changed)
- `handlerRecordVisit` (`src/candidate_me/index.ts:240`) takes the IP from `req.ip || req.socket.remoteAddress`; no `trust proxy` configured → today it already records Render's proxy address, not the visitor's. Forwarding `X-Forwarded-For` only takes effect once the backend trusts it (operator's choice text: "Backend cần đọc IP từ header đó").
- Global rate limiter (`rateLimit.middleware.ts`, 100 / 15 min, keyed on that same IP) → the relay must not retry.

## Plan
1. New `server/api/visit.post.ts`: POST to the backend with `X-Forwarded-For: <visitor ip>`, `timeout: 5000`, `retry: 0`; upstream failure only logged; always 204.
2. Plugin posts to `/api/visit` (`retry: 0`).

## Acceptance criteria (command-checkable)
1. `POST /api/visit` → 204; upstream receives exactly 1 POST on `/api/me/<email>/visit` with the visitor's `x-forwarded-for`.
2. Upstream 500 / timeout → still 204, exactly 1 upstream call (no retry).
3. Browser: no console errors on `/`, `/projects`, `/contact`, `/github`, `/blogs` (`/en` variants) from the tracker; one `/api/visit` request per page load.
4. `npm run build`, `npm run lint`, `npx nuxi typecheck` clean; comments per code-comments.md.

## Files (expected)
`server/api/visit.post.ts` (new), `plugins/VisitTracker.client.ts`.
