# 2026-10-27 - a11y-axe-serious (plan)

- Worker: implementer · Version: 0.1.0
- Node: `a11y-axe-serious` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #288 "bug(a11y): contrast failures, unnamed links, missing h1, small touch targets", branch `bug/288` off `staging` d40caec

## Hub bytes before: 80026

## Plan
Measure first with axe-core 4.10.2 (same version as the issue) on a local prod build against the mock resume API, then fix by cause, smallest first:
- Contrast: adjust the failing `--theme-*` tokens (dark.css, light.css, editor-dracula.css) to ≥ 4.5:1 on the backgrounds they actually sit on; no per-component color overrides.
- Unnamed icon links on `/github` (repo cards): `aria-label` from i18n.
- Missing `h1` on `/github`, `/contact`, `/projects`: `sr-only` h1 from the existing `seoTitle` keys (their visible titles are file-tree labels).
- Anything else serious/critical the sweep finds (fix in place, record here in the diff note).
- Touch targets: run axe's `target-size` (WCAG 2.2, off by default) too.

## Acceptance criteria
1. axe: 0 `serious`/`critical` on `/`, `/projects`, `/github`, `/blogs`, `/contact` in light and dark (issue). Extended here: also `/?tab=about-me` and a blog post, both locales, 1280 and 390, `target-size` enabled.
2. No visual regression beyond the intended color shifts (screenshots light/dark).
3. build/lint/typecheck/`npm test` clean.
