# 2026-10-31 - pdf-two-pages (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `pdf-two-pages` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #284 "bug(pdf): CV PDF drops arrow glyphs, leaves near-empty 3rd page, filename is the email". Arrows, orphan heading, filename and grouped skills were done in #317 (`pdf-ats-polish`, archived). Remaining AC per the issue comment: "PDF ≤ 2 trang". Branch `bug/284` off `staging` 7ea5582.
- Operator decision (AskUserQuestion): "Bỏ Stack trùng + thu layout" over dropping duplicate projects or leaving it to the backend.
- Status: `sealed_pending_verifier`

## Hub bytes before
80112 (measured before the node row was appended)

## Root cause (measured on staging 7ea5582)
Before, with the current data: vi 3 pages, en 3 pages. Each job printed its stack twice: the description ends with its own `<p><strong>Stack:</strong> …</p>` (all 3 non-break jobs, vi + en) and `entry()` appended a generated `Stack: …` line. Layout alone (10pt / 1.3 / 12mm) still gave 3 pages (vi page 3 = Education + Languages); tightening p/li/section spacing got it to 2.

## Acceptance criteria
1. vi and en PDFs are 2 pages on current backend data.
2. Each job shows one Stack line; projects (no Stack in their description) keep their generated line.
3. No heading alone at a page bottom, no missing glyphs.
4. Filename stays name-based.
5. build + lint + typecheck + `npm test` clean.

## Diff
| File | Why |
|---|---|
| `server/utils/createPDFAts.ts` | `entry()` skips the generated stack line when the body already contains `Stack:` or `<stackLabel>:` (empty label ignored, so a bare `:` never matches); CSS: body 10.5→10pt, line-height 1.4→1.3, p/h/ul margin 6→4pt, li 2pt, section 12→10pt, entry-body 3→2pt |
| `server/api/generate-pdf.ts` | page margin 15→12mm |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Output
```
npm run lint → lint=0
npx nuxi typecheck → typecheck=0, `grep -c "error TS"` = 0
npm test →       Tests  11 passed (11)
npm run build → ◆ ✨ Build complete in 13.8s!
vi pages: 2 Content-Disposition: attachment; filename="Vo-Tan-Dat-CV.pdf"
en pages: 2 Content-Disposition: attachment; filename="Vo-Tan-Dat-CV.pdf"
onrender=0
```
(build + server env NODE_API=NUXT_PUBLIC_NODE_API=http://localhost:4199, a python mock serving vi/en payloads saved from the live backend earlier today with operator approval; page count = `/Type /Page` objects)

## Visual check
Read the rendered vi PDF page by page (`.playwright-mcp/pdf284-after-vi.pdf`, before: `pdf284-before-vi.pdf`, en: `pdf284-after-en.pdf`):
- Page 1: header → Summary → Skills → Laidon (one "Stack:") → career break 05/2024. Page 2: JOBTEST → … → Projects → Education → Languages.
- Each of Laidon/JOBTEST/FASTCODING shows only the bold "Stack:" from its description; the 3 projects show "Công nghệ: …".
- No heading at a page bottom; Vietnamese diacritics and "->" intact.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 2 pages | Output: vi 2, en 2 |
| 2 one Stack per job | Visual check |
| 3 no orphan/glyph loss | Visual check |
| 4 filename | Content-Disposition lines |
| 5 checks | Output block |
| comments per code-comments.md | one `//` WHY line on the dedupe |

## Supersedes: none

## Still open
- none for #284's AC. Vi page 2 is nearly full: a few more lines of backend content would make it 3 pages again.

## Noticed, not done
- The site's Experiences block likely shows the same Stack twice (description + `skills` line, `Experiences.vue:65`); not checked, out of scope.
- EN education still Vietnamese — backend, tracked in datvt243/resume-nodejs-api#330.
- Only Chrome on macOS rendered the PDF; production uses @sparticuz/chromium on Vercel (same Arial fallback chain, Liberation Sans there) — line wrap may differ slightly.

## Seal gate
none (commit/push left to `/ship`)
