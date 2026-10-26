# 2026-10-26 - resume-experience-first (plan)

- Worker: implementer · Version: 0.1.0
- Node: `resume-experience-first` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #295 "feat(ux): show Experience first instead of hiding it behind the third tab", branch `feature/295` off freshly pulled `staging` (`6cb5f88`)

## Hub bytes before: 77904

## Plan
`themes/portfolio-dev/pages/resumeObject/Index.vue`: move the `experience` entry to `sections[0]` (the default tab, the clean-URL tab, and shortcut `1` all derive from that index). Rest keeps its order. No other file references tab keys (grep `tab=`, `about-me` outside Index.vue → 0 hits). Keeping the IDE-style labels (operator kept the editor aesthetic; issue says it may stay).

## Acceptance criteria
1. First load of `/` and `/en` (1440 and 390): the Experience tab is active and the current role is rendered in it without a click (SSR HTML + browser).
2. `?tab=about-me` deep link opens About; `?tab=experience` still works; shortcuts 1–5 follow the new order.
3. build/lint/typecheck clean.
