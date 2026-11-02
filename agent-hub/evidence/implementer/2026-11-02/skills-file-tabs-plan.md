# 2026-11-02 - skills-file-tabs (plan)
- Worker: implementer · Version: 0.1.0
- Node: `skills-file-tabs` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task (#368, verbatim): "phần skill.ts, SkillGroup đang nằm đầu và thấy ko phải thông tin quan trọng, hãy design lại theo kiểu Tab, skill.ts và skill-group.ts, mặc định tab skills.ts và import skill-group vào"

## Hub bytes before: 79741

## Anchors
- `utils/tsCodeLines.ts` `buildSkillsTsLines` — emits `enum SkillGroup` then `const skills`; only caller `Skills.vue`. Split: `buildSkillGroupTsLines` (enum, `export`) + `buildSkillsTsLines` (import line + const).
- `themes/portfolio-dev/pages/resumeObject/Index.vue` — `#filetab` slot of `ThemePanel` shows the single active label; becomes 2 tabs when `active === 'skills'`, sub-file state passed to `<ThemeResumeObjectSkills :file>`.
- `themes/portfolio-dev/pages/resumeObject/Skills.vue` — picks lines by `file`.

## Acceptance criteria clarified: none (written measurable on node creation)
