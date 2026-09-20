# 2026-09-20 — revert-sanitize-html-outage (diff)

**Worker:** implementer
**Node:** `revert-sanitize-html-outage`

## Diff

| File | Why |
|---|---|
| `server/api/blogs/detail/[id].ts` | Removed `import sanitizeHtml from 'sanitize-html'` and the `if (data) data.content = sanitizeHtml(data.content)` line + its explanatory comment. Restores the handler to exactly its pre-`p2-polish-fixes-round2` state. |
| `package.json`, `package-lock.json` | `npm uninstall sanitize-html @types/sanitize-html` - fully removes the dependency that couldn't be reliably resolved in the actual Vercel deployment. |

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

`npm run lint` (verbatim):
```
✖ 13 problems (0 errors, 13 warnings)
```
Exact match to the baseline.

## Browser/runtime verification — the critical check for this node
Given the outage happened despite a clean `npm run build` and a clean default-preset local test the first time, "build succeeds" was explicitly NOT trusted as sufficient evidence here. Re-ran the exact incident-reproduction method:

1. `rm -rf .output .vercel`, then `NITRO_PRESET=vercel npm run build` - the same preset Nitro uses when it detects the `VERCEL` env var in the real deployment.
2. Confirmed via `grep` that the compiled `chunks/routes/api/blogs/detail/_id_.mjs` chunk no longer references `sanitize-html`/`sanitizeHtml` anywhere.
3. Installed Node 22.23.2 via `nvm` (matching the exact `nodejs22.x` runtime declared in `.vercel/output/functions/__fallback.func/.vc-config.json`) and ran the built function handler directly (`createServer(mod.default)` wrapping the Vercel function's `(req, res)` handler) under that Node version.
4. `curl http://localhost:4511/blogs/671240459c6e9bcf4f7bf00d` → **200** (was 500 before this fix, reproduced identically in the incident-diagnosis pass moments earlier).
5. `curl http://localhost:4511/api/blogs/detail/671240459c6e9bcf4f7bf00d` → **200**, real post data returned (`"title":"Post in the sky"`, real `tags`/`excerpt`).

This does not fully explain WHY the original `sanitize-html` version failed specifically on Vercel's real infrastructure (never fully reproduced there either, since I have no log/CLI access to that environment) - but it does concretely prove the fix removes the one variable that changed between the last-known-working deploy and the broken one, without reintroducing any new external-dependency risk.

## Acceptance

| Criterion | Evidence |
|---|---|
| `sanitize-html` usage removed from the handler | File diff |
| Dependency fully removed | `package.json`/`package-lock.json` diff, confirmed 0 `sanitize-html` matches in either file after |
| Build/lint clean, baseline unchanged | `npm run build`/`npm run lint` output above |
| Re-verified against the actual failure mode, not just a generic build | Vercel-preset bundle rebuilt, run under Node 22.23.2 (matching the real deployed runtime), the exact previously-500ing routes now return 200 with real data |

## Noticed, not done
- The real root cause of why Vercel's actual build/deploy pipeline treated this differently from every local reproduction attempt is not fully confirmed - flagged as a follow-up investigation in issue #189 if the operator wants to actually re-add HTML sanitization later, this time verified via a real Vercel preview deployment before merging, not just a local build.

## Seal gate
None — no outward-facing action taken yet (no commit/push/PR). Working tree has the diff on branch `189-prod-outage-revert-sanitize`, uncommitted, awaiting verifier then operator's own `/ship` step. Given this is an active P0 production outage, the operator should be informed this fix is ready to ship immediately once sealed.
