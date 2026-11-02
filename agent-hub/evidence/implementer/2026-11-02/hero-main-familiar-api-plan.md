# 2026-11-02 - hero-main-familiar-api (plan)
- Worker: implementer · Version: 0.1.0
- Node: `hero-main-familiar-api` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task (operator, verbatim): "thay thế mainSkills và FamiliarSkill ở 2 mục bên dưới dòng 4+ năm kinh nghiệm, không phải ở skills.ts"

## Hub bytes before: 79737

## Context
- `main-familiar-skills` was SEALED (verifier note `evidence/verifier/2026-11-02/main-familiar-skills-seal.md`) for rendering in `skills.ts`; operator then redirected placement → new node (LAI-13), keeps that node's whitelist/type/store/test parts.

## Anchors
- `themes/portfolio-dev/pages/resumeObject/Hero.vue` — hardcoded `techStack` (5) + `familiarStack` (4) under `t('resume.experienceSummary')`.
- `themes/portfolio-dev/pages/resumeObject/Skills.vue` — `SKILL_ICONS`/`skillIcon` → move to `utils/skillIcon.ts` (Hero needs it too); its normalization misses `JavaScript (ES6+)` (→`javascriptes6`) and `Vue.js 2 & 3` (→`vuejs23`), so hero would lose those icons.
- `utils/index.ts` barrel; `tests/` for the new pure function.
