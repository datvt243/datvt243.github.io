# 2026-08-19 — giscus-comment (plan)

- Worker: implementer
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `giscus-comment` (NEW)
- Issue: #74 (`Giscus comment cho trang blog detail`)

## Task
Thêm comment section dùng Giscus (GitHub Discussions) vào
`themes/portfolio-dev/pages/post/` (trang blog detail), đồng bộ theme với
`useColorMode()` hiện tại.

## Current state
- `themes/portfolio-dev/pages/post/Detail.vue` = `<ThemePostDetail>`,
  rendered by `pages/blogs/[id].vue`. No comment section exists.
- `useColorMode()` pattern confirmed in
  `themes/portfolio-dev/layout/Header.vue:9` (`colorMode.value` is
  `'dark'`/`'light'`).
- Real GitHub check (`gh api repos/datvt243/datvt243.github.io --jq
  .has_discussions`) → **`false`**. GitHub Discussions is NOT enabled on
  this repo.

## Real blocker (disclosed up front, not discovered mid-way)
A working Giscus embed needs 3 things that don't exist yet and CANNOT be
obtained by this session:
1. GitHub Discussions enabled on the repo (a repo-settings change —
   possible via `gh api -X PATCH -f has_discussions=true`, but this is an
   outward-facing change to shared repo state → needs operator approval,
   same as any other seal-gate action).
2. The Giscus GitHub App installed on the repo
   (`github.com/apps/giscus/installations/new`) — this is an OAuth-consent
   step in a browser, structurally impossible for a CLI/agent to do on the
   operator's behalf.
3. The real `data-repo-id`/`data-category-id` values from
   `https://giscus.app`'s config generator — only obtainable AFTER (1) and
   (2) are done by a human.

Given this, the scope of this node is split honestly:
- **In scope, fully verifiable now**: the component itself, wired into
  `Detail.vue`, config-driven via 3 new env vars, with a graceful
  "not configured" fallback (renders instead of a broken/erroring embed)
  when those env vars are unset — which is the REAL current state of this
  repo, so this is the actual path that gets CDP-verified.
- **Out of scope for this node, needs a follow-up node**: the live
  embedded comment widget itself, which needs a human to do (1) and (2)
  above, then fill in the resulting IDs into `.env`. Recorded as
  "Noticed, not done" in the diff note, not silently skipped.

## Acceptance criteria (scoped to what's actually checkable today)
1. `themes/portfolio-dev/pages/post/Comments.vue` (new) → auto-imports as
   `<ThemePostComments>`. Reads `GISCUS_REPO_ID`/`GISCUS_CATEGORY`/
   `GISCUS_CATEGORY_ID` from `useRuntimeConfig().public`; repo name itself
   (`datvt243/datvt243.github.io`) is a hardcoded constant (deterministic,
   matches this repo's existing convention of hardcoding fixed/site-
   identity constants directly, e.g. the `SITE_URL` constant in the
   `rss-sitemap-feed` node's 2 files).
2. If `GISCUS_REPO_ID` or `GISCUS_CATEGORY_ID` is unset → render a small
   muted placeholder note instead of loading the (guaranteed-to-fail)
   giscus script — verified live via CDP (0 console errors on
   `/blogs/<id>`, since that's this repo's real current state).
3. If both are set → dynamically inject `https://giscus.app/client.js`
   with the correct `data-*` attributes (`data-repo`, `data-repo-id`,
   `data-category`, `data-category-id`, `data-mapping="pathname"`,
   `data-theme` matching current `colorMode.value`), wrapped in
   `<ClientOnly>` (SSR-unsafe, manipulates `document`).
4. A `watch` on `colorMode.value` posts `{giscus: {setConfig: {theme}}}`
   to the giscus iframe via `postMessage` when it exists, guarded (`if
   (!iframe) return`) so it's a no-op (not a thrown error) in the
   "not configured" fallback state — verified live via CDP by toggling
   light/dark on `/blogs/<id>` and checking 0 console errors.
5. `<ThemePostComments />` wired into `Detail.vue` (after the existing
   footer/back-link).
6. `nuxt.config.ts`'s `runtimeConfig.public` gets 3 new keys
   (`GISCUS_REPO_ID`, `GISCUS_CATEGORY`, `GISCUS_CATEGORY_ID`), `.env.example`
   gets the same 3 (empty), root `CLAUDE.md`'s Environment Variables table
   documents them + the manual prerequisite steps.
7. `npm run build` + `npm run lint` clean.
8. Explicitly NOT an acceptance criterion for this node: a real rendered
   Giscus iframe with actual GitHub comments — blocked on the 3-step
   manual prerequisite above, tracked as "Noticed, not done".

## Files
- `themes/portfolio-dev/pages/post/Comments.vue` (new)
- `themes/portfolio-dev/pages/post/Detail.vue` (wire in)
- `nuxt.config.ts`
- `.env.example`
- `CLAUDE.md` (root)
- `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` (new node row)

## Blockers
Partial — see "Real blocker" above. Not a full stop: the config-driven
component + graceful-fallback path is fully implementable and verifiable
today. The live embed itself is blocked on operator action outside this
session's reach (enabling Discussions + installing the Giscus GitHub App).
