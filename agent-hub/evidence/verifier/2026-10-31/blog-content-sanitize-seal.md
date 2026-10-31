# 2026-10-31 - blog-content-sanitize (verifier: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `blog-content-sanitize` (#291), branch `bug/291` off `staging` 7502e90, uncommitted
- Note graded: `evidence/implementer/2026-10-31/blog-content-sanitize-diff.md`

## Verdict: SEAL

## Cited
| Criterion | Result |
|---|---|
| 1 content sanitized before the cached handler stores it | PASS. The note says the `sanitizePostHtml` call sits inside the `defineCachedEventHandler` function. The build grep backs this up: `allowedTags` is found in `.output/server/chunks/routes/api/blogs/detail/_id_.mjs`, the detail route's own chunk |
| 2 XSS vectors stripped, formatting kept | PASS. Note: `Tests  13 passed (13)` (was 11, +2). Re-run: `Test Files  5 passed (5)` / `Tests  13 passed (13)`. Extra local probe (see Re-run), all neutralised: `JaVaScRiPt:`, entity-encoded `java&#x73;cript:` and leading-space `javascript:` hrefs → `<a>x</a>`. `img src=javascript:`/`data:` → `<img />`. `<svg onload>`, `<object>/<embed>/<form>` → `""`. `<style>` and inline `style` are dropped. `<math xlink:href>` → `m`. The `noscript` mXSS → `<p></p>`. https links and `code class="language-js"` are kept, and `onclick` is stripped |
| 3 sanitize-html traced into `.output` | PASS. `ls .output/server/node_modules \| grep sanitize → sanitize-html` |
| 4 build + lint + typecheck + test | PASS. `lint=0`, `typecheck=0` with `grep -c "error TS"` = 0, `Tests  13 passed (13)`, `◆ ✨ Build complete in 14.0s!` |
| comments per code-comments.md | PASS. The note cites one `/** */` WHY block on the util |
| 7b Supersedes/Still open | PASS. `## Supersedes: none` and `## Still open` are both present. No other open #291 row is on the active diagram |

## Forbidden states / seal gate / proportionality
- Forbidden states: none hit. The node exists, the note has real output,
  no code is in `haven/`, and PM status is updated with this SEAL.
- Seal gate: `none (commit/push left to /ship)`. Nothing was committed or
  pushed, and no external API was called.
- Proportionality: PASS. 1 new util, 1 edited handler, 1 test file and 2
  packages. The new dependency is justified: the note shows a probe of the
  in-tree `ultrahtml` sanitizer that kept `onclick` and `javascript:`.
- Visual: the intended change isn't visual, so no CDP check was required.
  The `lint=0`/`typecheck=0` summaries follow the accepted
  `pdf-two-pages` precedent.
- Risks carried forward (not blocking, from the note's "Noticed, not
  done"):
  - Real post HTML was never inspected. Editor-specific `class`/`style`
    on `span`/`p` will now be stripped, so old posts may lose some
    formatting. Spot-check a real post once it's deployed.
  - Cache entries from before the fix aren't proven invalidated on deploy.
  - Links with `target="_blank"` are kept without `rel="noopener"`.
    Modern browsers imply noopener, so this is minor.

## Isolation proof
This pass ran as a separate verifier subagent. Its task string starts "You
are running `/worker verifier` ... This is pass 2 of `/todo #291`; you are
a separate subagent with a clean context (NeverVerifyOwnWork)" and names
node `blog-content-sanitize`. That string differs from the implementer's
task. This context didn't write the diff and didn't open the source diff.
It read the note and the diagram row, and it ran the util as a black box.

## Re-run
partial. I ran `npm test` (Node v24.19.0) plus a local black-box probe
script that imports `server/utils/sanitizePostHtml.ts` and checks 13 extra
vectors. Reason: this node is outward-facing (security, on a live
production route). I did not re-run build, lint or typecheck, ran no CDP
check, and made no network calls.

## PM status
`blog-content-sanitize` went from IN_PROGRESS to SEALED in place. The full
row was appended to `haven/diagrams/dev-loop-archive.md`, and the active
row was replaced with a pointer. That made 21 pointer rows, so the oldest
pointer (`pdf-ats-polish`) was deleted. Its full row is already in the
archive.
