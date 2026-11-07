# 2026-11-07 - sitemap-rss-locale (SEAL)
- Worker: verifier · Version: 0.1.0
- Node: `sitemap-rss-locale` (#425 + #433, branch `bug/425`)
- New PM status: SEALED (archived to `haven/diagrams/dev-loop-archive.md`; oldest pointer row `pdf-project-sort` trimmed, full row already in the archive)

## Isolation proof
Fresh Agent-tool subagent spawned with the task string "You are the agent-hub VERIFIER ... Do exactly `/worker verifier` for node `sitemap-rss-locale`" — a verifier-only brief, not the implementer's `/todo #425, #433` task. This context has no implementer reasoning; it read only the plan/diff notes, the node row and the feature doc.

## Reasoning
- Command (step 4): note runs `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test` from repo root — matches `doctrine/MEMORY.md` (Typecheck row standalone, run). No baseline row.
- Output (step 5): build/lint/tc/test lines are verbatim exit lines (`Build complete in 14.9s!`, `lint exit 0`, `tc exit 0`, `Tests  27 passed (27)`). The runtime section elides XML (`…same two alternates…`, `…` in the locs list) — the aggregate checks cover it, but the node is outward-facing (crawler-read), so I re-ran the runtime check myself (see Re-run).
- (1) sitemap: my re-run against the diff's `.output` (built 16:25:18, after `sitemap.xml.ts` 16:24:56 / `rss.xml.ts` 16:24:43), mock backend: `HTTP 200`, `sitemap-xml-ok` (xmllint), `urls=18` (= 2 × the note's pre-diff 9), `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`, `en-count=9 vi-count=9`, `vi-without-en:` empty (`/` paired with `/en`), `bad-url-blocks=0` (xpath: `<url>` without exactly one `vi-VN` and one `en-US` `xhtml:link`). hreflang codes match `nuxt.config.ts` i18n per the note's anchor.
- (2) RSS: re-run `HTTP 200`, `rss-xml-ok`, `<description>Bài viết, hướng dẫn, đoạn code hay ho, và vài thứ lăng nhăng khác.</description>`, `<language>vi</language>`; identical to `i18n/locales/vi.json:70` `"intro"`.
- (3) Blog API down: note's `sitemap.xml blocked: 200 urls=10 items=0` / `rss.xml blocked: 200 urls=0 items=0` — not elided, accepted (not re-run).
- (4) Feature doc (step 6b): `## Feature doc` cites `doctrine/features/seo-feeds.md`; doc's Behavior #3/#4 now state the vi + `/en` + `xhtml:link` alternates and the Vietnamese description; Changelog row `2026-11-07 … sitemap-rss-locale` present; `## Feature doc changed` cites operator answers recorded in the doc's Open questions (OQ1 "Bug — #425", OQ3 "Bug: Vietnamese description — #433"). Doc's own acceptance (robots, `<url>` ≥ 5, `<rss version="2.0">`, blocked RSS 200) still holds: 18 urls, `<rss version="2.0">` in re-run, blocked 200 in note. Fix SEAL → doc Status left as is.
- (5) build + lint + typecheck + test: cited above.
- Comments per code-comments.md: row present, cites 2 JSDoc one-liners (why) + `@file` overview, no issue refs — no rule violation cited.
- Supersedes/Still open: both `none`; active diagram had only this row for #425/#433.
- Forbidden states (step 7): ADHOC_WORK no (node row exists); NO_EVIDENCE no (plan + diff notes); EDIT_UNVERIFIED no (verbatim output + my re-run); CODE_IN_HAVEN no (diff touches `server/routes/` + a doctrine doc); DIAGRAM_DRIFT no (PM status updated here).
- Seal gate (step 8): no commit/push in the pass — `none` correct.
- Proportionality (step 9): 2 route files + the feature doc; matches the node scope. `x-default` deliberately not added (noted, not asked for).
- Doctrine proposal (step 6c): none in the note.

## Re-run
partial — runtime check only (`curl` `/sitemap.xml` + `/rss.xml` on `node .output/server/index.mjs` PORT=4188 with `NODE_API`/`NUXT_PUBLIC_NODE_API` = mock :4199, + xmllint/xpath). Reason: outward-facing node (public sitemap/RSS read by crawlers) and the note elided parts of the XML. `grep -c onrender` server log → `0`. Build/lint/typecheck/test not re-run. Servers stopped.
