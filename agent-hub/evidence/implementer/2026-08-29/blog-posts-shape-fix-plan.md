# 2026-08-29 — blog-posts-shape-fix (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `blog-posts-shape-fix` (new)
- Task (verbatim): Fix issue #87: `server/utils/cacheGetPost.ts`'s
  `cacheGetPosts` is typed as returning `Post[]` but the real blog API
  returns `{data: Post[], total, page, perPage}`. Fix the type/shape at the
  source and remove the 3 defensive unwraps currently in
  `themes/portfolio-dev/pages/blogs/Index.vue`, `server/routes/rss.xml.ts`,
  `server/routes/sitemap.xml.ts`; also fix `server/api/blogs/posts.ts` to
  return a correctly typed/shaped response. Issue #87, branch feature/87.

## Confirmation of the real API shape (read, not guessed)
`curl "https://blog-api-nodejs-express.onrender.com/api/v1/post/?page=1&per_page=2"`
→ `{status: true, data: {data: [...posts], total: 4, page: 1, perPage: 2}}`
— confirms `APIFormatResponse<T>.data` for this endpoint is really
`{data: Post[], total, page, perPage}`, not `Post[]` directly, exactly as
issue #87 described.

## Node exists? No — created new node `blog-posts-shape-fix`.

## Anchors located via grep (real paths)
- `types/blog.ts` — where `Post` lives, added new `PaginatedPosts`
  interface here (same file, same domain)
- `server/utils/cacheGetPost.ts` — `cacheGetPosts`, the actual source of
  the mistype
- `server/api/blogs/posts.ts` — the one public endpoint wrapping
  `cacheGetPosts`
- `server/routes/rss.xml.ts` / `server/routes/sitemap.xml.ts` — the 2
  defensive-unwrap call sites from issue #73
- `themes/portfolio-dev/pages/blogs/Index.vue` — the 3rd defensive
  workaround (a duplicated local `GetPosts` interface + `?.data?.data`)

## Blockers
None.

## Design decision
Added a shared `PaginatedPosts` interface to `types/blog.ts` rather than
just fixing `cacheGetPost.ts`'s local usage — this lets
`blogs/Index.vue`'s duplicated local `GetPosts` interface be deleted and
replaced with the shared type too (same shape, was drifting as a
copy-paste). Smallest diff that removes ALL 3 disclosed defensive
workarounds at once, matching the issue's explicit ask.

On the failure branch (`!status || !data`), `cacheGetPosts` now returns a
proper empty `PaginatedPosts` object (`{data: [], total: 0, page, perPage}`)
instead of a bare `[]` — this is what makes the return type a clean
`Promise<PaginatedPosts>` with no `| []` union, so no calling code needs an
`Array.isArray` guard anymore.

## Acceptance criteria
1. `cacheGetPosts` typed `Promise<PaginatedPosts>`, no `Post[]`/`[]` union.
2. `server/api/blogs/posts.ts`'s public response shape is UNCHANGED
   (byte-for-byte) for the client — `blogs/Index.vue` already expects
   `data.value?.data?.data`, this must keep working with 0 client changes
   beyond the type import swap.
3. `rss.xml.ts`/`sitemap.xml.ts` no longer contain `Array.isArray(...)`
   defensive guards.
4. `blogs/Index.vue`'s local `GetPosts` interface is gone, replaced by the
   shared `PaginatedPosts` import.
5. `npm run build` + `npm run lint` clean.
6. Real verification (non-visual server logic — no CDP required per
   doctrine, but `blogs/Index.vue` did change so a CDP pass on `/blogs` is
   still warranted): `/api/blogs/posts`, `/rss.xml`, `/sitemap.xml` all
   still return real, correct data against a real preview server; `/blogs`
   renders posts with 0 console errors.
