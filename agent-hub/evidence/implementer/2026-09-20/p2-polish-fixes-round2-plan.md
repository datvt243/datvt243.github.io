# 2026-09-20 — p2-polish-fixes-round2

**Worker:** implementer
**Version:** 1.0.0 (dev-loop diagram)
**Node:** `p2-polish-fixes-round2` (new — no prior node matched, created per `pick_next.md`'s "No diagram matches yet" branch; named "round2" since an earlier `p2-polish-sweep` node already exists from a prior review pass, this is a different batch of P2 items from the newer 2026-09-20 review)
**Task:** Fix 5 P2/polish findings from portfolio review — issue #180: (1) Duplicated Nuxt UI badge-override object in `projects/Index.vue`/`github/part/Item.vue`. (2) 2 remaining literal Tailwind colors (`ListRender.vue`, `PostCategories.vue`). (3) `server/api/github.ts`'s cache `getKey()` names the wrong endpoint. (4) Unsanitized `v-html` on first-party blog content. (5) `PostCategories.vue`'s untranslated strings.

## Hub bytes before: 111789

## Acceptance criteria
1. `techBadgeUi`/`topicBadgeUi`'s duplicated object extracted to one shared constant, both call sites updated, same visual output.
2. `ListRender.vue`'s empty state and `PostCategories.vue`'s error text use existing `--theme-*` tokens, not literal Tailwind colors — no new token invented (issue explicitly says "existing").
3. `server/api/github.ts`'s cache key renamed to reference `github`, not `resume`.
4. `themes/portfolio-dev/pages/post/Detail.vue`'s blog-content `v-html` is sanitized server-side before the response is ever cached or shipped to the client.
5. `PostCategories.vue`'s "No categories" and fetch-error strings go through `t()`, with new keys in both `vi.json`/`en.json`.
6. `npm run build` clean, `npm run lint` clean (0 errors, warning count not increased from baseline).
7. Real UI check via Chrome CDP — badges, empty state, sanitized content all have a visual/behavior component.

## Files to touch
- `themes/portfolio-dev/pages/projects/Index.vue`
- `themes/portfolio-dev/pages/github/part/Item.vue`
- `utils/themeBadgeUi.ts` (new), `utils/index.ts` (barrel export)
- `components/ListRender.vue`
- `themes/portfolio-dev/components/PostCategories.vue`
- `server/api/github.ts`
- `server/api/blogs/detail/[id].ts`
- `i18n/locales/{vi,en}.json`
- `package.json`/`package-lock.json` (new dependency: `sanitize-html` + `@types/sanitize-html`)

No env var needed.
