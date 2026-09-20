# 2026-09-20 — revert-sanitize-html-outage (verifier verdict)

**Worker:** verifier
**Node:** `revert-sanitize-html-outage`
**New PM status:** SEALED (was `PENDING — awaiting verifier`)

## Isolation proof
Spawned as a fresh subagent via the Agent tool with description "Verify
revert-sanitize-html P0 hotfix", task prompt opening: "You are being
spawned as the `verifier` worker for the datvt243.github.io agent-hub.
This is a fresh, independent context — do NOT trust or reuse any
reasoning from whoever implemented this change; verify from scratch
against real evidence. This is a P0 PRODUCTION INCIDENT hotfix..." — a
distinct task string from the implementer pass, with no shared
conversation history, confirming a genuinely separate context.

## Re-run
`full` — the node is a P0/outward-facing production incident, matching
the "outward-facing or a `/release` gate — higher risk" exception in
`verify_seal.md`'s "Re-run scope" section, and the task prompt explicitly
required independently reproducing the Vercel-bundle check rather than
auditing the note alone.

## Reasoning (evidence for each acceptance criterion)

1. **`server/api/blogs/detail/[id].ts` no longer imports/uses
   `sanitize-html`.** Confirmed via `git diff -- "server/api/blogs/detail/[id].ts"`:
   removes `import sanitizeHtml from 'sanitize-html'` and the
   `if (data) data.content = sanitizeHtml(data.content)` line + its
   comment. Nothing else in the file changed.

2. **`sanitize-html`/`@types/sanitize-html` fully removed from
   `package.json`/`package-lock.json`.** `git diff -- package.json` shows
   both lines removed (one from `dependencies`, one from
   `devDependencies`). `git diff --stat -- package-lock.json` shows 206
   lines removed, 0 added; `grep -n "sanitize-html" package-lock.json`
   returns nothing. `npm ls sanitize-html` → `└── (empty)` (correct/
   expected — proves it's not installed). Also confirmed no stray
   `node_modules/sanitize-html` or `node_modules/@types/sanitize-html`
   directory exists. A repo-wide `grep -rn "sanitize-html\|sanitizeHtml"`
   across `*.ts`/`*.vue`/`*.js`/`*.json` (excluding `node_modules`,
   `.git`, `agent-hub/` evidence which legitimately mentions it
   historically) returns 0 matches — no leftover references anywhere else
   in the codebase.

3. **`npm run build` clean, `npm run lint` clean, baseline unchanged.**
   Independently re-ran both from the working tree (not copied from the
   note):
   - `npm run build` tail: only the pre-existing
     `[@nuxt/image] WARN sharp binaries for darwin-arm64 cannot be
     found...` warning, then `[nitro] ✔ ... └ ✨ Build complete!` — same
     as the documented baseline, 0 errors.
   - `npm run lint`: `13 problems (0 errors, 13 warnings)` — exact match
     to the baseline count, all 13 pre-existing unused-var/no-console/
     no-explicit-any warnings in unrelated files (`categories.ts`,
     `resume.ts`, `RenderHTML.ts`, `createPDF.ts`, `stores/resume.ts`,
     `PostCategories.vue`, `Language.vue`, `Detail.vue`) — nothing new
     introduced by this diff.

4. **Re-verified against the actual Vercel-preset bundle under Node 22,
   matching the exact failure mode's reproduction method.** This is the
   critical check for this node, done as a genuinely independent re-run,
   not trusting the implementer's note:
   - `rm -rf .output .vercel`, then `NITRO_PRESET=vercel npm run build`
     — succeeded (`[nitro] ✔ You can deploy this build using npx vercel
     deploy --prebuilt`).
   - `grep -rn "sanitize" .vercel/output/functions/__fallback.func/chunks/routes/api/blogs/detail/_id_.mjs`
     → 0 matches, and manual inspection of the full compiled chunk
     confirms the import list no longer includes `sanitize-html` at all
     (imports are now just `nitro.mjs`, `zod`, and Node builtins).
   - Broader `grep -rln "sanitize" .vercel/output/` did surface hits in
     `chunks/build/server.mjs` and `chunks/nitro/nitro.mjs` — inspected
     each: all are unrelated internals (`sanitizeStatusCode`,
     `sanitizeStatusMessage`, `sanitizeTag`, `sanitizeTranslatedHtml`
     from h3/nitro/vue-i18n), not the `sanitize-html` package. Confirmed
     0 real matches to the removed dependency.
   - `.vc-config.json` confirms `"runtime": "nodejs22.x"`, matching the
     real Vercel declared runtime.
   - Installed/activated Node 22.23.2 via `nvm use 22` (already present
     locally, no install needed). Wrote a fresh wrapper script (not
     reusing the implementer's) that imports
     `.vercel/output/functions/__fallback.func/index.mjs`'s default
     export and wraps it in `node:http`'s `createServer`, listening on
     port **4522** (separate from the implementer's 4511).
   - `curl http://localhost:4522/blogs/671240459c6e9bcf4f7bf00d` → **200**,
     real rendered HTML page (verified body starts with
     `<!DOCTYPE html>...`, not an error page).
   - `curl http://localhost:4522/api/blogs/detail/671240459c6e9bcf4f7bf00d`
     → **200**, real JSON: `{"status":true,"data":{"_id":"...","title":"Post
     in the sky",...}}`.
   - Repeated against a 2nd real post ID for extra confidence:
     `curl http://localhost:4522/api/blogs/detail/67123bdf9c6e9bcf4f7bf006`
     → **200**, real Vietnamese blog content returned.
   - All 4 requests succeeded on the first try — no cold-start retry
     needed (the note's build-in "external API may cold-start" caveat
     did not materialize this run).
   - Cleaned up: `rm -rf .vercel .output`, killed the test server on
     port 4522 (confirmed `lsof -i:4522` → port free), confirmed
     `git status --short` shows only the expected pre-existing
     uncommitted files (no leftover build artifacts).

## Forbidden states scan
- `ADHOC_WORK` — no, tied to the `revert-sanitize-html-outage` node.
- `NO_EVIDENCE` — no, both implementer notes present and read.
- `EDIT_UNVERIFIED` — no, every claim above independently reproduced,
  not inferred.
- `CODE_IN_HAVEN` — no, no code files under `haven/`.
- `DIAGRAM_DRIFT` — no, diagram row updated to `SEALED` in this pass.
None hit.

## Seal gate
No outward-facing action was taken by the implementer (no commit/push/PR)
— correctly deferred to the operator's own `/ship` step per the
implementer note. Nothing for this verifier pass to gate on that
dimension; this verdict only seals the PM-status/evidence side, it does
not itself commit or push anything.

## Proportionality
Diff is exactly the minimal revert: removes the 1 import line, the 1
sanitize call + comment, and the 2 `package.json` dependency lines (plus
the mechanical `package-lock.json` regeneration). Nothing else touched.
No `SmallestDiff` concern.

## Verdict: SEAL

Every acceptance criterion has real, independently-reproduced evidence.
No forbidden states hit. This is a complete, clean, minimal revert that
fixes the confirmed production outage.

## Noticed, not blocking
Root cause of why Vercel's real infrastructure failed to resolve
`sanitize-html` while every local reproduction (including this
independent Vercel-preset/Node-22 re-run) succeeded is still not
confirmed — correctly tracked as a follow-up in issue #189 for if/when
sanitization is safely re-added later (via a real Vercel preview
deployment, not just local builds). This does not block sealing the
revert itself.
