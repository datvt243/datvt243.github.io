# 2026-09-20 — fix-generate-pdf-vercel-chromium (verifier verdict)

**Worker:** verifier
**Node:** `fix-generate-pdf-vercel-chromium`
**New PM status:** SEALED (pending live Vercel preview confirmation before merge)

## Isolation proof
Spawned as a fresh subagent via the Agent tool with the task-prompt string
beginning "You are being spawned as the `verifier` worker for the
datvt243.github.io agent-hub. This is a fresh, independent context — do NOT
trust or reuse any reasoning from whoever implemented this change; verify
from scratch against real evidence." — a distinct spawn/description from
whatever task string produced the implementer's plan/diff notes, with no
shared conversation history. Note: a previous verifier attempt on this same
node was spawned but crashed mid-run due to a session/API rate limit before
producing any verdict — that crash carries no evidential weight; this is
the first real, completed verifier pass on this node.

## Reasoning
This SEAL means: the code change and everything locally-verifiable checks
out. It does NOT mean "confirmed working in production" — the Vercel-
specific `@sparticuz/chromium` path cannot execute on this macOS session
(Linux-x64-only binary) and requires a separate, required follow-up gate
(a real Vercel preview deployment test, per issue #193's own design)
before this branch can merge into `staging`/`main`. That gate is
explicitly out of scope for this seal, not a defect in this seal.

Independently verified, from scratch (not trusting the implementer's
reasoning):

1. **Diff matches the note's description.** `git diff -- server/api/
   generate-pdf.ts package.json package-lock.json` shows exactly: import
   swapped from a dead `// import chromium from 'npm i chrome-aws-lambda'`
   comment to a real `import chromium from '@sparticuz/chromium'`; a new
   `resolveLaunchOptions()` function that returns
   `{ executablePath: await chromium.executablePath(), args: chromium.args }`
   when `process.env.VERCEL` is set, otherwise falls through to
   `PUPPETEER_EXECUTABLE_PATH` then OS-detected-path logic. Compared this
   fallback logic byte-for-byte against `git show HEAD:server/api/
   generate-pdf.ts` (the pre-existing version, since `HEAD` on this branch
   predates the uncommitted diff) — the platform checks (`win32`/`darwin`/
   `linux` paths) and the `['--no-sandbox', '--disable-setuid-sandbox']`
   args are identical, just moved from an inline IIFE into the new
   function (one pre-existing comment line was dropped, no logic change).
   `package.json`/`package-lock.json` add exactly one new direct
   dependency, `@sparticuz/chromium@153.0.0` (plus its own transitive
   `tar-fs`/`bare-*` bumps in the lockfile) — no unrelated dependency
   changes.

2. **API-shape claim confirmed by reading the file myself**, not trusted:
   `node_modules/@sparticuz/chromium/build/index.d.ts` declares exactly
   `static get args(): string[]`, `static get graphics(): boolean`,
   `static set setGraphicsMode(value: boolean)`, and
   `static executablePath(input?: string): Promise<string>` — no
   `.headless`/`.defaultViewport` statics. Matches the note's claim
   exactly; the code only calls `.executablePath()` and reads `.args`.

3. **Pre-existing type issue confirmed genuinely pre-existing.**
   `git show HEAD:server/api/generate-pdf.ts` has the identical
   `data.generalInformation = ((generalInformation: GeneralInformation[])
   => {...})(...)` block at line 32; the new version has the same exact
   code at line 61 (shifted down only by the new function inserted above
   it). Ran `npx tsc --noEmit -p .nuxt/tsconfig.server.json` directly (not
   inferred) and got the identical error on both: `server/api/
   generate-pdf.ts(61,5): error TS2322: Type 'GeneralInformation |
   undefined' is not assignable to type 'GeneralInformation |
   GeneralInformation[]'.` Confirmed unrelated to this diff.

4. **Build re-run, verbatim.** `npm run build` succeeded:
   `Σ Total size: 99.2 MB (80.7 MB gzip)` — exact match to the note's
   claimed growth from ~29MB to ~99MB. Only warning: the pre-existing
   `@nuxt/image` sharp-binary warning (unrelated, existing baseline noise).

5. **Lint re-run, verbatim.** `npm run lint` → `13 problems (0 errors, 13
   warnings)` — exact match to the documented baseline, same warning
   list/files as prior sealed nodes today.

6. **Local dev fallback path re-verified end-to-end, independently.**
   Started my own `npm run dev` on port 4811 (separate from the
   implementer's port 4700). `curl http://localhost:4811/api/generate-pdf`
   → `HTTP_CODE:200`, downloaded file confirmed via `file`:
   `PDF document, version 1.4, 2 pages` — a real, valid, multi-page PDF,
   not empty/corrupt. Killed the dev server (`kill` + confirmed port 4811
   free via `lsof`) and deleted the downloaded test PDF afterward.

7. **Vercel path — correctly NOT attempted.** Per the task constraint,
   did not try to execute `@sparticuz/chromium`'s Linux-x64 binary on this
   macOS session (would fail with an exec-format error and prove nothing).
   The evidence note's own "Explicitly NOT verified" section and the
   diagram row's "Explicitly NOT verified" language honestly disclose this
   exact limitation, name the exact reason (Linux-x64-only binary, no
   Vercel log/CLI access), and explicitly require a real Vercel preview
   deployment test before merge — this is a correctly-disclosed limitation
   per issue #193's own design, not a defect, and not grounds for REOPEN.

All 4 acceptance criteria from the implementer's plan note have citeable
evidence:
- Criterion 1 (Vercel branch resolves without throwing at build/import
  time): confirmed via build success + API-shape check above.
- Criterion 2 (local/non-Vercel path unchanged): confirmed via diff
  comparison against `HEAD` + my own independent dev/curl/`file` test.
- Criterion 3 (build/lint clean, baseline unchanged): confirmed via
  verbatim re-run above.
- Criterion 4 (disclosed limitation, not swept under the rug): confirmed
  — the note and diagram row both state the limitation plainly and name
  the required follow-up gate.

No forbidden state hit. `ADHOC_WORK`: no — traces to this one diagram
node. `NO_EVIDENCE`: no — both implementer notes exist and are cited.
`EDIT_UNVERIFIED`: no — nothing is claimed as tested that wasn't (the
Vercel path is explicitly marked untested, not claimed working).
`CODE_IN_HAVEN`: no — no code under `haven/`. `DIAGRAM_DRIFT`: no — the
diagram row is updated in this same pass to match.

## Missing
None.

## Re-run
`full` — re-ran `npm run build`, `npm run lint`, and started an
independent `npm run dev` + curl + `file` check for the local fallback
path, from this session (outward-facing production-fix risk justifies the
independent re-run cost per `recipes/verify_seal.md`'s "Re-run scope").
Did not (and could not) re-run the Vercel-specific path — that's the one
explicitly disclosed, out-of-scope gap covered above.
