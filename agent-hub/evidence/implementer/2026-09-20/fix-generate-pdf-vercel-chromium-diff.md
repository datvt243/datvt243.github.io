# 2026-09-20 — fix-generate-pdf-vercel-chromium (diff)

**Worker:** implementer
**Node:** `fix-generate-pdf-vercel-chromium`

## Diff

| File | Why |
|---|---|
| `server/api/generate-pdf.ts` | Replaced the leftover `// import chromium from 'npm i chrome-aws-lambda'` TODO-comment with a real `import chromium from '@sparticuz/chromium'`. Extracted a new `resolveLaunchOptions()` function: when `process.env.VERCEL` is set (Vercel always sets this in every deployed function), resolves `chromium.executablePath()`/`chromium.args` from the new dependency; otherwise falls through to the exact same `PUPPETEER_EXECUTABLE_PATH` → OS-detected-path logic that already existed, unchanged. |
| `package.json`, `package-lock.json` | Added `@sparticuz/chromium@153.0.0` — checked its actual installed API directly (`node_modules/@sparticuz/chromium/build/index.d.ts`) rather than assuming an older version's shape from memory: this version exposes only `.args` (static getter) and `.executablePath()` (static async method) — no `.headless`/`.defaultViewport` statics like some older versions had, so the code only uses what's really there. |

## Command
```
npm run build
npm run lint
```

## Output

`npm run build` (verbatim tail):
```
[@nuxt/image]  WARN  sharp binaries for darwin-arm64 cannot be found. Please report this as a bug with a reproduction at https://github.com/nuxt/image.

[nitro] ✔ You can preview this build using node .output/server/index.mjs
│
└  ✨ Build complete!
```
Total build output size increased from ~29MB to ~99MB (`Σ Total size: 99.2 MB (80.7 MB gzip)`) - expected, this is `@sparticuz/chromium`'s bundled Linux binary now being traced/included by Nitro. Disclosed as a real, deliberate tradeoff (see "Noticed, not done").

`npm run lint` (verbatim):
```
✖ 13 problems (0 errors, 13 warnings)
```
Exact match to baseline - the pre-existing `GeneralInformation | undefined` type error on this same file (confirmed via `git show HEAD:server/api/generate-pdf.ts`, present before this diff, unrelated to it) still doesn't surface here because `nuxt.config.ts` has `typescript.typeCheck: false` - this build/lint pair has never run a real `tsc` pass on this repo, before or after this change.

## Browser/runtime verification

**Local dev fallback path (unaffected code path, verified end-to-end for real)**: started a real `npm run dev` instance, `curl http://localhost:4700/api/generate-pdf` → **200**, downloaded a real 65302-byte file, confirmed via `file` command: `PDF document, version 1.4, 2 pages`. This proves the refactor didn't break the existing local/non-Vercel path.

**Vercel-specific path — explicitly NOT verifiable from this session, disclosed rather than assumed**: `@sparticuz/chromium`'s binary is compiled for Linux x64 and cannot execute on this macOS dev machine (confirmed: the package's own `executablePath()` extracts a Linux ELF binary - attempting to spawn it here would fail with an exec-format error, not a meaningful test of whether it works on real Vercel). No Vercel CLI/log access is available from this session either (same constraint that limited root-cause diagnosis of the earlier sanitize-html incident). Per issue #193's explicit requirement, this fix is NOT to be merged into `staging`/`main` on the strength of this local evidence alone - the operator (session orchestrator) must push this branch, open a PR (which triggers a real Vercel preview deployment via the same GitHub integration that deploys production), and curl the **live preview URL's** `/api/generate-pdf` for a real 200 + valid PDF before proceeding to merge. This evidence note intentionally stops short of claiming `sealed_pending_verifier` implies "ready to ship" the way it normally would - the verifier below is asked to confirm this same understanding, not to attempt the impossible (locally verifying a Linux-only binary).

## Acceptance

| Criterion | Evidence |
|---|---|
| Vercel branch resolves without throwing at build/import time | `npm run build` succeeded with the new import + `chromium.executablePath()`/`.args` calls present in the compiled output; `@sparticuz/chromium`'s API shape was read directly from its installed `.d.ts`, not assumed |
| Local/non-Vercel path unchanged and still works | Real local `npm run dev` + `curl` test: 200, valid 2-page PDF |
| Build/lint clean, baseline unchanged | Output above |
| Vercel runtime behavior - explicitly deferred, not silently assumed | Documented above; real preview-deployment verification is a required follow-up step before this can be considered done, not before this specific node is sealed |

## Noticed, not done
- `@sparticuz/chromium` added ~68MB to the bundled function size. This is the standard, expected size for this well-known solution and should be within Vercel's per-function limits, but wasn't independently confirmed against Vercel's exact current limits for this project's plan tier from this session - if the real preview deployment (the required next step) fails specifically with a size-limit error rather than a Chrome-launch error, that would be a different, size-focused follow-up (e.g. `@sparticuz/chromium-min`, which lazy-downloads the binary instead of bundling it, trading bundle size for cold-start latency).
- The pre-existing `GeneralInformation | undefined` type error in this same file (unrelated to this fix, confirmed present in `git show HEAD` before this diff) was left untouched - out of scope for this node.

## Seal gate
None yet — no outward-facing action taken (no commit/push/PR). Working tree has the diff on branch `193-pdf-download-vercel-chromium`, uncommitted. Given the disclosed limitation above, the actual push/PR/preview-verification step is a deliberate, necessary exception to this hub's normal "seal first, push after" order - tracked explicitly, not skipped silently.
