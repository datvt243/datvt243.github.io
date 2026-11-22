# 2026-11-22 - giscus-one-thread (plan)
- Worker: implementer · Version: 0.1.0
- Node: `giscus-one-thread` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: #432 "Giscus: one discussion thread per post across /blogs and /en/blogs" — Giscus uses `mapping: pathname`, so `/blogs/<id>` and `/en/blogs/<id>` get two separate threads. Expected: one thread per post id for both locales (e.g. `mapping: specific` with `term` = post id).

## Hub bytes before: 93618
## Feature doc: agent-hub/doctrine/features/blog-post.md
Open question 5 answered by operator 2026-11-07: "Change: one thread per post id — #432". No unanswered open question → analyst pass 0 skipped (doc exists, verified).

## Anchors
- `themes/portfolio-dev/pages/post/Comments.vue` (`data-mapping`, no `data-term`)
- `themes/portfolio-dev/pages/post/Detail.vue:80` `<ThemePostComments />` — only caller (`grep -rn "PostComments" themes pages` → Detail.vue:80 only)

## Term choice
`blogs/<_id>` rather than bare `<_id>`: Giscus `pathname` mapping titles a discussion with the pathname minus its leading slash, and the only existing post thread is titled `blogs/67123bdf9c6e9bcf4f7bf006` (`gh api graphql ... discussions` → `Announcements	blogs/67123bdf9c6e9bcf4f7bf006`). Using that exact string as the specific term keeps the existing VI thread attached and makes `/en/...` share it — no discussion migration.
