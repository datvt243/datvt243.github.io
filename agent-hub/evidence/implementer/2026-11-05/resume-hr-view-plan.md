# 2026-11-05 - resume-hr-view (plan)

- Worker: implementer · Version: 0.1.0
- Node: `resume-hr-view` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #397 "Add HR view for personal info, with Dev/HR switch in the header", via `/todo #397`. Branch `feature/397` off `staging` (synced, `gh issue develop`).

## Hub bytes before
80626 (measured before the node row was appended)

## Acceptance criteria clarified
"Switching views doesn't refetch data" → "no new `/api/resume` request on toggle (network log)"; "desktop and mobile" → "375px and 1280px".

## Plan
- `composables/useResumeView.ts`: `useState('resumeView', () => 'dev')` — shared by header + page; SSR always renders `dev`, so the ISR HTML is unchanged.
- `ThemeHeader`: a DEV/HR text button next to the light/dark button (same style as the locale button); off `/`, switching also navigates home (the view only exists there).
- `ThemeResumeObject` (`Index.vue`): `v-if` the editor panel on `dev`, else `<ThemeResumeObjectHr />`.
- New `themes/portfolio-dev/pages/resumeObject/Hr.vue`: plain sections from `useResumeStore` (same getters as the dev tabs).
- i18n keys in `en.json` + `vi.json`.
