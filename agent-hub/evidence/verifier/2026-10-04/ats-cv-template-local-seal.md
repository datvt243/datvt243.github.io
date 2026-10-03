# 2026-10-04 — ats-cv-template-local (verifier verdict)

**Worker:** verifier
**Version:** 0.1.0
**Node:** `ats-cv-template-local` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
**Verdict:** SEAL
**New PM status:** SEALED (row updated in place, not moved)

## Isolation proof
Spawned via the Agent tool as a separate subagent, task string beginning
"You are being spawned as the `verifier` worker for the datvt243.github.io
agent-hub (pass 2 of `/todo #206`). This is a fresh, independent context —
you did NOT write the diff being graded". This context did not write any
part of the diff. Disclosure: the session scratchpad directory is shared
with the parent session (it already held the implementer's `pdf_*.pdf`
extracts); this pass wrote its own separate `p_*.pdf` files and did not
reuse those.

## Reasoning
Command check: the note's commands are `npm run build` + `npm run lint`,
verbatim from `doctrine/MEMORY.md`; no "tests pass" claim; output not
truncated. The extra `tsc` run is labelled as extra.

| # | Criterion (from `-plan.md`) | Evidence (implementer, cited) | Independent check (this pass) |
|---|---|---|---|
| 1 | No query → unchanged classic | `200 application/pdf`, filename without `-ats`, `spacedLetterRuns 16` | `HTTP/1.1 200 OK Content-Type: application/pdf Content-Disposition: attachment; filename="votan.it_gmail.com.pdf" md5=e5a67287…`; `pdf-parse`: 2 pages, classic letter-spaced layout (`spacedRuns 21` under my regex). Only content change is the disclosed skills restoration (see below). |
| 2 | `?template=ats&lang=vi\|en` → ATS PDF | `spacedLetterRuns 0`, localized sections, `Present`/`Hiện tại` | vi: 3 pages, `spacedRuns 0`, headings `TÓM TẮT, KỸ NĂNG, KINH NGHIỆM LÀM VIỆC, NGOẠI NGỮ`, `Hiện tại` true/`Present` false. en: `spacedRuns 0`, `SUMMARY, SKILLS, EXPERIENCE, LANGUAGES`, `Present` true/`Hiện tại` false. `grep` of `createPDFAts.ts`: `font-family: Arial, Helvetica, "Liberation Sans", sans-serif`, `letter-spacing: normal`, no `<link`/`@import`/web-font URL. |
| 3 | Cache keyed per template+lang | Map keyed `classic`/`ats-vi`/`ats-en`; `bogus` md5 == classic | Read `server/api/generate-pdf.ts`: `template` normalized to `ats`\|`classic`, `lang` to `en`\|`vi`, `cacheKey = template === 'ats' ? \`ats-${lang}\` : 'classic'` — classic ignores `lang` (correct: classic has no lang), keyspace bounded to 3 (no unbounded growth from arbitrary query strings). Curl: `bogus` md5 == classic `e5a67287…`; `ats&lang=fr` md5 == `ats&lang=vi` `3f4bb8e4…`; `ats&lang=en` `beb26b5e…` distinct. Filename suffix `-ats` follows the template, stored with each entry. |
| 4 | Both buttons give choice, ATS passes locale | CDP: 4 buttons/page; click → `?template=ats&lang=vi` on `/`, `&lang=en` on `/en` | `composables/useDownloadResume.ts` passes `locale.value`; screenshot `after-click-vi.png` shows `Tải CV` + `CV ATS` pills in the Hero; `about-light.png` shows both About buttons. |
| 5 | i18n both locales, tokens only | +2 keys each; computed colors dark `rgb(166, 174, 199)` / light `rgb(69, 78, 109)` | `git diff i18n/`: `downloadCvAts`, `downloadCvAtsHint` in both `en.json` and `vi.json`. Literal-color regex over added lines of `themes/` diff: `no literal colors`; classes used (`border-theme-border-subtle`, `text-theme-muted`, `hover:text-theme-accent`, `hover:border-theme-accent/50`) all exist in `tailwind.config.js` (`'border-subtle': themeColor('--theme-border-subtle')`, `muted: themeColor('--theme-muted')`). |
| 6 | Build + lint clean, CDP | `✨ Build complete!`; lint `0 errors, 13 warnings` == baseline 13 | Re-ran on Node `v24.19.0`: `build exit 0`, `└  ✨ Build complete!`; `npm run lint` → `✖ 13 problems (0 errors, 13 warnings)`. |

### Focus items
- **(a) Scope reduction vs issue #206's 3 checkboxes**: honestly disclosed. The
  plan note records two operator AskUserQuestion decisions ("Template only,
  public"; "Render ATS locally") with the reason (backend endpoints need the
  owner's ~1h JWT, `auth.service.ts:126`). The diff note's "Noticed, not done"
  states checkboxes 2 and 3 stay unaddressed and the issue "should not be
  auto-closed without the operator agreeing". `gh issue view 206` confirms it
  is still OPEN with 3 checkboxes. Checkbox 3 (API types for `template`) is
  partly covered in-repo (`AtsLang`, `template` param) but not as a backend
  client. Operator sanction is a recorded claim in the note; this pass cannot
  replay the AskUserQuestion transcript.
- **(b) Classic PDF behavior change**: real and justified. `types/resume-api.ts`
  already declares `generalInformation: GeneralInformation | GeneralInformation[]`,
  so the old array-only `.length` check was wrong for the object shape. The
  classic PDF now contains `Programming:` (confirmed by my `pdf-parse` run).
  Within SmallestDiff: 1 normalizer of about 5 lines that the ATS acceptance
  needed (skills section), disclosed as a user-visible change, not a refactor.
- **(c) Theme tokens**: see criterion 5, 0 literal colors.
- **(d) Cache key**: see criterion 3, correct and bounded.

### Forbidden states
`ADHOC_WORK` no (node on diagram, issue #206) · `NO_EVIDENCE` no (plan + diff
notes + 3 screenshots) · `EDIT_UNVERIFIED` no (build/lint/curl re-confirmed) ·
`CODE_IN_HAVEN` no (only the diagram `.md` row changed under `haven/`) ·
`DIAGRAM_DRIFT` no (row now SEALED).

### Seal gate
No outward-facing action by implementer or verifier. Nothing committed,
pushed or opened. `git add -N` on the new file touched only the local index
(disclosed).

## Re-run
`partial` — `npm run build` + `npm run lint` (warm cache, not cold) + serving
`.output` on port 4997 and curling `/api/generate-pdf` 5 ways + `pdf-parse`
text extraction. No CDP click replay (the note's CDP evidence was concrete).
Reason: this is a caching change on a public production endpoint that also
changes the existing classic PDF's content, which NORTHSTAR names as
high-risk (outward-facing exception in "Re-run scope"). Test server killed
afterward.

Disclosure: SOUL invariant 2 says to read only the note. This pass also ran
`git diff` on `generate-pdf.ts`, `useDownloadResume.ts`, `themes/` and
`i18n/`, because the dispatcher explicitly asked for an independent check of
items (c) and (d). The note alone quoted no class strings or cache-key
expression. The verdict does not rest on that read alone; the curl md5
results and the literal-color scan are the cited evidence.
