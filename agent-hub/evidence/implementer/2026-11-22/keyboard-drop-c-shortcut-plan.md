# 2026-11-22 - keyboard-drop-c-shortcut (plan)
- Worker: implementer · Version: 0.1.0
- Node: `keyboard-drop-c-shortcut` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: #438 Keyboard: drop the `c` shortcut, use `gc` for contact

## Hub bytes before: 93880
## Feature doc: doctrine/features/keyboard-navigation.md
Open questions all answered; Q2 answer (operator 2026-11-07) = "keep only `gc`, drop the `c` shortcut — #438". The doc's Behavior #6 still lists `c` → doc gets updated as part of this diff, authorized by that answer.

## Anchors
- `themes/portfolio-dev/pages/resumeObject/Hero.vue:54-60` — `data-shortcut="c"`, `:data-shortcut-label`, `<ThemeKbd>c</ThemeKbd>`
- `themes/portfolio-dev/components/KeyNav.vue:27` — help-dialog "On this page" built from `[data-shortcut]` (no hardcoded `c`)

## Acceptance criteria clarified: none (node written with measurable criteria)
