# 2026-09-19 — blog-api-504-resilience (verifier)

- Worker: verifier
- Node: `blog-api-504-resilience`
- Independent pass — re-derived every claim fresh.

## Independent checks
- `git diff -- server/utils/cacheGetPost.ts server/api/blogs/posts.ts
  server/routes/sitemap.xml.ts server/routes/rss.xml.ts` read directly off
  disk: matches the implementer diff note exactly; confirmed no leftover
  `10.255.255.1`/`TEMP-DEBUG` artifacts anywhere in the working tree
  (`git diff | grep -i "TEMP\|10.255.255.1\|console.log"` → only a false
  positive on the literal string `template` inside a `<template>` tag, 0
  real matches).
- `npm run build` / `npm run lint`: independently re-run from a cold
  `.nuxt` cache, both clean (`✨ Build complete!` / `30 problems, 0
  errors, 30 warnings`, baseline match).
- Re-derived the core reliability claim independently rather than trusting
  the implementer's numbers: confirmed `timeout: 6000, retry: 0` is
  genuinely in the final file (not still `retry: 3` from before), and
  independently reproduced the implementer's cache-poisoning test
  methodology description against the diff — the fallback assignment
  happens in the *caller* (`posts.ts`/`sitemap.xml.ts`/`rss.xml.ts`), never
  inside the `defineCachedFunction`-wrapped body, so a rejection genuinely
  can't be written to the cache; this is confirmed by reading the code
  structure directly, not just re-trusting the implementer's live-log
  citation.
- Live happy-path re-check (backend was warm at verification time, same as
  during implementation): `curl /sitemap.xml` and `curl /rss.xml` both
  returned real post data with the corrected domain (see the
  `seo-canonical-domain-fix` seal note) — confirms this node's try/catch
  wrapping doesn't accidentally swallow the success path.

## Acceptance re-check
| # | Criterion | Independent evidence | Met? |
|---|---|---|---|
| 1 | Bounded timeout, no more ineffective retries | Confirmed in final file | ✅ |
| 2 | All 3 routes degrade instead of hard-failing | Code-structure re-read: every call site wraps `cacheGetPosts` in try/catch with a safe fallback | ✅ |
| 3 | Failure not cached for the full maxAge | Code-structure re-read: fallback assignment lives outside the cached function body | ✅ |
| 4 | Build clean | Independently re-run | ✅ |
| 5 | Lint clean | Independently re-run, baseline match | ✅ |

## Verdict: SEAL
