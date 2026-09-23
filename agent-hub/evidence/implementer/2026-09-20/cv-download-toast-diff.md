# 2026-09-20 — cv-download-toast (diff)

**Worker:** implementer
**Node:** `cv-download-toast`

## Diff

| File | Why |
|---|---|
| `app.vue` | Added `<UNotifications />` right before `</div>` at the root. Nuxt UI's `useToast()` composable only pushes into a shared state array (confirmed by reading `node_modules/@nuxt/ui/dist/runtime/composables/useToast.js` directly) — nothing renders unless `<UNotifications>` is mounted somewhere, and it wasn't anywhere in this codebase before this change. |
| `composables/useDownloadResume.ts` | Added `isLoading` ref and a `useToast()` call. `downloadResume()` now: adds a toast (`resume.downloadingCv`, `timeout: 0` so it doesn't auto-dismiss while still in flight) before the fetch, `toast.update()`s the same toast (by its returned `id`) to a success message on a 200 response, to an error message on a non-200 response or a thrown exception (added a `try/catch/finally` around the whole flow - previously an unhandled network error would have thrown silently with no user-visible feedback at all), and clears `isLoading` in `finally`. |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue`, `.../AboutMe.vue` | Both destructure the new `isLoading` from the composable, add it to the button's `:disabled` binding (`isDisabled \|\| isLoading`), and swap the button's label to `t('resume.downloadingCv')` while `isLoading` is true. |
| `i18n/locales/vi.json`, `i18n/locales/en.json` | New `resume.downloadingCv`/`resume.downloadCvSuccess`/`resume.downloadCvError` keys. |

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

## Browser verification
Checked via Chrome CDP (port 9888, `puppeteer-core`) against a real `npm run dev` instance (port 4900).

- **Happy path**: clicked the Hero's "Tải CV" button, polled the page text every second. First attempt (genuinely cold Puppeteer launch on a freshly-started dev server) took long enough that a 4-second polling window wasn't sufficient to observe the resolution - not a bug, `server/api/generate-pdf.ts`'s in-memory 24h cache means the FIRST real generation is the slow one (confirmed: a follow-up click on the now-warm cache resolved in ~1 second). Re-ran with a longer poll: `PDF response status: 200`, page text transitioned to exactly `"Đã tải xong CV"` within 1 second (cache-warm run).
- **Error path**: used `page.setRequestInterception(true)` to force a `500` response from `/api/generate-pdf` specifically (all other requests passed through normally) - page text showed `"Không thể tải CV"` within 500ms of the click, and the button's `disabled` property was confirmed `true` afterward (the existing `isDisabled` fallback still fires correctly alongside the new toast).
- **Console errors**: the only errors present in every run are the already-known, unrelated `VisitTracker`/CORS noise (`nodejs-resume-api-ts.onrender.com/.../visit` blocked by CORS) - not introduced by this change, already documented elsewhere in this session's evidence.

Scripts: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/3010f9ae-4713-4cd2-8a1a-3217fd3407e6/scratchpad/verify-198-toast{2,3}.cjs`, `verify-198-error.cjs` (scratch, not committed).

## Acceptance

| Criterion | Evidence |
|---|---|
| Loading toast appears on click | CDP: `"Đang tải CV"` observed in page text immediately after click |
| Success toast replaces it | CDP: `"Đã tải xong CV"` observed after the real fetch resolved 200 |
| Error toast on failure | CDP: `"Không thể tải CV"` observed after a forced 500, `isDisabled` still set |
| Button disables + relabels while loading | Verified via the same button-state checks during the polling window |
| Build/lint clean, baseline unchanged | Output above |
| Real UI verified | CDP scripts above, both happy and error paths |

## Noticed, not done
- No dedicated "loading spinner" icon exists in the `fe` iconify collection already used throughout this app (checked `@iconify-json/fe/icons.json` directly - only `download`/`upload`/`check-circle`/`warning` exist, no spinner/refresh icon). Kept the same static `fe:download` icon in the toast rather than adding a new icon collection just for a spin animation - the text change + toast timing already communicate the loading state clearly.

## Seal gate
None — no outward-facing action taken (no commit/push/PR). Working tree has the diff on branch `198-cv-download-toast`, uncommitted, awaiting verifier then operator's own `/ship` step.
