# 2026-10-04 - object-parameter-rule (plan)

- Worker: implementer · Version: 0.1.0
- Node: `object-parameter-rule` on `haven/diagrams/dev-loop.prime-mermaid.md` (new row, appended at end, IN_PROGRESS)
- Issue: #214 (https://github.com/datvt243/datvt243.github.io/issues/214) · Branch: `214-refactor-apply-object` (base `staging`)
- Task (verbatim, issue body): "Hãy kiểm tra toàn bộ source code của project và áp dụng quy tắc Object Parameter. Khi một function/method nhận **hơn 2 arguments**, refactor để dùng **object parameter** … Function nhận ≤ 2 args không cần thay đổi … giữ nguyên functionality … Cập nhật tất cả nơi gọi function (call sites) … arrow functions, async functions, constructor - áp dụng quy tắc tương tự … Ưu tiên: src/, lib/, utils/ trước. Bỏ qua: node_modules/, dist/, build/, .test files"

## Hub bytes before: 138920

(`/hub-tokens` script: `= per-session total (implementer or verifier boot load)    138920 B  ~   34730 tok`)

## Inventory method
TypeScript-AST scan (`object-parameter-rule-assets/scan.cjs`): every `ts.isFunctionLike` node
(function declarations, function expressions, arrow functions, methods, constructors, get/set
accessors) with `parameters.length > 2`, over all `git ls-files '*.ts' '*.js' '*.mjs' '*.cjs' '*.vue'`
outside `agent-hub/`, `.claude/`, `node_modules/`, `dist/`, `build/`, `*.test.*`. `.vue` files are
split by `@vue/compiler-sfc` and both `<script>`/`<script setup>` blocks are scanned.
Type-only signatures (function types, call signatures, interface method signatures) are scanned
separately (`scan-types.cjs`).

Verbatim output (before):
```
plugins/ErrorHandler.ts:7 [ArrowFunction] (anon)(error, instance, info)
server/utils/blogSchemas.ts:91 [FunctionDeclaration] parseBlogApiResponse(schema: T, raw: unknown, context: string)
server/utils/createPDF.ts:124 [ArrowFunction] (anon)(startDate, endDate, isCurrent)
server/utils/createPDF.ts:177 [ArrowFunction] (anon)(phone: string, email: string, address: string)
server/utils/createPDF.ts:184 [ArrowFunction] (anon)(github: string = '', linkedin: string = '', website: string = '')
server/utils/createPDFAts.ts:63 [ArrowFunction] (anon)(_, slash: string, tag: string)
server/utils/createPDFAts.ts:76 [ArrowFunction] (anon)(start: number | null | undefined, end: number | null | undefined, isCurrent: boolean, h: Headings)
server/utils/createPDFAts.ts:82 [ArrowFunction] (anon)(title: string, meta: string, body = '', stack: string[] = [], stackLabel = '')
files scanned 92 hits 8
```
(`(anon)` = an arrow assigned to a `const`; the names are `getTime`, `getInfo`, `getWebsite`,
`formatRange`, `entry`.) Type-only signatures: `files scanned 92 hits 0`.

Priority dirs: `src/` and `lib/` do not exist; `utils/` exists and has 0 hits. No `*.test.*`/`*.spec.*` files in the repo. No class constructors with > 2 params.

## Plan
| # | Function | File | Call sites | Action |
|---|---|---|---|---|
| 1 | `parseBlogApiResponse` | `server/utils/blogSchemas.ts` | 3 (`server/api/blogs/categories.ts`, `server/api/blogs/detail/[id].ts`, `server/utils/cacheGetPost.ts`) | refactor |
| 2 | `getTime` (IIFE) | `server/utils/createPDF.ts` | 1 (its own invocation) | refactor |
| 3 | `getInfo` | `server/utils/createPDF.ts` | 1 | refactor |
| 4 | `getWebsite` | `server/utils/createPDF.ts` | 1 | refactor |
| 5 | `formatRange` | `server/utils/createPDFAts.ts` | 4 | refactor |
| 6 | `entry` | `server/utils/createPDFAts.ts` | 5 | refactor |
| — | `vue:error` hook callback | `plugins/ErrorHandler.ts` | called by Nuxt/Vue | **excluded**: signature `(error, instance, info)` is dictated by the Nuxt runtime hook, we don't control the caller |
| — | `.replace(regex, (_, slash, tag) => …)` | `server/utils/createPDFAts.ts` | called by `String.prototype.replace` | **excluded**: callback signature `(match, ...groups)` is dictated by the JS spec |

## Behavior-preservation strategy (no test suite)
- PDF renderers: `render.cjs` loads `pageRender`/`pageRenderAts` via jiti and renders 3 fixtures
  (`fixtures.cjs`: isCurrent true/false, endDate null, empty social/phone/address, certificates with
  isNoExpiration true/false, awards, empty lists) × {classic, ats-vi, ats-en} = 9 outputs under
  `TZ=UTC`. Baseline before any edit: sha256 `8c9f8329c2afd7963f2533ee1259d9684c126c16a67aa58f1c1fecf7ccdec7f9`,
  47064 bytes, 0 THROW (saved as `object-parameter-rule-assets/render-before.txt`). After edit must be byte-identical.
- `parseBlogApiResponse`: differential test `parse2.cjs`, HEAD's version (via `git show`) vs new version, same inputs × 3 schemas.
- Type safety: server `tsc --noEmit -p .nuxt/tsconfig.server.json` error set on touched files, HEAD vs working tree.

## Blockers
None. No env var needed (pure refactor of server-side helpers; PDF HTML is checked without launching Chrome).
