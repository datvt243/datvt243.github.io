# 2026-09-20 — p3-nice-to-have-fixes (verifier verdict)

**Worker:** verifier
**Node:** `p3-nice-to-have-fixes`
**New PM status:** SEALED

## Isolation proof
This pass was spawned with a task string beginning "You are being spawned
as the `verifier` worker for the datvt243.github.io agent-hub. This is a
fresh, independent context — do NOT trust or reuse any reasoning from
whoever implemented this change" and instructing an independent re-run of
build/lint/CDP on a NEW dev-server port (4288) distinct from the
implementer's own port (4177). This is a materially different spawn
string from the implementer's own task ("Fix P3/nice-to-have findings
from portfolio review — issue #181..." per the plan note's `## Task`
line) — confirming a genuinely separate subagent context, not a
self-report.

## Reasoning

1. **Contact fallback line, real email, visible** — Independently
   re-ran: fresh `npm run dev` on port 4288, connected via
   `puppeteer-core` to the existing healthy Chrome debug instance (port
   9888, confirmed via `curl -s http://localhost:9888/json/version`
   returning a valid response — no relaunch needed, unlike the
   implementer's session). Navigated to `/contact` and checked
   `document.body.innerText`: the real configured email
   (`votan.it@gmail.com`, cross-checked against `app.config.ts`'s
   `contact.email`) appears **twice** on the page — once in the
   pre-existing sidebar, once inside the new fallback sentence
   specifically: `"...được ứng dụng email, bạn có thể liên hệ trực tiếp
   qua votan.it@gmail.com."` — matching the new `contact.mailFallback` vi
   string in `i18n/locales/vi.json` verbatim. Not a placeholder.

2. **Reduced-motion guard — the core technical claim, reproduced
   independently** — `page.emulateMediaFeatures([{ name:
   'prefers-reduced-motion', value: 'reduce' }])`, then
   `getComputedStyle` on a `.transition-opacity-enter-active` probe
   element: **`1e-05s`** (0.01ms, matches the CSS literal in
   `assets/css/styles.scss`'s new `@media (prefers-reduced-motion:
   reduce)` block exactly). Re-checked after `emulateMediaFeatures([{
   name: 'prefers-reduced-motion', value: 'no-preference' }])` +
   `page.reload()`: **`0.4s`** (the original, unmodified duration). This
   confirms the guard is real, correctly gated on the media feature (not
   applied unconditionally), and — critically — is a near-zero
   **non-zero** duration, not `transition: none`, which per the
   implementer's own stated reasoning would leave Vue's `<Transition>`
   waiting forever for a `transitionend` event that would never fire.
   Console errors during both checks: `[]` (empty).

3. **Build clean** — Independently re-ran `npm run build` from the repo
   root (no cache wipe). Verbatim tail: `[@nuxt/image] WARN sharp
   binaries for darwin-arm64 cannot be found...` (pre-existing, unrelated
   warning) then `[nitro] ✔ You can preview this build using node
   .output/server/index.mjs` / `✨ Build complete!`. Matches the
   implementer's note exactly, no new errors/warnings.

4. **Lint clean, baseline unchanged** — Independently re-ran `npm run
   lint`. Verbatim: `✖ 13 problems (0 errors, 13 warnings)` — exact match
   to the implementer's note and to the baseline cited by every prior
   sibling node today (`fix-blog-author-tag`, `p1-portfolio-review-fixes`,
   `p2-polish-fixes-round2`). None of the 13 warnings are in any file this
   diff touched (confirmed by file paths in the lint output: `stores/
   resume.ts`, `PostCategories.vue`, `github/part/Language.vue`,
   `post/Detail.vue`, plus one more — none of these are the diff's 4
   files).

5. **Diff matches the evidence note verbatim** — `git diff` on all 4
   changed files (`themes/portfolio-dev/pages/contact/Index.vue`,
   `assets/css/styles.scss`, `i18n/locales/en.json`,
   `i18n/locales/vi.json`) reproduced exactly what the diff note
   describes: a single `<p>` with `t('contact.mailFallback', { email:
   contact.email })` under the submit button; a `@media
   (prefers-reduced-motion: reduce)` block targeting
   `.transition-opacity-enter-active`/`-leave-active` with
   `transition-duration: 0.01ms !important` (not `transition: none`); one
   new i18n key (`contact.mailFallback`) in each locale file. No
   unrelated changes — proportional to the node (`SmallestDiff`
   satisfied).

6. **Scope-out of items 3 (tab-gated resume) and 4 (test suite) is
   textually grounded, not corner-cutting** — Ran `gh issue view 181`
   directly. The issue's own text: item 2 (issue's own numbering; "3" in
   the implementer's note) — "Resume-panel content is entirely tab-gated,
   no scroll-through option... **A deliberate consequence of the IDE/
   editor metaphor, not a bug** — consider a single-scroll alternative...
   **if worth the trade-off**." Item 4 — "No automated test suite
   exists... **Candidate's own call** on whether/when to add one — **not
   recommended here purely to "look complete."**" Both are the issue
   author's own explicit framing as optional judgment calls, not bugs —
   confirms the implementer's scope decision to leave them uncoded is a
   legitimate, textually-grounded call, not a shortcut.

7. **No test tooling silently added** — `find . -iname "*.test.*" -o
   -iname "*.spec.*"` (excluding `node_modules`, `.nuxt`, `.output`)
   returns 0 results. `grep -n '"test"' package.json` returns 0 results
   (no `test` script). Matches the plan note's claim exactly.

8. **Forbidden states scan** — `ADHOC_WORK`: no, work traces to node
   `p3-nice-to-have-fixes` on the diagram. `NO_EVIDENCE`: no, both plan
   and diff notes exist. `EDIT_UNVERIFIED`: no, every claim above was
   independently reproduced, not just re-read. `CODE_IN_HAVEN`: no, no
   code under `haven/`. `DIAGRAM_DRIFT`: none once this verdict updates
   the PM status row.

9. **Seal gate** — no outward-facing action (no commit/push/PR) taken by
   either the implementer or this verifier pass; correctly recorded as
   "none" in the implementer's note. N/A for this verdict.

## Re-run
`full` — independently re-ran `npm run build`, `npm run lint`, and the
full CDP verification (own `npm run dev` on port 4288, a freshly written
script, not the implementer's scratch script) from a live, healthy Chrome
debug instance (no relaunch needed this time — `curl -s
http://localhost:9888/json/version` returned healthy on first check).
Reason: per `recipes/verify_seal.md`'s "Re-run scope" exception list,
this touches a visual/behavior surface (contact form UI +
accessibility-motion CSS), matching the sibling nodes verified today
(`fix-blog-author-tag`, `p1-portfolio-review-fixes`,
`p2-polish-fixes-round2`), all of which also did a full re-run.

## Verdict: SEAL
Every acceptance criterion in the plan note has real, independently
reproduced evidence: the contact fallback renders with the real email,
the reduced-motion guard is a genuine near-zero (not `none`) duration
correctly gated on the media feature, build and lint are verbatim clean
and match baseline, and the deliberate scope-out of items 3/4 is grounded
in issue #181's own text. No forbidden state triggered.
