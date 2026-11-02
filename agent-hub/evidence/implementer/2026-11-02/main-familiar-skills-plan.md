# 2026-11-02 - main-familiar-skills (plan)
- Worker: implementer · Version: 0.1.0
- Node: `main-familiar-skills` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: "#366 Hiển thị mainSkills và familiarSkills từ resume API — thêm vào whitelist PUBLIC_GENERAL_FIELDS (server/utils/fetchResume.ts) + types, expose qua useResumeStore, hiển thị trong theme; rỗng/thiếu → không render (familiarSkills chưa deploy trên backend prod, shape [{name}])"

## Hub bytes before: 79735

## Backend state (read 2026-11-02, before any code)
- Live `GET ${NODE_API}/api/me/${MY_EMAIL}` → `generalInformation` keys include `mainSkills`
  (`[{"name": "JavaScript (ES6+)"}, {"name": "TypeScript"}, {"name": "Vue.js 2 & 3"}, {"name": "SAPUI5"}, {"name": "Git"}]`), NO `familiarSkills`.
- datvt243/resume-nodejs-api `src/models/generalInformation.model.ts`: `main` has only `mainSkills`;
  `staging` line 28 `familiarSkills: { type: [personalSkills], default: [] }`. Backend issue #349 (open) tracks it → no new backend issue needed.

## Anchors
- `server/utils/fetchResume.ts` `PUBLIC_GENERAL_FIELDS` — whitelist (else fields are stripped).
- `types/resume-document.ts` `GeneralInformation`.
- `stores/resume.ts` `personalSkills` getter — same `[{name}]` shape, copy its pattern.
- `themes/portfolio-dev/pages/resumeObject/Skills.vue` + `utils/tsCodeLines.ts` `buildPersonalSkillsTsLines` — reuse with a var-name param.
- `tests/fetchResume.test.ts` — whitelist test.

## Acceptance criteria clarified: none (written measurable on node creation)
