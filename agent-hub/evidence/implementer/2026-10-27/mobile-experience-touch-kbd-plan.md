# 2026-10-27 - mobile-experience-touch-kbd (plan)

- Worker: implementer · Version: 0.1.0
- Node: `mobile-experience-touch-kbd` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #298 "feat(mobile): improve Experience readability on small screens and hide keyboard hints on touch", branch `feature/298` off `staging`

## Hub bytes before: 80026

## Plan
- `themes/portfolio-dev/components/Kbd.vue`: hide the badge under `(hover: none)` only when it carries `aria-hidden` — every inline hint (Header nav `gX`, Hero `c`/`d`, tabs `1`–`5`, GitHub `/`) passes `aria-hidden="true"`; the KeyNav help overlay's badges and the header `?` button don't, so they stay. One Tailwind arbitrary variant, no new prop.
- `themes/portfolio-dev/pages/resumeObject/Experiences.vue`: a scoped `@media (width < 48rem)` block (Tailwind `md` = 48rem) hiding the line-number gutter, the decorative `h2.position`/`li` tag labels and the decorative aria-hidden lines (`article.experience`, `ul.skills`, blank spacer), dropping the depth indents; list items keep a muted `- ` marker with a hanging indent so they don't run together; the `// next experience` comment stays as the job separator with a top margin. Desktop untouched.

## Acceptance criteria
1. At 390px (touch emulation), Experience text starts ≥ 85% of the panel width from its right edge (issue: "chữ chiếm ≥ 85% bề rộng panel").
2. Inline Kbd hints hidden on `(hover: none)`; still shown on desktop; KeyNav overlay badges unaffected.
3. Desktop (1280) Experience unchanged: gutter shown, same text offset as staging.
4. No horizontal scroll at 390; screen readers still get the same semantic HTML (only `display` on aria-hidden/decorative parts changes).
5. build/lint/typecheck/`npm test` clean.
