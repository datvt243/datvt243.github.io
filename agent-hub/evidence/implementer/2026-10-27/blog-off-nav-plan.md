# 2026-10-27 - blog-off-nav (plan)

- Worker: implementer · Version: 0.1.0
- Node: `blog-off-nav` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #293 (operator: "Ẩn blog khỏi nav" — remove the tab and shortcut, keep the /blogs route), branch `feature/293` off `staging` ae783ff

## Hub bytes before: 80060

## Plan
`app.config.ts` `menuPrimary`: remove the `_blogs` entry. Header tabs, mobile menu, KeyNav `g`+key and the `?` overlay all derive from that array (grep `menuPrimary`), so nothing else changes. Routes, ISR rules, sitemap and RSS stay (route kept by decision). `.claude/rules/theme.md` lists the global keys → update.

## Acceptance criteria
1. No blog tab in the desktop header or mobile menu; `gb` does nothing; overlay has no `gb`; other shortcuts still work.
2. `/blogs` route still served.
3. build/lint/typecheck/`npm test` clean.
