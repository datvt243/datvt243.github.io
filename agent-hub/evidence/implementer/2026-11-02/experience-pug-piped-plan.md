# 2026-11-02 - experience-pug-piped (plan)
- Worker: implementer · Version: 0.1.0
- Node: `experience-pug-piped` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task (#371, verbatim): "phần experience, position và skills, hãy chỉnh UI xuống dòng với \"|\" của pug"

## Hub bytes before: 79735

## Anchors
- `themes/portfolio-dev/pages/resumeObject/Experiences.vue` only: `h2.position` (2 variants: position / career-break) and `p.skills` are 1 `.code-line` each with tag + text side by side.
- Mobile block (`@media (width < 48rem)`) hides `.tag-label` and aria-hidden non-comment lines; `.depth-2 .tag-text::before` adds `- ` — the piped line must NOT reuse `depth-2` or it gets that marker.

## Acceptance criteria clarified: none (written measurable on node creation). Interpretation: Pug piped text (`tag` newline `| text`); career-break `h2` included since it's the same heading slot.
