# 2026-11-08 - resume-cache-empty (diff)
- Worker: implementer · Version: 0.1.0
- Node: `resume-cache-empty` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: "#421 + #419 (one branch bug/421, one PR closing both). #421 Resume API: shorten the 12-day server cache — server/api/resume.ts:21 caches upstream resume 60*60*24*12 s per email+lang; change to ~1 hour (ISR 60s stays); /api/generate-pdf keeps its own 1-day cache. #419 Home: show a message when the resume comes back empty — pages/index.vue renders a blank page when /api/resume returns 200 with an empty resume (isValid false). Operator decision 2026-11-08: make it a FATAL error (same path as the existing upstream-failure 502 throw) so the error page shows and ISR keeps the last good render."
- Plan: `evidence/implementer/2026-11-08/resume-cache-empty-plan.md`

## Hub bytes before: 94007

## Feature doc: doctrine/features/resume-home.md
## Feature doc changed: Behavior #3 "caches the result 12 days" → "1 hour"; Behavior #5 failure list + "or a resume with no whitelisted field"; Changelog row 2026-11-08 — operator: Open question 3 "Change: shorten to ~1h — #421", Open question 1 "Bug: show an empty/error state — #419", fatal variant chosen via AskUserQuestion 2026-11-08 "Fatal error (Recommended)"

## Diff
| File | Why |
|---|---|
| `server/api/resume.ts` | `maxAge: 60 * 60 * 24 * 12` → `60 * 60` (#421) |
| `server/utils/fetchResume.ts` | after the whitelist `pick`, every value `undefined` → throw the same controlled 502 as `success: false` (#419). Root cause in the shared fetcher: `/api/resume` no longer caches an empty resume, `/` + `/projects` hit `useResumeData`'s existing fatal throw, `/api/generate-pdf` no longer renders an empty PDF. JSDoc updated |
| `tests/fetchResume.test.ts` | new case: `data: {}` and `data: { salary }` (private-only) → 502; the language test's `data: {}` → `{ firstName }` since `{}` now throws |
| `agent-hub/doctrine/features/resume-home.md` | Behavior #3/#5 + Changelog (see above) |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | new PENDING row `resume-cache-empty` |

First attempt checked `Object.keys(resume).length` — `npm test` failed: `promise resolved "{ generalInformation: undefined }" instead of rejecting` (the spread always adds that key, which is exactly what a real `data: {}` produces). Changed to `Object.values(resume).every((value) => value === undefined)`; re-ran all 4 gates (below).

```diff
diff --git a/server/api/resume.ts b/server/api/resume.ts
index 56c8930..601daee 100644
--- a/server/api/resume.ts
+++ b/server/api/resume.ts
@@ -18,7 +18,7 @@ export default defineCachedEventHandler(
       const { MY_EMAIL } = useRuntimeConfig().public
       return `api-resume-${MY_EMAIL}-${langOf(event)}`
     },
-    maxAge: 60 * 60 * 24 * 12,
+    maxAge: 60 * 60,
     // Dev always refetches so backend data edits show up without clearing the cache.
     shouldBypassCache: () => import.meta.dev,
   },
diff --git a/server/utils/fetchResume.ts b/server/utils/fetchResume.ts
index 486b6aa..06e7313 100644
--- a/server/utils/fetchResume.ts
+++ b/server/utils/fetchResume.ts
@@ -40,8 +40,9 @@ const pick = <T extends object>(obj: T, keys: string[]): T =>
 /**
  * Fetches the owner's resume from the backend, its localized text in `lang`
  * (the backend falls back to `vi` without it). Any failure (non-2xx, which
- * `$fetch` throws on, or a 2xx with `success: false`) becomes a controlled
- * 502 - thrown, not returned, so `defineCachedEventHandler` never caches it.
+ * `$fetch` throws on, a 2xx with `success: false`, or no public field at all)
+ * becomes a controlled 502 - thrown, not returned, so `defineCachedEventHandler`
+ * never caches it and the page fails instead of rendering blank.
  */
 export async function fetchResume(lang: AtsLang = 'vi'): Promise<ResumeAPIResponse['data']> {
   const { NODE_API, MY_EMAIL } = useRuntimeConfig().public
@@ -62,7 +63,7 @@ export async function fetchResume(lang: AtsLang = 'vi'): Promise<ResumeAPIRespon
     throw createError({ statusCode: 502, statusMessage: 'Unable to load resume data' })
   }
   const { generalInformation } = res.data
-  return pick(
+  const resume = pick(
     {
       ...res.data,
       generalInformation: Array.isArray(generalInformation)
@@ -71,4 +72,8 @@ export async function fetchResume(lang: AtsLang = 'vi'): Promise<ResumeAPIRespon
     },
     PUBLIC_FIELDS,
   )
+  if (Object.values(resume).every((value) => value === undefined)) {
+    throw createError({ statusCode: 502, statusMessage: 'Unable to load resume data' })
+  }
+  return resume
 }
diff --git a/tests/fetchResume.test.ts b/tests/fetchResume.test.ts
index f661b7c..9f6f294 100644
--- a/tests/fetchResume.test.ts
+++ b/tests/fetchResume.test.ts
@@ -39,12 +39,19 @@ describe('fetchResume', () => {
   })
 
   it('asks the upstream for the requested language, vi by default', async () => {
-    fetchMock.mockResolvedValue({ success: true, data: {} })
+    fetchMock.mockResolvedValue({ success: true, data: { firstName: 'Dat' } })
     await fetchResume('en')
     await fetchResume()
     expect(fetchMock.mock.calls.map((call) => call[1].query)).toEqual([{ lang: 'en' }, { lang: 'vi' }])
   })
 
+  it('fails as a 502 when the upstream sends no public field', async () => {
+    for (const data of [{}, { salary: 1000 }]) {
+      fetchMock.mockResolvedValue({ success: true, data })
+      await expect(fetchResume()).rejects.toMatchObject({ statusCode: 502 })
+    }
+  })
+
   it('never retries the rate-limited upstream and fails as a 502', async () => {
     fetchMock.mockRejectedValue(new Error('429'))
     await expect(fetchResume()).rejects.toMatchObject({ statusCode: 502 })
```

## Command
From the repo root (verbatim from `doctrine/MEMORY.md`): `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`.

## Output
```
build exit 0 · lint exit 0 · typecheck exit 0 · test exit 0
--- npm run build (tail)
config 107ms · modules 353ms · app 362ms · types 345ms · client 2.38s · server 1.54s · nitro 8.54s
◆ ✨ Build complete in 13.6s!
--- npm run lint

> nuxt-app@1.13.1 lint
> eslint .

--- npx nuxi typecheck (tail)
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
--- npm test (tail)

 Test Files  10 passed (10)
      Tests  28 passed (28)
   Start at  19:55:06
   Duration  245ms (transform 43%, import 32%, tests 16%, worker 8%)

```

## Runtime check (local prod build vs mock)
Mock: `python3 -I mock.py` on 127.0.0.1:4599 returning `{"success":true,"data":{}}` (mode `empty`) or a full fixture (mode `full`). Rebuilt + started with `NODE_API` and `NUXT_PUBLIC_NODE_API` = the mock at build AND run time; `PORT=3456 node .output/server/index.mjs`.
```
--- empty mode
/api/resume 502
{ "error": true, ..., "statusCode": 502, "statusMessage": "Unable to load resume data", "message": "Unable to load resume data" }
/ 502
Unable to load resume data            (grep in the HTML)
0                                     (grep -c 'page-index' — no blank home shell)
--- full mode
/api/resume 200
{"success":true,"resume":{"socialMedia":{"github":"https://github.com/datvt243",...
/ 200
<title>Resume Võ Tấn Đạt</title>
1                                     (grep -c 'page-index')
--- mock hits
HIT empty /api/me/votan.it@gmail.com?lang=vi
HIT empty /api/me/votan.it@gmail.com?lang=vi     ← 2nd empty call reached the mock again: the 502 was not cached
HIT full /api/me/votan.it@gmail.com?lang=vi      ← `/` in full mode reused the cached /api/resume (no 4th hit)
onrender in server log: 0
```

## Browser verification
Fresh server, mode `empty`, Playwright → `http://localhost:3456/`:
- `HTTP status: 502 Unable to load resume data`
- Snapshot (`home-empty-snapshot.yml` in the session scratchpad): `"502"`, heading "Đã có lỗi phía máy chủ", paragraph "Nguồn dữ liệu có thể đang khởi động hoặc tạm thời gián đoạn. Vui lòng thử lại sau giây lát.", buttons "Thử lại" / "Về trang chủ"
- Console: 1 error, `Failed to load resource: the server responded with a status of 502 (Unable to load resume data) @ http://localhost:3456/:0` — the document's own 502, expected. No hydration warnings.
- Server log `grep -c onrender` → 0.

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) `/api/resume` server cache 1h, PDF 1-day cache unchanged | diff above: `-    maxAge: 60 * 60 * 24 * 12,` / `+    maxAge: 60 * 60,`; `server/api/generate-pdf.ts` not in the diff (`CACHE_MAX_AGE_MS = 60 * 60 * 24 * 1000` untouched) |
| (2) empty upstream resume → 502, not cached, page shows the error page | `npm test` `Tests  28 passed (28)` incl. "fails as a 502 when the upstream sends no public field"; runtime: `/api/resume 502`, `/ 502`, 2 empty mock hits; browser: `HTTP status: 502`, heading "Đã có lỗi phía máy chủ" |
| (3) non-empty resume still renders `/` | runtime full mode: `/ 200`, `<title>Resume Võ Tấn Đạt</title>`, `page-index` 1 |
| (4) matches `features/resume-home.md` Behavior #3/#5 as updated | `## Feature doc changed` above |
| (5) build+lint+typecheck+test clean | `build exit 0 · lint exit 0 · typecheck exit 0 · test exit 0`; `✨ Build complete`; `Test Files  10 passed (10)` |
| comments per code-comments.md | one JSDoc touched (`fetchResume`, exported function: WHY kept — "so `defineCachedEventHandler` never caches it and the page fails instead of rendering blank"); no issue refs, no new `//` |

## Supersedes: none
`grep -n "#421\|#419" haven/diagrams/dev-loop.prime-mermaid.md` → only the new `resume-cache-empty` row.

## Noticed, not done
- `pages/index.vue:64,69` `isValid` guard is now effectively always true after a successful load (an empty resume can't reach it anymore). Left in (SmallestDiff, harmless); removing it is a separate cleanup.
- `server/api/github.ts`, `blogs/detail/[id].ts`, `blogs/categories.ts` still cache 12 days — out of scope (#421 is resume only).

## Seal gate: none (no commit/push/PR in this pass)
