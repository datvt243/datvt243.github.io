# 2026-11-05 - resume-hr-view (diff)

- Worker: implementer · Version: 0.1.0
- Node: `resume-hr-view` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #397 "Add HR view for personal info, with Dev/HR switch in the header" (`/todo #397`). Branch `feature/397` off synced `staging`.
- Status: `sealed_pending_verifier`

## Hub bytes before
80626 (from the plan note)

## Diff
| File | Why |
|---|---|
| `composables/useResumeView.ts` (new) | `useState<'dev' \| 'hr'>('resumeView', () => 'dev')` shared by header + page; no cookie so SSR/ISR always renders Dev |
| `themes/portfolio-dev/layout/Header.vue` | `dev / hr` text button (active one in `text-theme-accent`) between the locale and light/dark buttons; `aria-label`/`title` = `header.switchToHr`/`switchToDev`; off `/` the click also `navigateTo(localePath('/'))` |
| `themes/portfolio-dev/pages/resumeObject/Index.vue` | `<ThemeResumeObjectHr v-if="resumeView === 'hr'">`, the existing editor panel moved under `v-else` (unchanged inside) |
| `themes/portfolio-dev/pages/resumeObject/Hr.vue` (new) | Plain resume: Experience (title, dates, company, bullets, stack), Skills (group → names as `dl`, then personal skills), Education (school, dates, major; description hidden when equal to major), Languages. `font-sans`, theme tokens only. Reads the same `useResumeStore` getters as the dev tabs, no fetch |
| `i18n/locales/en.json`, `vi.json` | `header.switchToHr`/`switchToDev`, `resume.hr.{experience,skills,education,languages,other}` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended (IN_PROGRESS) |

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (repo root, from `doctrine/MEMORY.md`), final run after the last edit.

## Output
```
lint=0
typecheck=0
 Test Files  8 passed (8)
      Tests  20 passed (20)
build=0
◆ ✨ Build complete in 13.8s!
```

## UI check (prod build, mock backend)
Prod build + `node .output/server/index.mjs` on :3497 with `NODE_API` and `NUXT_PUBLIC_NODE_API` = local mock (:4599, serving the live `/api/me` JSON saved earlier this session). `grep -c onrender server.log` → `0`. Playwright tab selected, `visibilityState: "visible"`.
- `curl /en` (SSR HTML) contains `experiences.pug` → server renders Dev.
- `/en?tab=skills`, 1280×800, dark: skills tablist `"skills.ts skill-group.ts"` shown (deep link OK); switch `aria-label "Switch to HR view (plain resume)"`, text `dev/hr`; `/api/resume` resource entries: 0.
- Click switch → h2s `["Experience","Skills","Education","Languages"]`, `.editor-scope` gone, label now `"Switch to developer view"`; `/api/` resources after toggle: only `/api/visit` (no `/api/resume`); scrollWidth 1265 (no overflow). Screenshot `.playwright-mcp/hr-dark-1280.png`.
- Light mode (`html.light`) at 375×812: 4 `h2.hr-heading`, scrollWidth 360 = clientWidth 360, switch visible in the mobile header. Screenshots `.playwright-mcp/hr-light-375.png`, `.playwright-mcp/header-375.png`.
- Switch back to Dev: `.editor-scope` present, `?tab=skills` kept, skills tablist shown.
- vi, from `/projects`: click `aria-label "Chuyển sang chế độ HR (CV thông thường)"` → URL `/`, h2s `["Kinh nghiệm làm việc","Kỹ năng","Học vấn","Ngoại ngữ"]`.
- The education description-vs-major edit came after the screenshots; covered by the final build/lint/typecheck run above, not re-screenshotted.

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) Switch next to light/dark, vi + en label | `aria-label` en "Switch to HR view (plain resume)" / vi "Chuyển sang chế độ HR (CV thông thường)"; header screenshot 375 shows `DEV/HR` beside the moon icon |
| (2) Default Dev, UI + `?tab=` unchanged | SSR HTML has `experiences.pug`; `?tab=skills` opens skills tablist; panel markup unchanged inside `v-else` |
| (3) HR sections, desktop + mobile | 4 h2s at 1280 and 375; no horizontal overflow at 375 |
| (4) No refetch, ISR safe | 0 `/api/resume` requests across toggles; state is `useState` default `dev`, no cookie/query |
| (5) Light + dark | dark 1280 + light 375 screenshots |
| build+lint+typecheck+test | Output block above |
| Comments per code-comments.md | `useResumeView.ts` `/** @file */` WHY (ISR reason); Header `//` one-line WHY (HR view only on `/`); `Hr.vue` `/** @file */` overview + `/** */` on `careerBreakTitle`; no issue refs |

## Supersedes
none

## Still open
none

## Noticed, not done
- `careerBreakTitle` is duplicated from `Experiences.vue` (5 lines); not extracted to keep the diff small.
- View choice isn't persisted across reloads (not asked; would need localStorage + a client-only swap).
- Education data has `description` == `major` text; that's backend data.

## Seal gate
none (no commit/push in this pass)
