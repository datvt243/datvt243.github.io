# 2026-11-07 - sitemap-rss-locale (plan)
- Worker: implementer · Version: 0.1.0
- Node: `sitemap-rss-locale` (`haven/diagrams/dev-loop.prime-mermaid.md`, new row — no existing row for #425/#433; slug not in the archive)
- Task: `/todo #425, #433` — #425 sitemap lists only VI URLs → add `/en/*` with hreflang alternates; #433 RSS channel description is English while `language` is `vi` → Vietnamese description.

## Hub bytes before
94012

## Feature doc
`agent-hub/doctrine/features/seo-feeds.md` (verified). Behavior #3 (sitemap = VI routes only) and #4 (RSS description) are what the operator ruled bugs (OQ1 → #425, OQ3 → #433, 2026-11-07), so the diff updates those two Behavior items + a Changelog row.

## Code anchors
- `server/routes/sitemap.xml.ts` — STATIC_ROUTES + post URLs, VI only
- `server/routes/rss.xml.ts` — channel `<description>` English
- `nuxt.config.ts:94-95` — locale `language` codes `vi-VN`/`en-US` (hreflang values)
- `agent-hub/doctrine/features/seo-feeds.md`

## Acceptance
See the node row (5 criteria).
