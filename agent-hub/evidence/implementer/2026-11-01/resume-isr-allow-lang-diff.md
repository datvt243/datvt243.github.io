# 2026-11-01 - resume-isr-allow-lang (diff)

- Worker: implementer · Version 0.1.0
- Node: `resume-isr-allow-lang` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: see `resume-isr-allow-lang-plan.md` (verbatim task + diagnosis)
- Status: `sealed_pending_verifier` (pass 2, after REOPEN 1)

## Hub bytes before: 80340

## Diff
| File | Why |
|---|---|
| `nuxt.config.ts` | `/api/resume` ISR rule allows (and so passes) the `lang` query; each locale gets its own ISR entry |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | node row appended at the end |

```diff
diff --git a/nuxt.config.ts b/nuxt.config.ts
index f3c4910..971f377 100644
--- a/nuxt.config.ts
+++ b/nuxt.config.ts
@@ -155,7 +155,8 @@ export default defineNuxtConfig({
     '/en': { isr: 60 },
     '/projects': { isr: 60 },
     '/en/projects': { isr: 60 },
-    '/api/resume': { isr: 60 },
+    // Vercel ISR drops the query unless allowed: without this every locale gets the `vi` resume.
+    '/api/resume': { isr: { expiration: 60, allowQuery: ['lang'] } },
     '/github': { isr: 60 },
     '/en/github': { isr: 60 },
     '/contact': { prerender: true },
```

## Command
- `npm run build`
- `npm run lint`
- `npx nuxi typecheck`
- `npm test`
- extra (acceptance 2): `NITRO_PRESET=vercel npm run build` then `find .vercel/output/functions -name "*.prerender-config.json" | grep -i resume | xargs cat`, on this branch and with the diff stashed (staging); `.vercel/` removed afterwards

## Output
```
build exit=0
◆ ✨ Build complete in 14.5s!
lint exit=0
typecheck exit=0
test exit=0
      Tests  14 passed (14)

vercel build exit=0
.vercel/output/functions/api/resume-isr.prerender-config.json
{
  "expiration": 60,
  "allowQuery": [
    "lang",
    "__isr_route"
  ],
  "passQuery": true
}
.vercel/output/functions/api/resume/_payload.json-isr.prerender-config.json
{
  "expiration": 60,
  "allowQuery": [
    "lang",
    "__isr_route"
  ],
  "passQuery": true
}
--- before (staging):
{
  "expiration": 60
}{
  "expiration": 60
}
```

## Browser verification
N/A locally — no ISR outside Vercel, localhost already correct (the reported symptom). Real check = Vercel preview/live of `bug/361`: `/api/resume?lang=en` returns `Frontend Developer with 4+ years`.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. rule uses `allowQuery: ['lang']` | diff: `+    '/api/resume': { isr: { expiration: 60, allowQuery: ['lang'] } },` |
| 2. prerender config allows + passes `lang` | `"allowQuery": ["lang", "__isr_route"]`, `"passQuery": true`; staging was `{"expiration": 60}` |
| 3. build+lint+typecheck+test clean | `build exit=0`, `lint exit=0`, `typecheck exit=0`, `Tests  14 passed (14)` |
| 4. post-deploy EN on live | moved to node `resume-isr-allow-lang-live` (PENDING), see REOPEN 1 below |
| comments per code-comments.md | one `//` line, WHY only, no issue ref |

## Supersedes: none

## Noticed, not done
- `/` and `/en` are ISR too and `themes/portfolio-dev/pages/resumeObject/Index.vue` reads `route.query.tab`: the SSR render never sees `?tab=` (client corrects it after hydration). Separate issue if it matters.
- Live cache headers show `cache-control: max-age=1036800` (12 days, from `defineCachedEventHandler` maxAge) on `/api/resume` — browsers may keep the old VI body for a viewer who already fetched it.

## Seal gate: none (no commit/push in this pass)

## REOPEN 1 response (pass 2)
Verifier note: `evidence/verifier/2026-11-01/resume-isr-allow-lang-reopen.md`.
1. Missing evidence for acceptance 4 → took option (b): criterion 4 moved to a new PENDING node `resume-isr-allow-lang-live` (appended to the diagram), and this node's acceptance row rewritten to criteria 1-3. Option (a) needs a push, which is the operator's `/ship` seal gate, not this pass's.
   ## Acceptance criteria clarified: "…build+lint+typecheck+test clean; after deploy, preview/live `?lang=en` returns the EN introduction." → "…build+lint+typecheck+test clean. Post-deploy live check moved to `resume-isr-allow-lang-live`."
2. Paraphrased `{ same as above }` → replaced with the real second file, re-captured in pass 2 (`NITRO_PRESET=vercel npm run build`, `vercel build exit=0`, then `cat` of both files; `.vercel/` removed). Both files verbatim in `## Output` above.
