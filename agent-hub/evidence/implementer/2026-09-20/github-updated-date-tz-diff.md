# 2026-09-20 — github-updated-date-tz (diff)

**Worker:** implementer
**Node:** `github-updated-date-tz`

## Diff

| File | Why |
|---|---|
| `themes/portfolio-dev/pages/github/part/Item.vue` | Extracted a new `updatedOnLabel` computed: `new Date(props.modelValue.updated_at).toLocaleDateString('en-US', { timeZone: 'UTC' })`. Pinning `timeZone: 'UTC'` means the date is always computed from the UTC calendar date of the instant, identically on server and client regardless of either side's local timezone (`modelValue.updated_at` is already a UTC ISO timestamp from the GitHub API). Template now reads `{{ updatedOnLabel }}` instead of inlining the `Date`/`toLocaleDateString` call directly. |

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
Exact match to baseline.

## Browser verification — reproducing the actual failure mode, not just a same-timezone smoke test
This bug's whole mechanism depends on a genuine server/client timezone MISMATCH - verifying with both sides in the same local timezone (as a normal `npm run dev` + local browser test would do) would prove nothing, since that setup can never reproduce the original bug either. Instead:

1. First independently reproduced the ORIGINAL bug's mechanism directly: `TZ=UTC node -e "console.log(new Date('2026-09-23T20:00:00Z').toLocaleDateString())"` → `9/23/2026`; `TZ=Asia/Ho_Chi_Minh node -e "..."` → `9/24/2026` - same instant, different calendar date, confirming the root cause before touching any code.
2. Built the production bundle (`npm run build`, default `node-server` preset - the timezone mechanism doesn't depend on the Vercel-specific bundling issue from a separate, unrelated node earlier this session), then ran it explicitly forced to UTC (`TZ=UTC PORT=4988 node .output/server/index.mjs`) - matching Vercel's real server timezone - while connecting via the actual local Chrome browser, which genuinely runs in `+07` (ICT, confirmed via `date +%Z` on this machine, not assumed).
3. Loaded `/github` 5 times against this UTC-server/ICT-client split, listening for any `[Hydration]`-matching console message each time: **5/5 clean**, 0 hydration warnings - the exact split that reproduced the bug live on real production earlier (5/5 mismatch, confirmed in this session's prior investigation) is now clean with this fix.
4. Killed the test server, removed the scratch `.output` build afterward.

## Acceptance

| Criterion | Evidence |
|---|---|
| Date computed identically regardless of runtime timezone | Direct `TZ=...` comparison before the fix (proved the bug mechanism); 5/5 clean hydration with a real UTC-server/ICT-client split after the fix |
| Build/lint clean, baseline unchanged | Output above |
| Verified against the REAL failure mode (cross-timezone), not a same-TZ smoke test | Explicit `TZ=UTC` server + real ICT client browser, matching production's actual server/client timezone split |

## Noticed, not done
- `utils/formatDate.ts`/`utils/convertNumberToDate.ts` share the same local-timezone-dependent date-getter pattern (used for blog post dates, resume experience/project ranges) - not touched here, per issue #202's own explicit scoping (only the actually-observed `/github` mismatch, not a speculative fix of every date-formatting call site in the app).

## Seal gate
None — no outward-facing action taken (no commit/push/PR). Working tree has the diff on branch `202-github-updated-date-tz`, uncommitted, awaiting verifier then operator's own `/ship` step.
