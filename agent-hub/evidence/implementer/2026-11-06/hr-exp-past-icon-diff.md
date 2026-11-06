# 2026-11-06 - hr-exp-past-icon (diff)

- Worker: implementer · Version: 0.1.0
- Node: `hr-exp-past-icon` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: operator "Experience, 1 vài exp chưa có icon" — clarified via AskUserQuestion → "Title icon (HR view)": past jobs in the HR view have no title icon; give them one (muted briefcase). Follow-up of #390 on branch `feature/390`.
- Status: `sealed_pending_verifier`

## Hub bytes before
81170 (the earlier node `skill-icons-390` was measured at the same session start; the only hub changes since are its own evidence/diagram rows)

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Hr.vue` | +1 line: `<UIcon v-else name="heroicons:briefcase" class="hr-title-icon text-theme-muted" aria-hidden="true" />` after the `isCurrent` branch, so past jobs get the same briefcase as the current one, in the muted color career breaks use |

## Command
```
npm test
npm run lint
npx nuxi typecheck
npm run build
```

## Output
```
      Tests  27 passed (27)
```
`npm run lint` → no findings (last line empty after `> eslint .`).
`typecheck exit=0`.
`◆ ✨ Build complete in 16.2s!` (and again 18.7s for the mock-env build below).

Browser: your `nuxt dev` was already running on :3000, which blocks a second dev server, so the check used a production build. `NODE_API` and `NUXT_PUBLIC_NODE_API` were set to the local mock :4390 for both the build and `node .output/server/index.mjs` on PORT=3390. The server log's `onrender` count was 0, and the mock log shows `GET /api/me/...` 200. In headless Chrome (puppeteer-core) I clicked the header dev/hr switch, then read every `h3.hr-title`:
```
Frontend Developer (SAPUI5 / TypeScript)   briefcase  text-theme-accent   (current)
Nghỉ việc tạm thời …                        pause-circle text-theme-muted
Frontend Developer (Vue.js / TypeScript)   briefcase  text-theme-muted    (past — was none)
Nghỉ việc tạm thời …                        pause-circle text-theme-muted
Earlier Experience — Frontend (HTML/CSS)   briefcase  text-theme-muted    (past — was none)
Cao đẳng Kỹ Thuật Cao Thắng                no icon    (Education section, out of scope, unchanged)
```
Screenshots (experience section, dark + light):
`/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/f930b230-0740-44b0-b100-6264c5097df1/scratchpad/hr-dark.png`
`/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/f930b230-0740-44b0-b100-6264c5097df1/scratchpad/hr-light.png`

## Acceptance
| Criterion | Evidence |
|---|---|
| Every non-career-break experience has a briefcase title icon | 5/5 experience rows have `.hr-title-icon` (list above) |
| Current = accent, past = muted, breaks unchanged | classes in the list above; hr-dark.png / hr-light.png |
| Dark + light | both screenshots: muted briefcase visible, aligned with title like the others |
| build + lint + typecheck + test | Output section |
| Comments per code-comments.md | no comment added |

## Supersedes
none

## Still open
none

## Noticed, not done
- Education entries in the HR view have no title icon either; the request named Experience only.
- Dev (editor) view `Experiences.vue` renders job skills as plain text with no logos; the operator chose the HR title icon instead.

## Seal gate
none (no commit/push)
