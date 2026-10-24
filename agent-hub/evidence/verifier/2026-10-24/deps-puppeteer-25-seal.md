# 2026-10-24 - deps-puppeteer-25 (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `deps-puppeteer-25` (`haven/diagrams/dev-loop.prime-mermaid.md`, was last row, IN_PROGRESS)
- New PM status: SEALED (local scope) — row archived verbatim to `haven/diagrams/dev-loop-archive.md`, active row replaced by pointer; oldest pointer row (`cv-download-toast`, full row already in archive) pruned to keep 20 pointers.
- Notes graded: `evidence/implementer/2026-10-24/deps-puppeteer-25-plan.md`, `-diff.md`

## Isolation proof
Separate subagent spawned via the Agent tool, description "Verifier pass deps-puppeteer-25", fresh context launched by `/todo`; task string is the verifier brief (load verifier bundle, follow `verify_seal.md`, decide NodeBeforeCode + Vercel-preview scope), not the implementer's `/todo` "xử lý nhóm A" task. This pass did not write the diff.

## Reasoning
| Criterion (node row) | Evidence cited | OK |
|---|---|---|
| Pairing evidenced from `revisions.js` | plan: revisions table (25.11.0 → `153.0.8010.36`); diff: `chrome: '153.0.8010.36'`, `npm ls` → `@sparticuz/chromium@153.0.0` / `puppeteer-core@25.11.0`. Re-run confirmed both lines. | yes |
| `npm run build` + `npm run lint` + `npx nuxi typecheck` clean | diff Output: build rc=0 `✨ Build complete!`; lint rc=0, 0 problems; typecheck rc=0, 0 `error TS`. Commands match `doctrine/MEMORY.md` incl. Typecheck row. Not truncated. | yes |
| `npm audit` before/after | plan baseline `60 vulnerabilities (1 low, 3 moderate, 52 high, 4 critical)` (= issue's stated baseline) → diff `55 (1 low, 2 moderate, 49 high, 3 critical)` | yes |
| `/api/generate-pdf?lang=vi\|en` → 200 pdf, `%PDF`, same pages, identical but dates | diff: vi 200/160795 B/`%PDF-1.4`/3 pages, en 200/155689 B/3 pages, both equal to v23 baseline; masked-date compare "identical except CreationDate/ModDate". Re-run on a fresh server reproduced identical status/type/bytes/magic/page counts. | yes |
| Real "Tải CV" (`data-shortcut="d"`) click → 200 PDF, 0 console errors | diff Browser verification: `BUTTON "Tải CV d"`, `200 application/pdf content-length=160795`, `console issues: none`. Script (`scratchpad/cdp-pdf.cjs`) collects `error` + `warn` + `pageerror` (so hydration warnings would show), filter excludes only `/visit` + "Failed to load resource". `bytes=0` is explained (body consumed into blob) and content-length matches curl. Concrete, citeable. | yes |
| Trap recorded in `doctrine/domains/PROJECT.md` | diff table + new Traps row (seen, see Re-run note) | yes |
| Comments per code-comments.md | N/A — no source file changed (only package.json/lockfile + hub md) | yes |
| Supersedes / Still open (7b) | `## Supersedes: none` (no other open #260 row on the diagram); `## Still open` lists Vercel preview | yes |

### (a) Disclosed `NodeBeforeCode` violation — not a REOPEN
`npm install` ran before the node row existed. Precedent `evidence/verifier/2026-08-16/centralize-color-tokens-seal.md` (same situation: self-disclosed, node + full evidence exist by seal time, no corrective action possible retroactively) ruled it a recorded process finding, not a REOPEN. Same here: disclosed unprompted in the plan's "Process deviation", only the install preceded the row, no other file touched. Recorded as a process warning. Forbidden state `ADHOC_WORK`: not hit at seal time (node exists, worker flow followed).

### (b) Vercel preview scoped out as Still open — legitimate, with a condition
Issue #260's "Acceptance riêng" does require a PDF download "trên preview deploy Vercel", and its "Đã kiểm chứng" asks to confirm the Vercel Node runtime (`puppeteer-core@25` needs `node >=22.12.0`). Neither can be produced before the seal gate permits a push (a preview deploy is itself an outward-facing action), so REOPENing for it would deadlock the node. Splitting local proof (sealed here) from the post-push check is the correct scope. Condition carried forward: **this SEAL does not complete issue #260.** The PR for `feature/260` must not use `Closes #260` (or #260 must be reopened/left open) until, on the Vercel preview URL: (1) "Tải CV" downloads a PDF that opens, and (2) the deployment's Node runtime is confirmed ≥22.12 (the repo's `engines.node ">=24"` makes this likely, but it's not evidenced). Note that after archiving, this Still-open item lives only in the archive row + notes, not on the active diagram — the operator/`/ship` step must carry it.

### Forbidden states
`ADHOC_WORK` no (see (a)) · `NO_EVIDENCE` no (plan + diff notes) · `EDIT_UNVERIFIED` no (verbatim build/lint/typecheck/audit + CDP) · `CODE_IN_HAVEN` no (only diagram md) · `DIAGRAM_DRIFT` no (row existed, now SEALED).

### Seal gate / proportionality
No outward-facing action taken (`Seal gate: none`). Diff = 1-line range change + lockfile + 1 Traps row + 1 diagram row; no source change. `~` pin justified by the Trap. Proportionate.

## Re-run
partial — `npm ls puppeteer-core @sparticuz/chromium`, `grep chrome:` in `node_modules/puppeteer-core/lib`, `.output/server/node_modules/puppeteer-core/package.json` version (`25.11.0`), and a fresh prod server (`PORT=4021 node .output/server/index.mjs`, killed after) with `curl /api/generate-pdf?lang=vi|en` → `vi http=200 type=application/pdf bytes=160795 %PDF-1.4 3 pages`, `en http=200 type=application/pdf bytes=155689 %PDF-1.4 3 pages`. No rebuild, no lint/typecheck/CDP re-run. Reason: production-risk path (issue #260 Rủi ro: prior Vercel/chromium prod bug) whose remote half can't be checked pre-push, so the local PDF path is the only pre-merge gate — closest to the "higher risk than an ordinary diff" exception; the note itself was complete. Disclosure: this pass also ran `git diff` on `PROJECT.md` and `package.json` (a look at the diff, against `EvidenceOnly`'s "only read the note"); it only confirmed what the note states and did not change the verdict.
