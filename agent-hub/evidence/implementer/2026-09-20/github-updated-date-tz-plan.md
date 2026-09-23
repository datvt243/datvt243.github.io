# 2026-09-20 — github-updated-date-tz

**Worker:** implementer
**Version:** 1.0.0 (dev-loop diagram)
**Node:** `github-updated-date-tz` (new — no prior node matched, created per `pick_next.md`'s "No diagram matches yet" branch)
**Task:** Fix issue #202 — `/github` has a reproducible Vue hydration mismatch on production, root-caused to `themes/portfolio-dev/pages/github/part/Item.vue:77`'s `new Date(modelValue.updated_at).toLocaleDateString()`, which resolves the calendar date in whatever timezone the *runtime* happens to be in. Vercel's serverless function runs in UTC; a real browser client in Vietnam runs in ICT (UTC+7) — for a timestamp near a UTC day boundary, the two sides compute different calendar dates for the same instant, and Vue detects the SSR/client text mismatch.

## Hub bytes before: 130064

## Acceptance criteria
1. The date shown for a repo's "Updated on" line is computed identically regardless of which timezone the runtime (server or client) happens to be in.
2. `npm run build` clean, `npm run lint` clean, baseline unchanged.
3. Real reproduction of the actual failure mode: since this bug depends on a real client/server timezone MISMATCH, verifying only in a same-timezone local dev/build test (as prior sessions accidentally did for a related bug) would prove nothing — the fix must be checked with the server forced to UTC (matching Vercel) while the real client browser stays in its own local timezone (ICT, confirmed via `date +%Z` on this machine).

## Files to touch
- `themes/portfolio-dev/pages/github/part/Item.vue`

No env var needed, no new dependency.

## Noticed, not in scope for this node
`utils/formatDate.ts` and `utils/convertNumberToDate.ts` use the same class of local-timezone-dependent date getters (`getDate()`/`getMonth()`/`getFullYear()`), used for blog post dates and resume experience/project date ranges respectively. Same latent bug class, but not the one actually observed live — issue #202 itself scopes this out as a possible separate follow-up, not fixed here.
