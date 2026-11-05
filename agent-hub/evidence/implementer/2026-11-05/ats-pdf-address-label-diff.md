# 2026-11-05 - ats-pdf-address-label (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `ats-pdf-address-label` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #392 "Resume PDF: CV review/ATS sites fail to detect address". Branch `bug/392` off `staging` 283f0a1 (created with `gh issue develop`), via `/todo "fix tất cả các issue bug"`.
- Status: `sealed_pending_verifier`

## Hub bytes before
80619 (measured before the node row was appended)

## Diff
| File | Why |
|---|---|
| `server/utils/createPDFAts.ts` | `address` heading added to both `HEADINGS` (`Địa chỉ` / `Address`). The address is removed from the ` · `-joined contact line and rendered on its own `<p class="contact">` line as `<label>: <address>`, above the phone/email/links line, only when an address exists. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

No comment added or changed.

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (repo root, from `doctrine/MEMORY.md`)

## Output
```
npm run build → build=0, ◆ ✨ Build complete in 14.6s!
  1 WARN: components-*.js (369:0): A comment "/* @__NO_SIDE_EFFECTS__ */" … (pre-existing, same as script-csp-enforce-diff.md)
npm run lint → lint=0
npx nuxi typecheck → typecheck=0 ts_errors=0
npm test → Test Files  8 passed (8) / Tests  20 passed (20)
```

## PDF check (fixture data, no backend call)
`scratchpad/ats/render.ts` run with `npx vite-node --config vitest.config.ts` imports `pageRenderAts` directly, feeds a fixture record, prints vi + en PDFs with puppeteer-core + local Chrome (A4), and the text is extracted with pypdf (`PdfReader(...).pages[0].extract_text()`):
```
== vi
Võ Tấn Đạt
Frontend Developer
Địa chỉ: Quận Gò Vấp, TP. Hồ Chí Minh
0901234567 · dat@example.com · https://linkedin.com/in/x · https://github.com/datvt243 · https://resume-nuxt-vert.vercel.app
KỸ NĂNG
== en
Võ Tấn Đạt
Frontend Developer
Address: Quận Gò Vấp, TP. Hồ Chí Minh
0901234567 · dat@example.com · https://linkedin.com/in/x · https://github.com/datvt243 · https://resume-nuxt-vert.vercel.app
SKILLS
```

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) Address on its own line with a localized label | PDF text: `Địa chỉ: Quận Gò Vấp, TP. Hồ Chí Minh` (vi), `Address: Quận Gò Vấp, TP. Hồ Chí Minh` (en), each its own line |
| (2) Phone/email/links line unchanged apart from losing the address | PDF text line 4 in both langs: `0901234567 · dat@example.com · https://linkedin… · https://github… · https://resume-nuxt-vert…`, same order and separator as before |
| (3) build+lint+typecheck+test clean | `build=0`, `lint=0`, `typecheck=0 ts_errors=0`, `Tests  20 passed (20)` |
| (4) Printed PDF has the labeled address line, both langs | PDF check above |
| Comments per code-comments.md | No comment added or changed |

## Supersedes
none (no other not-yet-SEALED row cites #392)

## Still open
- Issue #392's "Checked with at least one CV review website before/after" needs the real downloaded PDF uploaded by the operator after deploy; not doable without a real upload.

## Noticed, not done
none

## Seal gate
none (no commit/push in this pass)
