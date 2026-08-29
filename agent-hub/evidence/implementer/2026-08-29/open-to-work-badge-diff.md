# 2026-08-29 — open-to-work-badge (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `open-to-work-badge`
- Status: `sealed_pending_verifier`

## Diff
| File | Why |
|---|---|
| `types/resume-document.ts` | Added `openToWork: boolean` to the `GeneralInformation` interface — matches the real backend field (see plan note). |
| `models/Hero.ts` | Added `openToWork = false` to `HeroModel` (default matches the backend's `default: false`). |
| `utils/ResumeAdapter.ts` | `toHero()` now maps `openToWork: Boolean(generalInformation.openToWork)` — `Boolean(...)` because the live production API doesn't send this key at all yet (backend not deployed), so it must survive `undefined` → `false`, not throw or leak `undefined` into the model. |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | New `<span v-if="hero.openToWork">` badge (green dot + "Open to work" text) placed between the name `<h1>` and the `positionDesired` line. `v-if` (not `v-show`) so the element is fully absent from the DOM when `false`, not just hidden. |

```diff
--- a/models/Hero.ts
+++ b/models/Hero.ts
@@ -6,6 +6,7 @@ export class HeroModel extends BaseModel {
   positionDesired = 'A frontend developer'
   introduction = ''
   email = ''
+  openToWork = false

--- a/themes/portfolio-dev/pages/resumeObject/Hero.vue
+++ b/themes/portfolio-dev/pages/resumeObject/Hero.vue
@@ -18,6 +18,13 @@
       <h1 ...>
         {{ hero.fullName }} <span class="text-theme-text">{</span>
       </h1>
+      <span
+        v-if="hero.openToWork"
+        class="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-sm text-green-400"
+      >
+        <span class="w-2 h-2 rounded-full bg-green-400" />
+        Open to work
+      </span>
       <p class="text-2xl text-blue-400 mt-6">

--- a/types/resume-document.ts
+++ b/types/resume-document.ts
@@ -39,6 +39,7 @@ export interface GeneralInformation extends BaseDocument {
   yearsOfExperience: number
   workLocation: string
   workForm: string
+  openToWork: boolean
   careerGoal: string

--- a/utils/ResumeAdapter.ts
+++ b/utils/ResumeAdapter.ts
@@ -99,6 +99,7 @@ export class ResumeAdapter {
       positionDesired: generalInformation.positionDesired || 'A frontend developer',
       introduction: information.introduction ?? '',
       email: information.email ?? '',
+      openToWork: Boolean(generalInformation.openToWork),
     })
```

## Command
```
rm -rf node_modules/.cache .nuxt .output && npm run build
```
Run twice (per the documented "first build after cache wipe can flake on
iconify" trap) — both clean, 2nd run's tail:

```
Σ Total size: 28.5 MB (10.5 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```
Exit code: `0` both times. No `error`/`ERROR` lines in the full log (only
line present matching `error|warn`, case-insensitive, was the pre-existing
`[@nuxtjs/i18n] WARN bundle.optimizeTranslationDirective is enabled by
default...` — unrelated to this diff, present on a clean `main` checkout
before any of this task's changes).

```
nvm use 24 && npm run lint
```
(machine's default Node is `v20.18.0`, `eslint-flat-config-utils` needs
≥21 per the documented trap — `v24.19.0` already installed via `nvm`.)
Verbatim tail:
```
✖ 34 problems (0 errors, 34 warnings)
```
0 errors. All 34 warnings are in files this diff didn't touch (`server/
api/*.ts`, `types/github.ts`, `utils/cloneDeep.ts`, etc. — confirmed by
reading the full list, none reference `Hero.ts`, `ResumeAdapter.ts`,
`Hero.vue`, or `resume-document.ts`).

## Browser verification
Real change (new conditional UI element) — CDP check required.

**Problem**: the live production backend
(`https://nodejs-resume-api-ts.onrender.com`, this repo's real `NODE_API`)
does not send `openToWork` at all yet (confirmed via direct `curl` in the
plan note) — the `ResumeAPI` repo's code is ahead of what's deployed. So
the real API can only exercise the `false`/absent case, not `true`.

**Approach**: verified both branches of the real running app, not a
fabricated screenshot:
1. `false`/absent case — real production data, real API, no mocking.
2. `true` case — a local mock HTTP server
   (`/private/tmp/.../mock-api-server.mjs`) serving the **exact real
   payload** fetched live from production moments earlier, with only
   `generalInformation.openToWork` flipped to `true` (Python one-liner,
   `/tmp/mock-resume.json`) — same shape the real backend will send once
   deployed. Pointed a 2nd preview instance at it via Nitro's runtime-config
   env override (`NUXT_PUBLIC_NODE_API`/`NUXT_PUBLIC_MY_EMAIL`, no rebuild
   needed).

Commands run:
```
node .../mock-api-server.mjs 4501    # serves the true-case payload
NUXT_PUBLIC_NODE_API=http://localhost:4501 NUXT_PUBLIC_MY_EMAIL=mock PORT=3902 node .output/server/index.mjs
NUXT_PUBLIC_NODE_API=https://nodejs-resume-api-ts.onrender.com NUXT_PUBLIC_MY_EMAIL=votan.it@gmail.com PORT=3903 node .output/server/index.mjs
```
Chrome CDP already running on port 9888 (`curl -s
http://localhost:9888/json/version` → JSON, reused per doctrine — not
relaunched). `puppeteer-core` script (`puppeteer.connect({browserURL:
'http://localhost:9888'})`), real `page.goto` + `waitUntil: 'networkidle0'`
against both ports, `page.evaluate` searching the real DOM for a `<span>`
containing "Open to work" text.

Verbatim result:
```json
{
  "openToWork_true": {
    "badge": {
      "text": "Open to work",
      "className": "inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-sm text-green-400",
      "visible": true
    },
    "consoleErrors": []
  },
  "openToWork_false": {
    "badge": null,
    "consoleErrors": []
  }
}
```
`badge: null` on the false/absent case confirms the element is genuinely
absent from the DOM (the `page.evaluate` search found no matching `<span>`
at all), not merely styled invisible. 0 console errors on either page.

Cleanup done: both preview processes and the mock API server killed
(`kill`), confirmed no stray listeners; temp verification script
(`.tmp-verify-open-to-work.mjs`) deleted; no Chrome tabs left dangling
(script closed each `page` it opened).

## Acceptance
| Criterion | Evidence | Met? |
|---|---|---|
| `GeneralInformation.openToWork: boolean` | `git diff types/resume-document.ts` above | ✅ |
| `HeroModel.openToWork` defaults `false` | `git diff models/Hero.ts` above | ✅ |
| `ResumeAdapter.toHero()` maps it via `Boolean(...)` | `git diff utils/ResumeAdapter.ts` above | ✅ |
| Badge shows only when `true`, absent (not hidden) when `false` | CDP JSON above: `badge.visible: true` (true case) vs `badge: null` (false case) | ✅ |
| No i18n regression | `Hero.vue` on this branch has no `useI18n()` import before or after this diff (confirmed via `git diff` above — no such import added); badge text is plain, matching this branch's other un-translated strings ("Hi there! I am...") | ✅ |
| Build clean | `npm run build` tail above, exit 0, twice | ✅ |
| Lint clean, 0 new warnings | `✖ 34 problems (0 errors, 34 warnings)`, none in touched files | ✅ |
| Real UI check, 0 console errors | CDP JSON above, `consoleErrors: []` both pages | ✅ |

## Noticed, not done
- The live `ResumeAPI` production deployment doesn't have this field yet —
  once the operator deploys the backend, the real candidate record's
  `openToWork` value (whatever it's set to) is what will actually show.
  Nothing to fix on the frontend side; just a heads-up this diff can't be
  "seen live in production" until that deploy happens.
- `Hero.vue` is still un-translated on this branch (pre-existing, out of
  this task's scope — will get picked up when `feature/80`'s i18n work
  merges).

## Seal gate
None — no commit/push/PR/delete happened in this pass. `git status` below
shows only working-tree changes on `feature/84`.
