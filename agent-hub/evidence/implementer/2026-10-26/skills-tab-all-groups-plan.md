# 2026-10-26 - skills-tab-all-groups (plan)

- Worker: implementer · Version: 0.1.0
- Node: `skills-tab-all-groups` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits; no other open row for #281)
- Task: issue #281 "bug: Skills tab hides every grouped skill (Vue.js, JavaScript, TypeScript, Nuxt, Pinia…)", branch `bug/281` off freshly pulled `staging` (`8d41203`), via `/todo "fix P0"`

## Hub bytes before: 78000

## Root cause
`themes/portfolio-dev/pages/resumeObject/Skills.vue` `groupedSkills` iterates only `store.groups` (= `generalInformation.professionalSkillsGroup`, which the API returns as `[]`) and then appends group `'Other'`. Every skill whose `group` is set (`Framework`, `Programming`, `VCS`, `Database`) is never rendered. `store.groups` has no other consumer (grep: only `Skills.vue:58`).

## Acceptance criteria (command-checkable)
1. With the current API data (`professionalSkillsGroup: []`), `/?tab=skills` renders all 17 `professionalSkills` names (checked: rendered tab text vs `/api/resume` names).
2. Group order: `professionalSkillsGroup` entries first (when present), then remaining groups in first-appearance order, `Other` last; no group rendered twice.
3. Other tabs / pages unchanged (SSR visible text of `/` differs only inside the skills block).
4. `npm run build`, `npm run lint`, `npx nuxi typecheck` clean.
5. comments per code-comments.md.

## Files (expected)
`themes/portfolio-dev/pages/resumeObject/Skills.vue` only.

## Blockers
No `.env`; local runs use the real public runtime-config values (`scratchpad/p0/env.sh`, same as `resume-pii-whitelist`). Upstream resume API is rate-limited (100/window) — keep calls minimal.
