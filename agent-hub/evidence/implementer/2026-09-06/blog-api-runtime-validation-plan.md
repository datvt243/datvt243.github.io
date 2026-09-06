# 2026-09-06 - blog-api-runtime-validation

Worker: implementer
Version: 0.1.0
Node: `blog-api-runtime-validation` (new — no existing node matched, appended per `pick_next.md`'s "No diagram matches yet" failure branch)
Task: `/todo #141` — "Add runtime schema validation (zod) for blog API responses"

## Hub bytes before: 79297

## Acceptance criteria (derived from issue #141)
1. Introduce a runtime schema check (zod) at the boundary where `server/api/blogs/*` calls the external blog API.
2. A shape mismatch fails loudly with a clear error, instead of propagating an undefined/wrong-shaped value into the theme layer.
3. Applies to all 3 blog-API boundary points, not just the one already TS-typed in `blog-posts-shape-fix` (posts list, post detail, categories).

## Files
| File | Why |
|---|---|
| `server/utils/blogSchemas.ts` (new) | zod schemas for `Post`/`PaginatedPosts`/categories + `parseBlogApiResponse()` helper that throws a 502 on mismatch |
| `server/utils/cacheGetPost.ts` | posts-list boundary — replaced the TS-only `$fetch<APIFormatResponse<PaginatedPosts>>` cast with `parseBlogApiResponse` |
| `server/api/blogs/detail/[id].ts` | post-detail boundary — same replacement |
| `server/api/blogs/categories.ts` | categories boundary — same replacement |
| `types/blog.ts` | `Post.isPublic` made optional — required per the existing type, but the real API never returns it (see Noticed/Key finding below) |
| `package.json`/`package-lock.json` | `zod` added to `dependencies` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | new node appended at end (`AppendOnly`) |

## Command
```
npm run build
npm run lint
```
(from `doctrine/MEMORY.md`, repo root)

## Output
`npm run build`: exit 0, `✨ Build complete!` (cold cache, `rm -rf node_modules/.cache .nuxt .output` first), same pre-existing darwin-arm64 `sharp` warning (`[@nuxt/image] WARN sharp binaries for darwin-arm64 cannot be found...`), not new.

`npm run lint`:
```
✖ 30 problems (0 errors, 30 warnings)
```
2 fewer than the known 32-warning baseline — explained in "Noticed, not done" below, not a hidden regression.

## Browser verification
Real UI checked via Chrome CDP (port 9888, already running, `puppeteer-core`, already a project dependency) against `npm run dev` on port 3000:
- `GET /blogs` (real click-based load, `waitUntil: networkidle0`): 9 real post links found (`a[href^="/blogs/"]`), categories sidebar populated (no "No categories" fallback text), 0 console errors, 0 `>=400` responses from any `/api/blogs/*` URL.
- Real click (not `Page.navigate`) on the first real post link (`/blogs/67123bdf9c6e9bcf4f7bf006`, a real `_id` per `themes/portfolio-dev/pages/post/Item.vue`'s `blogs/${props.modelValue._id}` link pattern): URL changed to that path, `document.title` = `"Blog"`, body text starts with the real post's title/author/date ("Cài đặt iTerm2, Oh My Zsh, ..."), 0 console errors on the detail page.
- 1 unrelated error captured across the whole run: a giscus.app widget `net::ERR_ABORTED` network request — third-party comment-widget iframe, unrelated to this change's scope (blog API validation), not investigated further.

Also independently `curl`'d all 3 modified endpoints directly against `http://localhost:3000` after the schema fix below, confirming 0 false 502s against the real live external API:
- `GET /api/blogs/posts?page=1&perPage=5` → `"status": true`, real post data, no `error` field.
- `GET /api/blogs/categories` → array of real category objects (`_id`/`name`/`slug`/`description`), no `error` field.
- `GET /api/blogs/detail/67123bdf9c6e9bcf4f7bf006` → `"status": true`, real post detail, no `error` field.

## Acceptance
| Criterion | Evidence |
|---|---|
| Runtime schema check added at the external blog API boundary | `server/utils/blogSchemas.ts` (new file) + wired into all 3 call sites listed above |
| Shape mismatch fails loudly with a clear error | `parseBlogApiResponse()` throws `createError({ statusCode: 502, statusMessage: 'Blog API response shape mismatch (<context>)', data: result.error.issues })` on `safeParse` failure — same pattern as the existing `generate-pdf.ts`'s `throw createError({ statusCode: 502, statusMessage: 'Unable to load resume data' })` |
| Applies to posts list, post detail, AND categories (not just the posts-list shape already TS-typed) | All 3 files in the table above modified |
| Real live data actually validates (no false-positive 502s) | Direct `curl` re-checks above, all 3 returning real `status: true` data with no `error` field |
| Build clean | `npm run build` exit 0, `✨ Build complete!`, cited above verbatim |
| Lint clean | `✖ 30 problems (0 errors, 30 warnings)`, cited above verbatim |

## Noticed, not done
- **Lint warning count dropped from 32 → 30, not a regression**: the pre-existing `categories.ts` destructured `errors`/`message` from the fetch result but never used them (2 pre-existing `@typescript-eslint/no-unused-vars` warnings). The new code only destructures `{ status, data }` (the fields actually used), so those 2 warnings disappeared. Confirmed by diffing full lint output before/after via `git stash`/`git stash pop` — the only diff is exactly those 2 lines plus the total count.
- **`Post.isPublic` and the categories shape were already wrong before this task** (key finding, not something #141 asked to fix, but unavoidable while adding a schema that has to match reality): confirmed via direct `curl` against `https://blog-api-nodejs-express.onrender.com` that (a) `isPublic` is never present on a real post object (real field is `status: "publish"`, a different field entirely, and `__v` — both silently stripped by zod's default non-strict object mode, not declared), and (b) `/categories` returns full objects, not `string[]` — matching what `PostCategories.vue`'s own `Category` interface already expected. Fixed `types/blog.ts`'s `isPublic` to optional and built `categorySchema` from the real shape, since a schema built on the stale type/cast would 502 on every real request — this was necessary for the schema to be correct at all, not scope creep.
- `types/index.ts`'s `APIFormatResponse<T>` generic itself is left untouched — still TS-only, but now paired with `apiFormatResponseSchema()` in `blogSchemas.ts` doing the actual runtime check with the same field set.
- No changes made to `server/api/resume.ts` or `server/api/github.ts` — issue #141 scoped this to the blog API only.

## Seal gate
None — no outward-facing action taken (no commit/push/PR/delete). `npm install zod` modified local `package.json`/`package-lock.json` (a local dependency-tree change, not itself a commit/push) as part of implementing the acceptance criteria.
