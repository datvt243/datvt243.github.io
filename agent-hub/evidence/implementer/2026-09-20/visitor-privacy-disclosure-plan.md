# 2026-09-20 — visitor-privacy-disclosure (implementer plan)

- Worker: implementer
- Node: `visitor-privacy-disclosure` (new)
- Task: fix the "visitor IP/location logged with no disclosure" P1 item
  from the `.claude/review.md` audit's roadmap (Phase 2).

## Acceptance criteria
1. `plugins/VisitTracker.client.ts` fires a fire-and-forget `POST` to the
   resume backend on every real page load specifically so the backend
   captures the visitor's real IP/location — there is no privacy notice
   anywhere in the site.
2. Add a short, honest, one-line disclosure — not a full legal/cookie-
   banner treatment (not warranted for a personal portfolio, and the
   audit explicitly said not to invent compliance language) — visible
   somewhere in the site chrome. Feature itself must stay (legitimate
   value to the site owner), only add disclosure.
3. Needs both `i18n/locales/en.json` and `vi.json` entries, matching the
   existing i18n key-namespace pattern already used in the theme
   (`footer.*`).
4. Build clean + lint clean + real UI check via CDP (new visible text).

## Env vars
None needed.
