# 2026-11-01 - resume-isr-allow-lang (plan)

- Worker: implementer · Version 0.1.0
- Node: `resume-isr-allow-lang` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row, appended)
- Issue: #361 · Branch `bug/361` (off `staging` at `270bb78`)
- Task (verbatim, issue body): "Phần đổi VI/EN thì personal-info đổi theo, ở localhost tôi check thấy work, trên live thì không, hãy kiểm tra."

## Hub bytes before: 80340

## Diagnosis
- Backend direct, `?lang=en` → `"introduction":"<p>Frontend Developer with 4+ years building enterprise SPAs with Java`; `?lang=vi` → `"introduction":"<p>Frontend Developer với hơn 4 năm kinh nghiệm xây dựng ứng dụng SPA`.
- Live `https://resume-nuxt-vert.vercel.app/api/resume`:
  ```
  == lang=en        x-vercel-cache: HIT   etag: W/"x6u1oCFcdL"  "introduction":"<p>Frontend Developer với hơn 4 năm kinh
  == lang=en&x=1    x-vercel-cache: MISS  etag: W/"x6u1oCFcdL"  "introduction":"<p>Frontend Developer với hơn 4 năm kinh
  == lang=vi        x-vercel-cache: HIT   etag: W/"x6u1oCFcdL"  "introduction":"<p>Frontend Developer với hơn 4 năm kinh
  ```
  Same etag for both locales, even uncached → not a stale CDN copy.
- `nuxt.config.ts` routeRule `'/api/resume': { isr: 60 }`. Vercel ISR strips the query unless `allowQuery` lists it (and `passQuery` passes it to the function), so `langOf` in `server/api/resume.ts` always sees no `lang` → `vi`. Local dev/node have no ISR → works there.
- Nitro 2.13.5 `presets/vercel/utils.mjs:369-371` sets `passQuery = true` when `allowQuery` lists a param.

## Acceptance
1. Rule is `{ isr: { expiration: 60, allowQuery: ['lang'] } }`.
2. `NITRO_PRESET=vercel npm run build` → `/api/resume` `.prerender-config.json` has `allowQuery` with `lang` and `passQuery: true` (staging: `{"expiration": 60}` only).
3. build+lint+typecheck+test clean.
4. Post-deploy (not provable locally): preview/live `?lang=en` returns the EN introduction.

## Blockers: none
