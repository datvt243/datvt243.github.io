# 2026-09-20 — fix-blog-author-tag (diff)

**Worker:** implementer
**Node:** `fix-blog-author-tag`

## Diff

| File | Why |
|---|---|
| `themes/portfolio-dev/pages/post/Author.vue` | Replaced the fully-hardcoded placeholder (`"Author Name"`, `"Author Job"`, a `flowbite.com` stock photo, `href="#"`) with real, already-available data — `useAppConfig().AppHeading` ("Đạt Võ") for the name, `contact.social.github` for the `rel="author"` link, and the local `/Avatar.png` asset (already used by `Hero.vue`, guaranteed to exist, no new fetch). The fabricated "Author Job" line was dropped entirely — no truthful job-title source exists without adding a new `useResumeStore()` fetch to every blog page, which would be more than the smallest diff this fix calls for. |
| `themes/portfolio-dev/pages/post/Detail.vue` | Fixed the `to="'/blogs'"` binding bug (was a literal 10-character string, not a route) and replaced the fake single `#tag` with the real `Post.tags` array (`v-for`, already validated as `z.array(z.string()).optional()` in `server/utils/blogSchemas.ts`). Rendered as plain `<span>` badges, not links — confirmed via `layouts/blog.vue`/`PostCategories.vue`/`server/api/blogs/posts.ts` that this app's only real filter is `?category=<slug>` against `Post.categoryIds`, a separate taxonomy from `Post.tags`; linking a tag to `/blogs?category=${tag}` would silently return 0 results (categories and tags are different values), which is a worse bug than the one being fixed. The whole "Tags" heading block is now `v-if="modelValue.tags?.length"` so posts with no tags don't show an empty section. |

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
(The `sharp` warning is the pre-existing darwin-arm64 warning recorded in prior evidence notes, not new.)

`npm run lint` (verbatim):
```
✖ 13 problems (0 errors, 13 warnings)
```
Exact match to the current baseline (13 warnings, unchanged — confirmed the `Detail.vue:11 'props' is assigned a value but never used` warning is pre-existing, not introduced by this diff: it's Vue's script-setup `defineProps` return binding being unused because the template reads prop keys directly (`modelValue.xxx`), which was already true before this change).

## Browser verification
Visual/behavior change (blog post byline + tags rendering) — checked via Chrome CDP (port 9888, `puppeteer-core`) against a real `npm run dev` instance (port 4111), against the real live blog API (confirmed cold-starting at first check — `curl` directly against `https://blog-api-nodejs-express.onrender.com` took 24.1s to respond — warmed it, then re-checked):

- Post **with** real tags (`671240459c6e9bcf4f7bf00d`, `tags: ["vue"]`):
  - `authorName`: `"Đạt Võ"` (was `"Author Name"`)
  - `authorHref`: `"https://github.com/datvt243"` (was `href="#"`)
  - Rendered author block HTML: `<img ... alt="Đạt Võ" src="/Avatar.png">` + `<a href="https://github.com/datvt243" target="_blank" rel="author noopener">Đạt Võ</a>` — no flowbite.com URL anywhere.
  - `tagSpans`: `["#vue"]` — the real tag, not the fake `#tag`.
- Post **without** tags (`67123bdf9c6e9bcf4f7bf006`, `tags: []`):
  - `authorName`: `"Đạt Võ"` — same correct byline.
  - `headings`: `["Bình luận"]` only — the "Tags" `<h2>` is correctly absent (empty-tags case hides the whole block).
  - `bodyHasHash`: `false` — confirmed no leftover fake `#tag` text anywhere on the page.
- Console errors on both pages: `[]` (empty array, 0 errors).

Script: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/3010f9ae-4713-4cd2-8a1a-3217fd3407e6/scratchpad/verify-178.cjs` (scratch, not committed).

## Acceptance

| Criterion | Evidence |
|---|---|
| No hardcoded fake author content | CDP: `authorName: "Đạt Võ"`, `authorHref: "https://github.com/datvt243"`, rendered HTML has 0 `flowbite.com`/`"Author Name"`/`"Author Job"` occurrences |
| Tag binding bug fixed, real tags rendered, no dead/misleading link | CDP: `tagSpans: ["#vue"]` on the tagged post; `bodyHasHash: false` (no fake `#tag`) on the untagged post; tags rendered as `<span>`, not a link to a non-functional filter |
| Build clean | `npm run build` tail: `✨ Build complete!`, only the pre-existing `sharp` warning |
| Lint clean, baseline unchanged | `npm run lint`: `✖ 13 problems (0 errors, 13 warnings)` — exact match to the pre-existing baseline |
| Real UI verified | CDP script output above, both a tagged and untagged real post, 0 console errors on either |

## Noticed, not done
- `Author.vue` still has no dynamic per-post author (this blog is single-author, per issue #178's own framing — "wire to the real author... or remove the byline" — a single static author was the smallest-diff choice, not a multi-author system).
- The rest of the P1/P2/P3 findings from the same review pass are tracked separately in issues #179/#180/#181 — out of scope for this node.

## Seal gate
None — no outward-facing action taken (no commit/push/PR). Working tree has the diff on branch `178-fix-2-p0-critical`, uncommitted, awaiting verifier then operator's own `/ship` step.
