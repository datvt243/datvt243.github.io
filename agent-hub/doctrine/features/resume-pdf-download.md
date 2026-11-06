# Resume PDF download

- Status: draft
- Source: backfill from code
- Issues: #29, #179, #198, #206
- Anchors: `composables/useDownloadResume.ts`, `server/api/generate-pdf.ts`, `server/utils/createPDFAts.ts`, `themes/portfolio-dev/pages/resumeObject/Hero.vue`

## Goal
A recruiter can download the resume as a single-column, ATS-parser-friendly
PDF in the language they are reading.

## Behavior
1. The hero's "Download CV" button (shortcut `D`) calls
   `/api/generate-pdf?lang=<current locale>`.
2. While loading, the button is disabled and shows the localized "downloading" label, and a
   persistent toast says the same.
3. On HTTP 200 the browser saves the PDF using the filename from the
   `Content-Disposition` header (fallback `resume.pdf`), and the toast turns
   into a success message (4s).
4. On any non-200 status or network error, the toast turns into an error
   message (5s) and the button becomes usable again; clicking again is the
   retry.
5. Server: `lang` is `en` or else `vi`. A generated PDF is kept in memory per
   language for 1 day (not in dev) and served from there.
6. Otherwise the server fetches the resume (same whitelist and 502 rule as
   `resume-home.md`), builds HTML with `pageRenderAts`, launches headless
   Chrome (`@sparticuz/chromium` on Vercel, else `PUPPETEER_EXECUTABLE_PATH`,
   else an OS default path), and prints A4 with 12mm margins, no background,
   tagged PDF.
7. PDF content, in order: name, headline, address, contact links (phone,
   email, LinkedIn, GitHub, website), then sections Summary, Skills,
   Experience, Projects, Education, Certifications, Awards, Languages, with
   localized headings; empty sections are omitted. Plain values are
   HTML-escaped; rich-text descriptions are reduced to an allow-list of tags
   (`p ul ol li strong em b i br`, every attribute dropped, script/style
   removed), not escaped. `→` is replaced by `->`.
8. Filename: the owner's `cvFileName` (diacritics removed, only
   `[A-Za-z0-9_-]` kept) or else "<Full Name> CV" made ASCII and
   dash-separated, then `-VI` or `-EN`, then `.pdf`.

## Acceptance criteria
- `npm test` passes, including `tests/createPDFAts.test.ts`.
- `curl -sI '<host>/api/generate-pdf?lang=en'` returns `Content-Type:
  application/pdf` and `Content-Disposition: attachment; filename="…-EN.pdf"`.
- `?lang=xx` returns the same file name suffix as `?lang=vi` (`-VI`).
- Clicking the button in a real browser downloads a PDF and shows the
  success toast; with the server stopped it shows the error toast and the
  button is enabled again.

## Edge cases
- Resume API down → the request fails (5xx) → error toast.
- `generalInformation` as object or one-item array → both produce skills and
  languages in the PDF.
- Second request within 1 day → served from memory, no Chrome launch (per
  server instance only).

## Out of scope
- A two-column/"classic" template (removed).
- Persistent cache across server instances.

## Open questions
1. If Chrome fails during `page.setContent`/`page.pdf`, `browser.close()` is
   never called (no try/finally) — a possible leaked Chrome process per
   failure. Intended to fix?
2. The object URL created for the download is never revoked. Acceptable?
3. `useDownloadResume.ts`'s comment mentions an "About tab's own button", but
   only `Hero.vue` uses the composable now. Is a second button still wanted?
4. The 1-day in-memory cache means a backend resume edit can take up to a day
   (per warm instance) to reach the PDF. Intended?

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
| 2026-11-06 | Reviewer corrections (code + live) | `evidence/spec-backfill/2026-11-06/review.md` | - |
