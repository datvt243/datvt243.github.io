# 2026-11-01 - sanitize-html-require-esm (diff)

- Worker: implementer · Version 0.1.0
- Node: `sanitize-html-require-esm` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: see `sanitize-html-require-esm-plan.md` (verbatim task + diagnosis)
- Status: `sealed_pending_verifier`

## Hub bytes before: 80098

## Diff
| File | Why |
|---|---|
| `nuxt.config.ts` | `nitro.externals.inline: ['sanitize-html']` — Rollup's commonjs transform turns its `require('htmlparser2')` into an ESM import, so no require(esm) runs on Vercel |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | node row appended at the end |

```diff
diff --git a/nuxt.config.ts b/nuxt.config.ts
index 2068cae..f3c4910 100644
--- a/nuxt.config.ts
+++ b/nuxt.config.ts
@@ -166,6 +166,16 @@ export default defineNuxtConfig({
     '/en/blogs/**': { isr: true },
   },
 
+  nitro: {
+    /**
+     * sanitize-html is CJS and `require()`s htmlparser2@12, which is ESM-only.
+     * Vercel's runtime loader rejects require(esm) (ERR_REQUIRE_ESM crashes
+     * every SSR function at boot), so bundle it and let Rollup turn the
+     * require into an import.
+     */
+    externals: { inline: ['sanitize-html'] },
+  },
+
   $development: {
     nitro: {
       storage: {
```

Rejected alternative: pin `sanitize-html@2.17.1` (last on `htmlparser2 ^8`, CJS) — it is the post-HTML sanitizer, keep the current release.

## Command
- `npm run build`
- `npm run lint`
- `npx nuxi typecheck`
- `npm test`
- extra (acceptance 2): `NITRO_PRESET=vercel npm run build`, then `/bin/ls .vercel/output/functions/__fallback.func/node_modules | grep -E "^(sanitize-html|htmlparser2)$"` and `grep -rhoE "from *['\"]htmlparser2['\"]|require\(['\"]htmlparser2['\"]\)" .vercel/output/functions/__fallback.func/chunks | sort | uniq -c`; `.vercel/` removed afterwards
- extra (smoke): `PORT=3456 node .output/server/index.mjs`, `curl` `/` and `/projects`

## Output
```
build exit=0
◆ ✨ Build complete in 14.7s!
lint exit=0
> eslint .
typecheck exit=0
test exit=0
 Test Files  6 passed (6)
      Tests  14 passed (14)
vercel build exit=0
◆ ✨ Build complete in 13.4s!
--- node_modules matches:
htmlparser2
--- htmlparser2 load sites in chunks:
   1 from 'htmlparser2'
node build exit=0
200 /
200 /projects
no ERR_REQUIRE_ESM in server log
```
(`npm test` includes `tests/sanitizePostHtml.test.ts`, which runs against source, not the bundle.)

## Browser verification
N/A — no visual change. Boot smoke above is local Node 24, which never reproduced the crash; the real proof is the Vercel preview deployment of `bug/356` serving `/` without `FUNCTION_INVOCATION_FAILED`.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. `nitro.externals.inline: ['sanitize-html']` | diff above: `+    externals: { inline: ['sanitize-html'] },` |
| 2. sanitize-html inlined, no require of htmlparser2 | `--- node_modules matches:` lists only `htmlparser2`; chunks: `1 from 'htmlparser2'`, zero `require(` |
| 3. build+lint+typecheck+test clean | `build exit=0`, `lint exit=0`, `typecheck exit=0`, `Tests  14 passed (14)` |
| comments per code-comments.md | one `/** */` block, WHY only (the trap), no issue ref |

## Supersedes: none

## Noticed, not done
- Blog API `blog-api-nodejs-express.onrender.com/api/v1/posts` gave no response in 30s (`000 30.006360s`) at diagnosis time — upstream outage/cold start, separate from this crash; `/blogs` may still fail after the fix.
- Older runtime error groups ("Unable to load resume data" 502, `Task timed out after 10 seconds` on `/blogs`) are Render cold starts, covered by earlier nodes.
- Trap worth adding to PROJECT.md: a CJS dependency requiring an ESM-only package passes locally on Node ≥22 but crashes Vercel functions at boot.

## Seal gate: none (no commit/push in this pass)
