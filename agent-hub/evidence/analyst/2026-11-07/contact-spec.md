# analyst — contact — 2026-11-07

## Task (verbatim)
document contact

## Doc
`agent-hub/doctrine/features/contact.md` (existing bulk-backfill draft, re-checked per recipe step 4, not rewritten)

## Sources read
- `agent-hub/haven/workers/analyst/SOUL.md`
- `agent-hub/haven/workers/analyst/recipes/spec_feature.md`
- `agent-hub/doctrine/features/INDEX.md`
- `agent-hub/doctrine/domains/PROJECT.md`
- `agent-hub/doctrine/MEMORY.md`
- `pages/contact.vue`
- `themes/portfolio-dev/pages/contact/Index.vue`
- `app.config.ts (contact)`
- `nuxt.config.ts (routeRules)`
- `i18n/locales/en.json (contact.*)`

## Re-check vs code
Behavior 1–6 match code. routeRules `/contact`,`/en/contact` `prerender: true`; data from `useAppConfig().contact`, no fetch. Sidebar `contacts`: `tel:`, `mailto:`, address via `removeVietnameseTones` in `en`. `find-me-also-in`: `Object.entries(contact.social)` (github, linkedin, website), `_blank` `noopener noreferrer`, `grommet-icons:<name>` (`website` → `globe`), `capitalize`. Form: name/email(type=email)/message all `required`; `submitMessage` → `mailto:` with subject `Portfolio contact from ${name || 'someone'}` (English, Q1) and body `<message>\n\n— <name> (<email>)`. `contact.formHint` above, `contact.mailFallback` below. SEO `contact.seoDescription` with email/phone/locale address. `google_map` in `app.config.ts` unreferenced (Q2). Labels `_name:`/`_email:`/`_message:`, button `submit-message` literal (Q3). No discrepancy.

## Questions + answers
Operator (2026-11-07): "ok, behavior đúng" (Behavior section confirmed correct).
1. The mail subject is always English ("Portfolio contact from …") even on
   the Vietnamese page. Intended? → **Answer (operator 2026-11-07):** Bug — #426
2. `contact.google_map` exists in `app.config.ts` but nothing renders it.
   Remove, or should the page show a map? → **Answer (operator 2026-11-07):** Change: remove — #437
3. Labels `_name:`/`_email:`/`_message:` and the button `submit-message` are
   untranslated (code-metaphor). Confirm that is deliberate like the nav tab
   names. → **Answer (operator 2026-11-07):** Intended (code-metaphor, like nav tab names)

## Result
status: verified — every open question answered + operator confirmed Behavior.
`Status: verified — confirmed by operator 2026-11-07, see evidence/analyst/2026-11-07/contact-spec.md` set in doc + INDEX row; Issues: #426, #437. Behavior unchanged (describes code today; changes tracked by the issues).

## Isolation proof
Separate spawned agent (Agent tool), blank context. Received only the
dispatch prompt (5 tasks, operator's "ok, behavior đúng" confirmation, the
operator's answers + issue numbers). No implementer reasoning, no main
session transcript. All Behavior items re-checked by reading code myself.
