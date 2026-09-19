# 2026-09-19 — seo-canonical-domain-fix (implementer diff)

- Worker: implementer
- Node: `seo-canonical-domain-fix`

## Diff
| File | Why |
|---|---|
| `server/utils/siteUrl.ts` (new) | Single shared `SITE_URL` constant: `process.env.SITE_URL \|\| 'https://resume-nuxt-vert.vercel.app'`. |
| `server/routes/sitemap.xml.ts` | Removed its own local `const SITE_URL = 'https://datvt243.github.io'`, imports the shared constant instead. |
| `server/routes/rss.xml.ts` | Same — removed the local hardcoded copy, imports the shared constant. |
| `nuxt.config.ts` | `i18n.baseUrl` was a 3rd independent hardcoded copy (`'https://datvt243.github.io'`) — now imports and uses the same `SITE_URL` constant. |
| `app.config.ts` | **Found during verification, not in the original audit**: `contact.social.website` (line 33, shown on `/contact`) also hardcoded `'https://datvt243.github.io'` — a 4th copy of the same bug. Fixed as a literal (matching its sibling `github`/`linkedin` fields, which are also literals in this display-config file — not wired to the shared constant since this is personal-contact-link data, not a build-time SEO source of truth). |
| `CLAUDE.md` | Documented the new optional `SITE_URL` env var. |

```diff
--- server/routes/sitemap.xml.ts
-const SITE_URL = 'https://datvt243.github.io'
+import { SITE_URL } from '~/server/utils/siteUrl'

--- server/routes/rss.xml.ts
-const SITE_URL = 'https://datvt243.github.io'
+import { SITE_URL } from '~/server/utils/siteUrl'

--- nuxt.config.ts
+import { SITE_URL } from './server/utils/siteUrl'
...
-    baseUrl: 'https://datvt243.github.io',
+    baseUrl: SITE_URL,

--- app.config.ts
-      website: 'https://datvt243.github.io',
+      website: 'https://resume-nuxt-vert.vercel.app',
```

## Important caveat found during verification
`app.vue`'s `useLocaleHead()` call has `addSeoAttributes` deliberately
**disabled** (see its own in-file comment, referencing issue #80 — only the
`<html lang>` fix was in scope, canonical/hreflang `<link>` tags were
explicitly scoped out). Confirmed live: a fresh SSR page load has **zero**
`<link rel="canonical">` or `<link hreflang>` tags in the DOM at all right
now. So the original audit's specific claim ("every hreflang alternate...
tells search engines the wrong domain") describes what would happen if
`addSeoAttributes` were ever turned on, not literally the current live
behavior — the domain values were still wrong and worth fixing (this node),
but enabling `addSeoAttributes` itself is a separate, larger scope decision
not requested here, so it was left alone.

## Command
`npm run build` then `npm run lint` (verbatim from `doctrine/MEMORY.md`).

## Output
`npm run build`: exit 0, `✨ Build complete!`, same pre-existing darwin-arm64
`sharp` warning (not new).

`npm run lint`: `✖ 30 problems (0 errors, 30 warnings)` — exact match to the
current baseline (see `no-useless-assignment` note in the
`blog-api-504-resilience` node's diff — this node's own files didn't trigger
it).

## Live verification (not CDP — pure HTTP, no visual/behavior change)
Fresh `npm run dev` on port 4011 (after `rm -rf .nuxt` — hit the documented
stale-cache trap once, recovered per `doctrine/domains/PROJECT.md`'s Traps
table):
- `curl http://localhost:4011/sitemap.xml`: all `<loc>` values now
  `https://resume-nuxt-vert.vercel.app/...`.
- `curl http://localhost:4011/rss.xml`: `<link>`/`<guid>` values now the
  same corrected domain.
- `grep -rn "datvt243\.github\.io"` across the repo (excluding
  `agent-hub/`, `.git/`, `README.md`'s own repo-name heading, and
  `Comments.vue`'s `GISCUS_REPO = 'datvt243/datvt243.github.io'` — a GitHub
  repo identifier for Giscus, not a site URL, correctly left alone per root
  `CLAUDE.md`'s own note that this constant "never changes"): 0 remaining
  matches.

## Acceptance
| # | Criterion | Evidence | Met? |
|---|---|---|---|
| 1 | All hardcoded copies point to the confirmed real domain | `curl` output above + 0 remaining `datvt243.github.io` matches | ✅ |
| 2 | Single shared constant, not independent copies | `server/utils/siteUrl.ts` + 3 imports (sitemap, rss, nuxt.config) | ✅ |
| 3 | Build clean | `✨ Build complete!` | ✅ |
| 4 | Lint clean | `30 problems (0 errors, 30 warnings)`, baseline match | ✅ |

## Noticed, not done
`addSeoAttributes: true` on `useLocaleHead()` (would actually emit
canonical/hreflang `<link>` tags) — deliberately out of scope, see caveat
above. Worth a dedicated future node if canonical/hreflang tags are wanted
for real, since it's a distinct decision (issue #80 scoped it out on
purpose) not a bug fix.

## Seal gate
No outward-facing action taken (no commit/push/PR) — working tree left dirty
on the `staging` branch for the operator to review.
