# 2026-10-27 - light-hover-footer-targets (plan)

- Worker: implementer · Version: 0.1.0
- Node: `light-hover-footer-targets` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #327 (operator chose: "Sửa cả hai" for light hover + muted/faint, "Phóng vùng chạm ≥ 24px" for the footer), branch `bug/327` off `staging` f733577

## Hub bytes before: 80042

## Plan
- Links whose only hover feedback is `hover:text-theme-accent-soft` (`GitUser.vue` name link, `post/Item.vue` read-more link — the only two, grep `hover:text-theme-accent-soft`): add `hover:underline`. The contact submit button's `hover:bg-theme-accent-soft` is a button, not a link; out of scope.
- `light.css` `--theme-muted` slate-500 → slate-600 so it's a step above `--theme-faint` (slate-500 since #288).
- `Footer.vue`: social links become `inline-flex size-6` (24×24 around the 16px icon), `@datvt243` link gets `py-1` (24px tall); row padding `py-2.5` → `py-2` and `gap-3` → `gap-1` + margins so the bar keeps its height and spacing.

## Acceptance criteria
1. Light mode: GitUser/post links underline on hover; muted ≠ faint.
2. Footer links ≥ 24×24 at 390; footer height unchanged.
3. axe 0 serious/critical (7 pages × light/dark × 1280/390 × vi/en, target-size on).
4. build/lint/typecheck/`npm test` clean.
