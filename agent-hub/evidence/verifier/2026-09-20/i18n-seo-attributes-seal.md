# i18n-seo-attributes — verifier seal

## Verdict: SEAL

## What was checked
- Re-read `app.vue`'s final diff directly off disk — matches the
  implementer note's diff exactly (single-file change, `addSeoAttributes:
  true` + `link`/`meta` spread into `useHead`).
- Independently confirmed `I18nHeadMetaInfo`'s real shape from
  `node_modules/@nuxtjs/i18n/dist/module.d.ts:328-332`:
  `{ htmlAttrs, meta, link }` — both `meta` and `link` genuinely need
  spreading, not just `link`, since `addSeoAttributes` populates both.
- **Cold-cache rebuild** (`rm -rf .nuxt .output` first, not reusing the
  implementer's build): `npm run build` exit 0, `✨ Build complete!`, only
  the pre-existing unrelated darwin-arm64 `sharp` warning — the
  "I18n baseUrl is required" warning the old code comment named as the
  original reason for omitting `addSeoAttributes` did **not** reappear.
- `npm run lint`: `13 problems (0 errors, 13 warnings)` — exact match to
  the current baseline, unchanged.
- Started a **second, independent preview instance on a different port**
  (3999, not the implementer's 3000) against the cold-cache build, and
  re-curled the raw HTML fresh (not re-reading the implementer's captured
  output):
  - `curl http://localhost:3999/` → canonical
    `https://resume-nuxt-vert.vercel.app`, 5 alternate tags (x-default,
    vi, vi-VN, en, en-US) — exact match to the implementer's cited values.
  - `curl http://localhost:3999/en` → canonical
    `https://resume-nuxt-vert.vercel.app/en`, same 5 alternates — exact
    match. Canonical correctly differs per-locale.
  - Sanity count: 26 `<meta`/`<link` tags total in `/`'s `<head>` — no
    sign of a duplicate/broken head from the new spread.
- Scope check: `git diff --stat` for this node is exactly `app.vue` — no
  other file touched, no diagram row conflict (appended cleanly).

## Caveat (disclosed, not silently omitted)
This verifier pass ran in the same agent session/context as the
implementer pass, not a fully separate independent process. It re-derived
the key claims itself rather than trusting the implementer's report at
face value (fresh cold-cache build from scratch, a second preview instance
on a different port, direct type-shape confirmation from the installed
package rather than assuming the shape) — but this is not the doctrine's
default fully-independent verifier flow. Same caveat pattern already
recorded on this session's 2026-09-20 P1/P2/P3 seal notes.

## Issue
Not tied to a GitHub issue number — surfaced as a follow-up finding during
`seo-canonical-domain-fix`'s (2026-09-19) own verification, not from the
original 21-item review roadmap.
