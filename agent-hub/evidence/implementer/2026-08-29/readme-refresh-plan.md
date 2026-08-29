# 2026-08-29 — readme-refresh (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `readme-refresh` (new)
- Task (verbatim, from `/todo #90`): fix issue #90 — `README.md` is stale:
  missing the 3 `GISCUS_*` env vars (present in `.env.example` but not in
  README), no mention of i18n (`/en/*` routes, shipped via #75/#80), no
  mention of Giscus comments on `/blogs/[id]` (shipped via #74/#81), no
  mention of `/rss.xml`/`/sitemap.xml` (shipped via #73). Update README to
  match the site's real current state.

## Node exists? No — created new node `readme-refresh`, docs-only.

## Anchors
- `README.md` — the only file this task touches.
- Cross-checked against root `CLAUDE.md`'s Environment Variables section
  (already documents `GISCUS_*` correctly) and the diagram's `i18n-
  foundation`/`giscus-comment`/`rss-sitemap-feed` node notes for exact,
  already-verified feature descriptions — not re-describing from memory.

## Blockers
None — docs-only, no env var needed to write markdown.

## Acceptance criteria
1. Environment Variables table includes `GISCUS_CATEGORY`/
   `GISCUS_CATEGORY_ID`/`GISCUS_REPO_ID`, matching `.env.example`.
2. Pages section mentions i18n (`vi` default unprefixed, `/en/*` for
   English) and that `/blogs/[id]` now has Giscus comments.
3. A new section documents `/rss.xml` and `/sitemap.xml`.
4. `npm run build` + `npm run lint` still clean (sanity — a markdown-only
   change shouldn't be able to break either, but `TestsBeforeDone` applies
   regardless of file type).
5. No CDP needed — no runtime/visual behavior changed by this diff.
