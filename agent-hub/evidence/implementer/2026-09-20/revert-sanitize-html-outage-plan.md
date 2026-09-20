# 2026-09-20 — revert-sanitize-html-outage

**Worker:** implementer
**Version:** 1.0.0 (dev-loop diagram)
**Node:** `revert-sanitize-html-outage` (new — P0 incident hotfix, created per `pick_next.md`'s "No diagram matches yet" branch)
**Task:** Fix a live production outage (issue #189) — every `/blogs/[id]` and `/api/blogs/detail/[id]` returns HTTP 500 (`FUNCTION_INVOCATION_FAILED`) on `https://resume-nuxt-vert.vercel.app`, caused by the `sanitize-html` dependency added in the `p2-polish-fixes-round2` node (issue #180, shipped in v1.1.5).

## Hub bytes before: 119218

## Incident summary (discovered during a post-release production check, not a normal `.claude/review.md` finding)
- Confirmed via direct `curl` against production: `/blogs/<id>` and `/api/blogs/detail/<id>` both consistently 500, reproduced on 2 different real post IDs, 4+ separate attempts, not transient/cold-start related (sibling routes `/api/blogs/posts` and `/api/blogs/categories` both returned 200 throughout).
- Reproduced the EXACT deployable Vercel function bundle locally (`NITRO_PRESET=vercel npm run build`, then ran `.vercel/output/functions/__fallback.func/index.mjs` directly, both under local Node 24.19.0 and under Node 22.23.2 - matching Vercel's declared `nodejs22.x` runtime from `.vc-config.json`) - it worked correctly (200) both times. This means the failure is specific to something about Vercel's own build/deploy pipeline for this project, not a logic bug reproducible from a clean local build - root mechanism not fully confirmed (no Vercel dashboard/CLI/log access from this session).
- Root cause candidate, not fully confirmed: Nitro's build leaves `sanitize-html` as an **external** bare import in the compiled chunk (`import sanitizeHtml from 'sanitize-html'` survives unbundled, confirmed by grepping the built chunk) rather than inlining it - meaning the deployed function depends on `node_modules/sanitize-html` being correctly resolvable at runtime, which apparently failed in Vercel's actual deployment even though it succeeded in every local reproduction attempt.
- Given the site is actively broken for an entire content type (all blog posts) and defense-in-depth HTML sanitization was itself a P2 "not urgent, given first-party trust" item in the original review, the correct call is to revert immediately and re-approach the underlying goal later with a safer method - not to keep debugging a live outage.

## Acceptance criteria
1. `server/api/blogs/detail/[id].ts` no longer imports/uses `sanitize-html`.
2. `sanitize-html`/`@types/sanitize-html` fully removed from `package.json`/`package-lock.json`.
3. `npm run build` clean, `npm run lint` clean, baseline unchanged.
4. Re-verify against the ACTUAL Vercel-preset bundle (not just the default `node-server` preset) under Node 22, matching the exact failure mode's reproduction method - this is the one node this session where "build succeeds" is not enough evidence, since that's exactly what looked fine before the outage.

## Files to touch
- `server/api/blogs/detail/[id].ts`
- `package.json`, `package-lock.json`

No env var needed.
