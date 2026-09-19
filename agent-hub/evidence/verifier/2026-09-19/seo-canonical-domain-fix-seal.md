# 2026-09-19 — seo-canonical-domain-fix (verifier)

- Worker: verifier
- Node: `seo-canonical-domain-fix`
- Independent pass (same session, but re-derived every claim fresh — not a
  self-report copy of the implementer note above).

## Independent checks
- `git diff -- server/utils/siteUrl.ts server/routes/sitemap.xml.ts
  server/routes/rss.xml.ts nuxt.config.ts app.config.ts` read directly off
  disk: matches the implementer diff note exactly.
- `npm run build`: independently re-run from a cold `.nuxt` cache, exit 0,
  `✨ Build complete!`, same pre-existing darwin-arm64 `sharp` warning.
- `npm run lint`: independently re-run, `✖ 30 problems (0 errors, 30
  warnings)`, exact baseline match.
- Fresh `npm run dev` instance (port 4014, independent of the implementer's
  port 4011/4012, `rm -rf .nuxt` first): `curl /sitemap.xml` → 9/9 `<loc>`
  values on `resume-nuxt-vert.vercel.app`, 0 on `datvt243.github.io`.
  `curl /rss.xml` → 9 matches on the corrected domain. `curl /contact` →
  the "website" social link now points to `https://resume-nuxt-vert.vercel.app`.
- Repo-wide `grep -rn "datvt243\.github\.io"` (code files only, excluding
  `agent-hub/`, `.git/`, `README.md`'s heading, `Comments.vue`'s
  intentional `GISCUS_REPO` GitHub-repo identifier): 0 remaining matches in
  static code.

## New finding during independent verification (not fixed — out of scope)
The raw SSR homepage HTML still contains 2 literal
`https://datvt243.github.io` occurrences — but they come from **dynamic
resume data**, not this repo's code: `AboutMe.vue`'s `bioLines` renders
`social.value.links`, sourced from `useResumeStore().social` →
`resume.socialMedia`, which is fetched live from the external resume API
(`NODE_API`, per root `CLAUDE.md`'s architecture table). One of the
author's social-link entries in that external database is literally
`https://datvt243.github.io`. This repo has no code path that could change
that value — it would require updating the resume record in the external
Node API backend, which is out of this repo's scope (same category as the
existing "blog content comes from whatever language it was entered in"
scope boundary already documented in the audit). Flagging for the operator,
not treating as a REOPEN reason since it's not something this repo's code
can fix.

The remaining ~8 `datvt243.github.io` substring matches in the raw dev HTML
are dev-mode Vite asset URLs containing the literal local checkout folder
name (`/Users/_david/Workspace/Project/resume/datvt243.github.io/...`) —
confirmed by inspecting the surrounding text; these don't exist in a
production build (Vercel's build directory isn't named after this repo)
and are unrelated to the domain-configuration bug this node fixes.

## Acceptance re-check
| # | Criterion | Independent evidence | Met? |
|---|---|---|---|
| 1 | All hardcoded domain copies point to the confirmed real domain | `curl` re-checks above, 0 remaining code-level matches | ✅ |
| 2 | Single shared constant | `server/utils/siteUrl.ts` + 3 imports, confirmed via diff | ✅ |
| 3 | Build clean | Independently re-run, `✨ Build complete!` | ✅ |
| 4 | Lint clean | Independently re-run, baseline match | ✅ |

## Verdict: SEAL
