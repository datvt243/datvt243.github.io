# 2026-11-01 - seo-titles-og-image - SEAL

- Worker: verifier · Version: 0.1.0
- Node: `seo-titles-og-image` (issue #302, branch `feature/302`)
- Graded note: `evidence/implementer/2026-11-01/seo-titles-og-image-diff.md`
- Verdict: **SEAL**

## Isolation proof
Spawned as a separate subagent from `/todo` pass 2, with the task string "You are the VERIFIER pass of this repo's agent-hub, run from `/todo` as a separate subagent with a clean context (NeverVerifyOwnWork) ... Grade the implementer's note `agent-hub/evidence/implementer/2026-11-01/seo-titles-og-image-diff.md`". This context has no record of writing the diff; it read only the note (the diff is not opened directly).

## Re-run
none (audit only). Outputs are verbatim, untruncated, commands match `doctrine/MEMORY.md`, browser evidence is concrete. Not a `/release` gate.

## Checks
| Step | Result |
|---|---|
| 4 commands | `npm run lint` (lint=0), `npx nuxi typecheck` (typecheck=0, 0 `error TS`), `npm test` (14/14, test=0), `npm run build` (build=0, "Build complete in 14.0s"). Match MEMORY.md. |
| 5 truncation | Lint/typecheck/test full files. Build: a 148-line file cited by a complete grep for WARN/ERROR plus the one warning verbatim (lines 72-76, known Rollup annotation warning in a generated chunk). Acceptable, not hidden. |
| 6 UI evidence | puppeteer run output quoted: `document.title` + og:image after hydration, click nav to /github, and back, for `/` and `/en`; `console errors/warnings: []`, exit=0. The failed first attempt (viewport) is disclosed. |
| 7b open rows | `## Supersedes: none` with the grep cited; `## Still open: none`. |
| 8 forbidden states | None hit. Node row exists (no ADHOC_WORK), note exists, outputs run, no code in `haven/`, diagram row now updated. |
| 9 seal gate | No commit/push/PR/delete in the diff; operator left to do that. |
| 10 proportionality | 2 code files + one image; `computed` → const and the stale JSDoc drop are part of the touched line. Out-of-scope items listed under "Noticed, not done". |

## Acceptance (cited from the note)
| Criterion | Evidence | OK |
|---|---|---|
| 1 template on non-home pages, vi + en | SSR `<title>`: `Github — Võ Tấn Đạt` (vi/en), `Dự án — Võ Tấn Đạt` / `Projects — Võ Tấn Đạt`, `Liên hệ — Võ Tấn Đạt` / `Contact me — Võ Tấn Đạt`, `Blog — Võ Tấn Đạt` (vi, re-run after a cold 503 from the unmocked blog API) / `Blogs — Võ Tấn Đạt`; browser after click nav `Github — Võ Tấn Đạt` | yes |
| 2 no double name on home, vi + en | SSR `/` and `/en`: `<title>Resume Võ Tấn Đạt</title>`; same after hydration and back-nav | yes |
| 3 1200×630 file | `file`: `PNG image data, 1200 x 630, 8-bit/color RGB` | yes |
| 4 og/twitter image absolute + size + card | SSR `/` and `/en`: og:image and twitter:image `https://resume-nuxt-vert.vercel.app/og-image.png`, og:image:width 1200, og:image:height 630, twitter:card `summary_large_image` | yes |
| 5 served by built server | `curl -sI /og-image.png` → `HTTP/1.1 200 OK` | yes |
| 6 build/lint/typecheck/test + no console errors | see Checks row 4 and 6 | yes |
| comments per code-comments.md | one added `//` WHY line (why home opts out of the template), no `(#N)` ref; stale JSDoc with `(issue #179)` removed | yes |

## Notes for the operator (not blocking)
- Image brand choices (role text, colors, font, name form "Võ Tấn Đạt" vs `AppHeading` "Đạt Võ") were made without operator sanction; the note records the sources. Look at `public/og-image.png` before merging.
- og:image exists only on home, and og:title is not templated. Both are recorded under "Noticed, not done" and fit the node's scope.

## PM status
Row `seo-titles-og-image` IN_PROGRESS → SEALED in place, full row appended to `haven/diagrams/dev-loop-archive.md`, active row replaced with the pointer. Active pointers went to 21, so the oldest (`security-headers-baseline`, full row already in the archive) was dropped.
