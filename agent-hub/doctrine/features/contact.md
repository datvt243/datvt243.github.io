# Contact page

- Status: verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/contact-spec.md`
- Source: backfill from code
- Issues: #426, #437
- Anchors: `pages/contact.vue`, `themes/portfolio-dev/pages/contact/Index.vue`, `app.config.ts`, `nuxt.config.ts`

## Goal
Visitors find how to reach the owner and can send him an email from a short
form.

## Behavior
1. `/contact` and `/en/contact` are prerendered at build time. All data comes
   from `app.config.ts` `contact` (no API call).
2. Sidebar "contacts": phone (`tel:` link), email (`mailto:` link), and
   address. In `en` the address is shown without Vietnamese diacritics; in
   `vi` as written.
3. Sidebar "find-me-also-in": one link per `contact.social` entry (github,
   linkedin, website), new tab, `noopener noreferrer`, with a grommet icon
   (`website` uses the globe icon), name capitalized.
4. The form has name, email (type email) and message, all required. Submit
   opens the visitor's mail client via `mailto:<contact.email>` with subject
   "Portfolio contact from <name or 'someone'>" and body "<message>\n\n—
   <name> (<email>)". Nothing is sent by the site itself.
5. A hint above and a fallback line below the form (localized) tell the
   visitor it opens their mail app and give the email address.
6. SEO description is the localized `contact.seoDescription` filled with
   email, phone and the (locale-adjusted) address.

## Acceptance criteria
- `npm run generate` (or `npm run build` prerender) emits `/contact` and
  `/en/contact` HTML.
- Submitting the filled form in a browser navigates to a `mailto:` URL whose
  `subject` starts with `Portfolio contact from`.
- Submitting with an empty required field is blocked by the browser.
- `/en/contact` shows `Tan Binh, Ho Chi Minh`; `/contact` shows
  `Tân Bình, Hồ Chí Minh`.

## Edge cases
- Visitor has no mail client → nothing visible happens; the fallback line
  still shows the address.

## Out of scope
- Server-side sending, storing messages, spam protection.
- The `google_map` value in `app.config.ts` (not rendered anywhere).

## Open questions
1. The mail subject is always English ("Portfolio contact from …") even on
   the Vietnamese page. Intended? → **Answer (operator 2026-11-07):** Bug — #426
2. `contact.google_map` exists in `app.config.ts` but nothing renders it.
   Remove, or should the page show a map? → **Answer (operator 2026-11-07):** Change: remove — #437
3. Labels `_name:`/`_email:`/`_message:` and the button `submit-message` are
   untranslated (code-metaphor). Confirm that is deliberate like the nav tab
   names. → **Answer (operator 2026-11-07):** Intended (code-metaphor, like nav tab names)

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
| 2026-11-07 | Operator confirmed Behavior + answered all open questions; Status → verified | analyst backfill re-check, see `evidence/analyst/2026-11-07/contact-spec.md` | - |
