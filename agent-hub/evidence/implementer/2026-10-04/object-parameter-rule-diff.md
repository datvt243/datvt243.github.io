# 2026-10-04 - object-parameter-rule (diff)

- Worker: implementer · Version: 0.1.0
- Node: `object-parameter-rule` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Issue: #214 · Branch: `214-refactor-apply-object` (base `staging`, synced via `git fetch` + `git pull origin staging` → "Already up to date.")
- Task: see `object-parameter-rule-plan.md` (verbatim issue body)
- Status: `sealed_pending_verifier`

## Hub bytes before
138920 (see plan note)

## Diff
`git diff --stat`:
```
 agent-hub/haven/diagrams/dev-loop.prime-mermaid.md |  1 +
 server/api/blogs/categories.ts                     |  2 +-
 server/api/blogs/detail/[id].ts                    |  2 +-
 server/utils/blogSchemas.ts                        |  2 +-
 server/utils/cacheGetPost.ts                       |  2 +-
 server/utils/createPDF.ts                          | 12 ++--
 server/utils/createPDFAts.ts                       | 68 ++++++++++++++++------
 7 files changed, 62 insertions(+), 27 deletions(-)
```

| File | Why |
|---|---|
| `server/utils/blogSchemas.ts` | `parseBlogApiResponse(schema, raw, context)` → `parseBlogApiResponse({ schema, raw, context })`; generic `T` still inferred from `schema` |
| `server/api/blogs/categories.ts` | call site → `{ schema: categoriesResponseSchema, raw, context: 'categories' }` |
| `server/api/blogs/detail/[id].ts` | call site → `{ schema: postResponseSchema, raw, context: \`post detail ${id}\` }` |
| `server/utils/cacheGetPost.ts` | call site → `{ schema: paginatedPostsResponseSchema, raw, context: 'posts list' }` |
| `server/utils/createPDF.ts` | `getTime` IIFE `((startDate, endDate, isCurrent) => …)(startDate, endDate, isCurrent)` → `(({ startDate, endDate, isCurrent }) => …)({ startDate, endDate, isCurrent })`; `getInfo(phone, email, address)` → `getInfo({ phone, email, address })`; `getWebsite(github = '', linkedin = '', website = '')` → `getWebsite({ github = '', linkedin = '', website = '' })` + both call sites |
| `server/utils/createPDFAts.ts` | `formatRange(start, end, isCurrent, h)` → `formatRange({ start, end, isCurrent, h })` (4 call sites); `entry(title, meta, body = '', stack = [], stackLabel = '')` → `entry({ title, meta, body = '', stack = [], stackLabel = '' })` (5 call sites). Multi-line type literal formatting follows the file's existing 150-col style |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | new node row appended at end (`AppendOnly`) |

### Before / after (signatures)
```ts
// 1. server/utils/blogSchemas.ts
- export function parseBlogApiResponse<T extends z.ZodTypeAny>(schema: T, raw: unknown, context: string): z.infer<T>
+ export function parseBlogApiResponse<T extends z.ZodTypeAny>({ schema, raw, context }: { schema: T; raw: unknown; context: string }): z.infer<T>

// 2. server/utils/createPDF.ts (getTime, IIFE)
- const getTime = ((startDate, endDate, isCurrent) => { … })(startDate, endDate, isCurrent)
+ const getTime = (({ startDate, endDate, isCurrent }) => { … })({ startDate, endDate, isCurrent })

// 3. server/utils/createPDF.ts
- const getInfo = (phone: string, email: string, address: string) => { … }
+ const getInfo = ({ phone, email, address }: { phone: string; email: string; address: string }) => { … }

// 4. server/utils/createPDF.ts
- const getWebsite = (github: string = '', linkedin: string = '', website: string = '') => { … }
+ const getWebsite = ({ github = '', linkedin = '', website = '' }: { github?: string; linkedin?: string; website?: string }) => { … }

// 5. server/utils/createPDFAts.ts
- const formatRange = (start: number | null | undefined, end: number | null | undefined, isCurrent: boolean, h: Headings): string
+ const formatRange = ({ start, end, isCurrent, h }: { start: …; end: …; isCurrent: boolean; h: Headings }): string

// 6. server/utils/createPDFAts.ts
- const entry = (title: string, meta: string, body = '', stack: string[] = [], stackLabel = ''): string
+ const entry = ({ title, meta, body = '', stack = [], stackLabel = '' }: { title: string; meta: string; body?: string; stack?: string[]; stackLabel?: string }): string
```
Call sites updated: 3 + 1 + 1 + 1 + 4 + 5 = **15**. Functions refactored: **6**. Excluded: **2** (see Edge cases).

## Command
Exactly as `doctrine/MEMORY.md`: `npm run build`, then `npm run lint` (repo root, Node v24.19.0). No test suite exists.
Additional checks (not substitutes): AST rescan `node object-parameter-rule-assets/scan.cjs`;
`TZ=UTC node object-parameter-rule-assets/render.cjs`; `node object-parameter-rule-assets/parse2.cjs`;
`npx tsc --noEmit -p .nuxt/tsconfig.server.json` (HEAD vs working tree, filtered to touched files).
All harness scripts must be run with the repo root as cwd (they resolve `node_modules`/files from `process.cwd()`).

## Output
`npm run build` → `build exit=0`, tail:
```
[@nuxt/image]  WARN  sharp binaries for darwin-arm64 cannot be found. Please report this as a bug with a reproduction at https://github.com/nuxt/image.
└  ✨ Build complete!
```
(`sharp` warning is the long-standing pre-existing one.)

`npm run lint` →
```
✖ 13 problems (0 errors, 13 warnings)
```
= baseline recorded by the 3 previous SEALED nodes (`13 problems (0 errors, 13 warnings)`).
`npx eslint` on the 6 changed code files → `✖ 5 problems (0 errors, 5 warnings)`, all on untouched lines
(`categories.ts:8` unused `event`; `createPDF.ts:2` unused `GeneralInformation`, `:12` console, `:28`/`:60` `any`) — pre-existing.

AST rescan after:
```
plugins/ErrorHandler.ts:7 [ArrowFunction] (anon)(error, instance, info)
server/utils/createPDFAts.ts:63 [ArrowFunction] (anon)(_, slash: string, tag: string)
files scanned 92 hits 2
```
→ only the 2 deliberate exclusions remain.

PDF render byte-equivalence (`TZ=UTC`, 9 renders):
```
8c9f8329c2afd7963f2533ee1259d9684c126c16a67aa58f1c1fecf7ccdec7f9  render-before.txt
8c9f8329c2afd7963f2533ee1259d9684c126c16a67aa58f1c1fecf7ccdec7f9  render-after.txt
IDENTICAL
```
Fixtures exercise: `Hiện tại` ×8 and `Present` ×6 occurrences (isCurrent branch), endDate-null-not-current, empty phone/address/social, isNoExpiration true/false; 0 THROW.

`parseBlogApiResponse` differential (HEAD copy via `git show HEAD:server/utils/blogSchemas.ts` into a temp file, removed afterwards; 3 schemas × 6 inputs, both OK and 502-THROW paths hit):
```
identical 18/18
```

Server typecheck on touched files (`blogSchemas|createPDF|createPDFAts|cacheGetPost|categories|detail/[id]|generate-pdf`): HEAD `0` errors, working tree `0` errors → `SAME ERROR SET`. tsc does cover these files (`--listFilesOnly` grep → 4 of 4 sampled). Negative control: temporarily changed `meta: formatMonthYear(a.issueDate)` → `meta: 42` → tsc reported `server/utils/createPDFAts.ts(212,89): error TS2322: Type 'number' is not assignable to type 'string'.`; reverted, `cmp` against backup → `restored`, render re-checked → `RENDER-IDENTICAL`.
(The IDE's inline diagnostics shown mid-edit for `createPDFAts.ts`/`generate-pdf.ts` were stale/pre-existing — the real `tsc` run reports 0 errors in those files both at HEAD and now.)

## Browser verification
N/A — no visual change. Only server-side helper signatures changed; the generated PDF HTML is proven byte-identical above, and the blog API responses go through an input/output-identical validator.

## Acceptance
| Criterion | Evidence |
|---|---|
| All functions/methods with > 2 params found | AST scan over 92 files, all function-like kinds incl. constructors/methods; `hits 8` before; type-only signatures `hits 0` |
| Each refactored to a destructured object param | 6 signatures above; rescan `hits 2` = only the excluded ones |
| All call sites updated | 15 call sites in diff; `npm run build` exit 0; tsc 0 errors on touched files (negative control proves tsc would catch a mismatch) |
| ≤ 2-param functions untouched | `git diff --stat` touches only the 6 functions + their call sites |
| Functionality unchanged | PDF render sha256 identical; `parseBlogApiResponse` 18/18 identical |
| Build + lint clean | `✨ Build complete!` exit 0; `13 problems (0 errors, 13 warnings)` = baseline |

## Edge cases
1. **Excluded — framework-dictated signatures**: `plugins/ErrorHandler.ts` `nuxtApp.hook('vue:error', (error, instance, info) => …)` and `createPDFAts.ts:63` `.replace(regex, (_, slash, tag) => …)`. The caller (Nuxt runtime / `String.prototype.replace`) passes positional args — converting them to an object param would break them.
2. **Default values**: positional `x = ''` and destructured `{ x = '' }` both apply only when the value is `undefined` — identical semantics (`getWebsite`, `entry`). `null` still passes through unchanged in both forms.
3. **Generic inference**: `parseBlogApiResponse<T>` still infers `T` from `{ schema }` — callers' destructured `status`/`data`/`errors`/`message` keep their types (tsc 0 errors).
4. **`getTime` is an IIFE** whose params shadowed the outer destructured names; it now takes `{ startDate, endDate, isCurrent }` and is invoked with the shorthand object — same values, same shadowing.
5. **`src/` and `lib/` don't exist** in this Nuxt project; `utils/` exists but had 0 hits. All hits were under `server/`.
6. No `*.test.*`/`*.spec.*` files exist, so no test call sites to update.

## Noticed, not done
- `/hub-tokens` flags `dev-loop.prime-mermaid.md` at 79416B (>15KB), 35 SEALED rows not archived — pre-existing, outside scope.
- `createPDF.ts:122` `m < 9 ? \`0${m}\` : m` pads only months 1–8 (September renders `9/…` not `09/…`) — pre-existing, behavior-preserving refactor so not touched.
- Pre-existing lint warnings in touched files (unused `event`, unused `GeneralInformation`, `any`, `console`) — not touched.

## Seal gate
None — no commit/push/PR made. (The GitHub issue #214 and branch were created by `/todo` step 1 before this pass, per that skill's contract.)

---

## Correction after REOPEN #1 (2026-10-04)
Responds to `evidence/verifier/2026-10-04/object-parameter-rule-reopen.md`. Both "missing" items were real; no code under `server/` changed in this pass.

1. **Lint claim did not reproduce on the tree as submitted.** My `13 problems` above was measured BEFORE I copied the harness scripts into `object-parameter-rule-assets/`; with them present the verifier got `22 problems (0 errors, 22 warnings)`. That claim is superseded by this section.
   Fix (evidence files only, `eslint.config.js` untouched): `/* eslint-disable */` header on `parse2.cjs`, `scan.cjs`, `scan-types.cjs` (the 3 that had warnings). Not added to `fixtures.cjs`/`render.cjs`: a first attempt put it there too and eslint reported `Unused eslint-disable directive` ×2, so removed from those two.
   Also: `parse2.cjs` was not re-runnable as committed (it expected a temp `server/utils/__head_blogSchemas.ts` I had created by hand). It now writes that file from `git show HEAD:…` itself and removes it in `finally`.
2. **Node row sat outside the PM status table** (after the "Any regression…" paragraph). Moved to directly after the `author-github-see-line` row, i.e. the end of the table. Status left `IN_PROGRESS`.

### Re-run output (final tree, assets included)
- `npm run lint` → `✖ 13 problems (0 errors, 13 warnings)` (baseline)
- `npx eslint agent-hub/evidence/implementer/2026-10-04/object-parameter-rule-assets` → no output, `eslint assets exit=0`
- `npm run build` → `build exit=0`, `└  ✨ Build complete!`
- `node …/scan.cjs` → `files scanned 92 hits 2`
- `TZ=UTC node …/render.cjs | shasum -a 256` → `8c9f8329c2afd7963f2533ee1259d9684c126c16a67aa58f1c1fecf7ccdec7f9  -` (= baseline)
- `node …/parse2.cjs` → `identical 18/18`; afterwards `ls server/utils/__head*` → `no matches found` (temp cleaned up)
- `git diff agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` → one `+` line, the node row, between `author-github-see-line` and the blank line before "Any regression…"
