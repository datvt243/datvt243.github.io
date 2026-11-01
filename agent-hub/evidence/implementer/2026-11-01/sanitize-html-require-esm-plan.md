# 2026-11-01 - sanitize-html-require-esm (plan)

- Worker: implementer · Version 0.1.0
- Node: `sanitize-html-require-esm` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row, appended)
- Issue: #356 · Branch `bug/356` (off `staging` at `b7228d4`)
- Task (verbatim): "Production FUNCTION_INVOCATION_FAILED on Vercel: every SSR function crashes at boot with ERR_REQUIRE_ESM — sanitize-html@2.18.1 (CJS) require()s htmlparser2@12 (ESM-only), which Vercel's runtime loader rejects. Fix: inline sanitize-html into the Nitro bundle via nitro.externals.inline in nuxt.config.ts (already applied in working tree, uncommitted)."

## Hub bytes before: 80098

## Diagnosis (Vercel MCP, production, 2026-11-01)
- `curl -D - https://resume-nuxt-vert.vercel.app/` → `HTTP/2 500`, `x-vercel-error: FUNCTION_INVOCATION_FAILED`; same for `/projects`, `/blogs`.
- `get_runtime_logs` (deployment `dpl_28sjnwEGXr6xXQRaXoMuk7XPYwyj`, branch `main`, runtime `nodejs24.x`), every `GET /`:
  ```
  Error [ERR_REQUIRE_ESM]: require() of ES Module /var/task/node_modules/htmlparser2/dist/index.js from /var/task/node_modules/sanitize-html/index.js not supported.
  Node.js process exited with exit status: 1.
  ```
- Upstream is up at the same time: `curl` resume API → `200 1.97s`, so not the older "Unable to load resume data" cold-start group.
- `sanitize-html@2.18.1` deps `htmlparser2: '^12.0.0'`; `htmlparser2@12.0.0` `type: module`, ESM-only. Added in v1.8.1 by #347 (`server/utils/sanitizePostHtml.ts`). Local Node 24 allows require(esm), Vercel's loader does not — so local build/dev never showed it.

## Acceptance
1. `nuxt.config.ts` has `nitro.externals.inline: ['sanitize-html']`.
2. `NITRO_PRESET=vercel npm run build`: `sanitize-html` absent from `__fallback.func/node_modules`; chunks load htmlparser2 only via `from 'htmlparser2'`, no `require('htmlparser2')`.
3. `npm run build` + `npm run lint` + `npx nuxi typecheck` + `npm test` clean.

## Blockers: none
