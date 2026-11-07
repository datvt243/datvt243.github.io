# 2026-11-07 - i18n-locale-cleanup (SEAL)
- Worker: verifier · Version: 0.1.0
- Node: `i18n-locale-cleanup` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- New PM status: SEALED (row archived to `haven/diagrams/dev-loop-archive.md`; oldest pointer row `pdf-filename-lang` dropped to keep 20)
- Note judged: `evidence/implementer/2026-11-07/i18n-locale-cleanup-diff.md` (+ `-plan.md`)

## Isolation proof
Fresh Agent-tool subagent spawned by the `/todo` orchestrator with the task string "You are the agent-hub VERIFIER ... You are a fresh, isolated subagent: you did NOT write this diff. Do exactly `/worker verifier` for node `i18n-locale-cleanup`" — differs from the implementer's task (`/todo #424 + #417, #418, #426, gom lại fix chung nếu có thể`). This context holds no implement-pass reasoning; diff not opened.

## Reasoning
| Criterion | Cited evidence (implementer note) |
|---|---|
| (1) `/en` internal links keep locale; `/` unprefixed (Behavior #1, OQ1) | [1a] `href="/en/contact"`, [1b] `href="/contact"`, [1c] `href="/en/blogs?category=vue"`, [1d] `href="/blogs?category=vue"`, [1e] `href="/en/blogs"`, [1f] `href="/blogs"`; browser clicks `afterContactClick":"http://localhost:4188/en/contact"`, `afterCategoryClick":"http://localhost:4188/en/blogs?category=vue"` |
| (2) error page lang (Behavior #6, error-page OQ4) | [2] `<html  lang="en-US"` for `/en/does-not-exist`, `<html  lang="vi-VN"` for `/does-not-exist` |
| (3) no hard-coded strings; keys in vi + en (Behavior #4, OQ3) | grep → no output, exit 1; re-checked key presence (below) — all 6 keys present in both locales; runtime: "Clear filters"/"Xóa bộ lọc", aria-label "View posts tagged Vue"/"Xem bài viết gắn thẻ Vue" |
| (4) build + lint + typecheck + test | `Build complete in 14.8s!` exit 0; `eslint .` exit 0; typecheck exit 0 (standalone, per MEMORY.md row); `Tests  27 passed (27)` |
| comments per code-comments.md | 1 `//` why-comment in `error.vue`, no issue refs — compliant |
| Feature doc line | present, cites both docs; not edited (no `Feature doc changed`) — fix SEAL leaves doc status as is |
| Supersedes / Still open | `none` / `none` (grep for the 4 issues on active diagram → only this row) |

- Commands match `doctrine/MEMORY.md`; Node 24 noted for lint. No `...`/truncation in outputs.
- Runtime used the mock backend; `grep -c onrender srv.log` → `0`.
- Forbidden states: none hit. Seal gate: no outward action (no commit/push). Proportionality: diff table matches the 4 issues exactly; JSON changes are key additions.
- No `## Doctrine proposal`.

## Re-run
partial — `jq` key-presence check on `i18n/locales/{vi,en}.json` for the 6 new keys, because the note cited them only as "e.g." (vi `list.*` not quoted) and the strings are user-facing:
```
vi blogs.viewCategory = Xem bài viết gắn thẻ {name}
vi contact.mailSubject = Liên hệ từ portfolio: {name}
vi contact.mailSomeone = một người bạn
vi a11y.clearFilters = Xóa bộ lọc
vi list.loading = đang tải ...
vi list.noData = Không có dữ liệu
en blogs.viewCategory = View posts tagged {name}
en contact.mailSubject = Portfolio contact from {name}
en contact.mailSomeone = someone
en a11y.clearFilters = Clear filters
en list.loading = loading ...
en list.noData = No data
```
Build/lint/typecheck/test and the server runtime check were not re-run (note verbatim, audit-only default).
