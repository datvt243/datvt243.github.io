# 2026-08-19 — giscus-comment (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `giscus-comment`
- Issue: #74, branch `feature/74`

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/post/Comments.vue` (new) | Auto-imports as `<ThemePostComments>`. Reads `GISCUS_CATEGORY`/`GISCUS_CATEGORY_ID`/`GISCUS_REPO_ID` from `useRuntimeConfig().public`; repo name (`datvt243/datvt243.github.io`) is a hardcoded constant, matching the `SITE_URL` convention in the already-sealed `rss-sitemap-feed` node's files. Renders the placeholder `<p>` when the 2 opaque IDs aren't set (this repo's real current state); otherwise dynamically injects `https://giscus.app/client.js` inside `<ClientOnly>`, and a `colorMode` watcher `postMessage`s `setConfig` to the giscus iframe when it exists (guarded no-op otherwise) |
| `themes/portfolio-dev/pages/post/Detail.vue` | Added `<ThemePostComments />` after the existing footer/back-link, inside the `<article>` |
| `nuxt.config.ts` | 3 new `runtimeConfig.public` keys: `GISCUS_CATEGORY`, `GISCUS_CATEGORY_ID`, `GISCUS_REPO_ID` |
| `.env.example` | Same 3 new keys, empty |
| `CLAUDE.md` (root) | Documented the 3 new env vars + the 3-step manual prerequisite (enable Discussions → install Giscus GitHub App → run giscus.app's config generator) |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New node `giscus-comment`: PENDING → IN_PROGRESS (will be SEALED by the verifier) |

## Real blocker (disclosed in the plan, confirmed still true)
`gh api repos/datvt243/datvt243.github.io --jq .has_discussions` → `false`.
GitHub Discussions is not enabled, and the Giscus GitHub App isn't
installed — both require an operator action in a browser
(`github.com/apps/giscus/installations/new`), which this session
structurally cannot do. This means the LIVE embedded comment widget
itself is NOT verifiable in this pass — scoped out of this node's
acceptance criteria (see plan note), tracked below as "Noticed, not
done" rather than silently skipped or faked.

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — clean, verbatim tail:
```
Σ Total size: 28.4 MB (10.3 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```
Exit code 0, full log checked, no error string anywhere. (Note:
`rss.xml.mjs`/`sitemap.xml.mjs` from the sealed `rss-sitemap-feed` node
don't appear in this build's output — expected, since `feature/74` was
branched from `main` directly, not from `feature/73`, per this repo's
one-branch-per-issue convention; that node's own build was independently
verified on its own branch.)

`npm run lint` — verbatim tail, exact match to the pre-existing session
baseline:
```
✖ 34 problems (0 errors, 34 warnings)
```
Grepped specifically for the new/changed files:
`Comments.vue` → 0 matches (0 new warnings). `Detail.vue` → 1 match, but
it's the pre-existing `'props' is assigned a value but never used`
warning already present before this change (unrelated to the 1-line
`<ThemePostComments />` addition).

## Browser verification
Chrome CDP port 9888 (already running, reused per `/browser`). Built +
ran a real preview server (`node .output/server/index.mjs`, port 3000).

First attempt at navigating to `/blogs/67123bdf9c6e9bcf4f7bf006` timed
out after 20s on `/api/blogs/detail/[id]` — traced to the free-tier
Render.com blog API backend's cold-start latency (a subsequent direct
`curl` to the same detail endpoint immediately after returned `HTTP 200`
in 0.001s, and the page loaded normally right after) — not a bug in this
diff or a regression; noted here for the verifier's benefit, not hidden.

Connected via `puppeteer-core` (`puppeteer.connect({ browserURL:
'http://localhost:9888' })`), navigated with real `page.goto` +
`waitUntil: 'networkidle2'` (not a raw XHR check), then a real
click-based interaction on the header's dark/light toggle button (not a
raw store mutation) to exercise the `colorMode` watcher:

```json
{"hasCommentsHeadingCI":true,"hasPlaceholder":true,"giscusDivExists":false,"iframeExists":false}
```
(`hasCommentsHeadingCI` checked case-insensitively because the heading's
`uppercase` Tailwind class changes what `document.body.innerText`
reports, not the underlying text.)

Console errors captured via `page.on('console')` + `page.on('pageerror')`
across the full sequence (initial load, then 2x clicks on the real
toggle button to flip dark→light→dark): **0 errors** at every step —
confirms the `colorMode` watcher's `if (!iframe...) return` guard
correctly no-ops instead of throwing when giscus hasn't loaded (this
repo's real current state).

Preview server process killed after verification, no lingering process.

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | `Comments.vue` reads config, hardcodes repo constant | File created; cited above |
| 2 | Renders placeholder when IDs unset | `hasPlaceholder: true`, `giscusDivExists: false` — cited above |
| 3 | Injects giscus script with correct `data-*` when configured | N/A to verify live in this pass (IDs genuinely unset) — code present, structurally follows giscus's documented client.js contract; not claimed as runtime-verified |
| 4 | `colorMode` watcher posts `setConfig`, no-ops safely otherwise | 0 console errors across load + 2x real toggle clicks — cited above |
| 5 | Wired into `Detail.vue` | Diff cited; `hasCommentsHeadingCI: true` confirms it rendered on a real page |
| 6 | `nuxt.config.ts`/`.env.example`/root `CLAUDE.md` updated | Diff cited |
| 7 | Build/lint clean | Cited above |
| 8 | Live embedded widget explicitly out of scope | Disclosed here and in the plan, not silently skipped |

## Noticed, not done
- The live Giscus embed (criterion 3's actual runtime behavior) needs an
  operator to, once: (1) enable GitHub Discussions on
  `datvt243/datvt243.github.io`, (2) install the Giscus GitHub App
  (`github.com/apps/giscus/installations/new`), (3) run
  `https://giscus.app`'s config generator against this repo and fill the
  resulting `GISCUS_CATEGORY`/`GISCUS_CATEGORY_ID`/`GISCUS_REPO_ID` into
  `.env`. Worth a dedicated follow-up node once that's done, to actually
  CDP-verify a real rendered comment iframe — not fakeable in this
  session.
- `themes/portfolio-dev/pages/post/RelatedArticles.vue` exists but isn't
  referenced anywhere in the codebase (confirmed via
  `grep -rn "RelatedArticles"` — 0 matches outside its own file) — pre-
  existing dead code, unrelated to this node, not touched here.

## Seal gate
None — no outward-facing action (no commit/push/PR) in this implementer
pass.
