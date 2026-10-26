# 2026-10-26 - pdf-ats-polish (plan)

- Worker: implementer · Version: 0.1.0
- Node: `pdf-ats-polish` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #284 (PDF: missing → glyph, orphan heading / near-empty last page, filename = email, skills not grouped), branch `bug/284` off `staging`; worked in a separate git worktree, rebased onto `staging` cb60738 before writing notes.

## Hub bytes before: 77905

## Baseline (prod build, mock resume API with the captured real data, local Chrome; `scratchpad/p1/base-{en,vi}.pdf`)
```
Content-Disposition: attachment; filename="votan.it_gmail.com.pdf"
pages 3 (40 / 37 / 15 lines)
skill lines: ['Skills: JavaScript (ES6+), TypeScript, HTML5, CSS3, SCSS, Vue.js 2 & 3' ...]  (43 skills, one line)
arrows 2
```
Local macOS fonts have the → glyph, so the missing glyph (seen on Vercel's @sparticuz/chromium) can't be reproduced locally; the check is "no → left in the HTML sent to Chromium".

## Plan
1. Extract the #281 grouping rule (`Skills.vue`) into `utils/groupSkills.ts`; use it in `Skills.vue` and in `createPDFAts.ts` (PDF: one line per group, 'Other' localized).
2. `.heading { break-after: avoid }`; drop `.entry { break-inside: avoid }` (a long entry otherwise jumps whole to the next page, leaving a half-empty page).
3. `→` → `->` in the generated HTML.
4. File name `Vo-Tan-Dat-CV` (name without diacritics) on the server; client reads it from `Content-Disposition` instead of using the email.

## Acceptance criteria
1. No → in the PDF text; no replacement chars.
2. No section heading as the last line of a page.
3. `Content-Disposition` and the client download name = `Vo-Tan-Dat-CV.pdf`.
4. Skills grouped in the PDF (one line per group); Skills tab output unchanged.
5. Pages: report honestly (issue wants ≤ 2; current data is longer than at audit time).
6. build/lint/typecheck; comments per code-comments.md.
