# 2026-08-29 — open-to-work-badge-i18n (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `open-to-work-badge-i18n`
- Status: `sealed_pending_verifier`

## Diff
| File | Why |
|---|---|
| `i18n/locales/vi.json` | New `resume.openToWork: "Đang tìm việc"` key |
| `i18n/locales/en.json` | New `resume.openToWork: "Open to work"` key |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | Badge text `"Open to work"` → `{{ t('resume.openToWork') }}` |

```diff
--- a/i18n/locales/vi.json
+++ b/i18n/locales/vi.json
@@ -12,7 +12,8 @@
   "resume": {
     "greeting": "Xin chào! Tôi là",
     "aboutMeHeading": "Giới thiệu",
-    "downloadCv": "Tải CV"
+    "downloadCv": "Tải CV",
+    "openToWork": "Đang tìm việc"
   },

--- a/i18n/locales/en.json
+++ b/i18n/locales/en.json
@@ -12,7 +12,8 @@
   "resume": {
     "greeting": "Hi there! I am",
     "aboutMeHeading": "About me",
-    "downloadCv": "Download CV"
+    "downloadCv": "Download CV",
+    "openToWork": "Open to work"
   },

--- a/themes/portfolio-dev/pages/resumeObject/Hero.vue
+++ b/themes/portfolio-dev/pages/resumeObject/Hero.vue
@@ -24,7 +24,7 @@
         class="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-sm text-green-400"
       >
         <span class="w-2 h-2 rounded-full bg-green-400" />
-        Open to work
+        {{ t('resume.openToWork') }}
       </span>
```

## Command
```
rm -rf node_modules/.cache .nuxt .output && npm run build
```
Exit code `0`. No `error` lines. Tail:
```
Σ Total size: 28.5 MB (10.5 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```

```
nvm use 24 && npm run lint
```
Verbatim tail:
```
✖ 34 problems (0 errors, 34 warnings)
```
Exact match to the established baseline — 0 new warnings (none of the 3
touched files appear in the warning list).

## Browser verification
Same constraint as the original `open-to-work-badge` node: production
doesn't send `openToWork: true` yet, so used a mocked payload (real
production data fetched live, `openToWork` flipped to `true`) served by a
local mock HTTP server on port `4701`, pointed a preview instance
(port `3920`) at it via `NUXT_PUBLIC_NODE_API`/`NUXT_PUBLIC_MY_EMAIL` env
overrides (no rebuild needed).

Chrome CDP already running on port 9888 (`curl -s
http://localhost:9888/json/version` → JSON, reused, not relaunched).
`puppeteer-core` script: real `page.goto` against `http://localhost:3920/`
and `http://localhost:3920/en`, reads the badge `<span>`'s text and
`document.documentElement.lang`.

Verbatim result:
```json
{
  "vi_root": { "badgeText": "Đang tìm việc", "htmlLang": "vi-VN", "consoleErrors": [] },
  "en": { "badgeText": "Open to work", "htmlLang": "en-US", "consoleErrors": [] }
}
```
Correct translated text on both locales, `<html lang>` flips correctly,
0 console errors on either page.

Cleanup: mock API server + preview process killed, temp script
(`.tmp-i86-check.mjs`) and mock server script (`.tmp-i86-mock-api.mjs`)
deleted. `git status --short` confirmed clean of stray files after.

## Acceptance
| Criterion | Evidence | Met? |
|---|---|---|
| Real vi/en translations added, no English echoed into `vi.json` | `git diff` above — `vi.json` gets `"Đang tìm việc"`, a real Vietnamese phrase, not `"Open to work"` | ✅ |
| Badge template uses `t('resume.openToWork')`, no hardcoded string left | `git diff` above — `grep -n "Open to work" Hero.vue` after the change matches nothing (checked separately) | ✅ |
| Build clean | Tail above, exit 0 | ✅ |
| Lint clean, 0 new warnings | `✖ 34 problems (0 errors, 34 warnings)`, none in touched files | ✅ |
| Real UI check, both locales, 0 console errors | CDP JSON above | ✅ |

## Noticed, not done
None beyond what the original `open-to-work-badge` node already disclosed
(production backend still doesn't send `openToWork` yet — unrelated to
this i18n fix).

## Seal gate
None — no commit/push/PR/delete in this pass. `git status` shows only
working-tree changes on `feature/86`.
