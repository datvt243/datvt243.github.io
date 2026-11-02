# 2026-11-02 - experience-pug-piped (diff)
- Worker: implementer · Version: 0.1.0
- Node: `experience-pug-piped` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task (#371, verbatim): "phần experience, position và skills, hãy chỉnh UI xuống dòng với \"|\" của pug"
- Status: sealed_pending_verifier
- Plan: `evidence/implementer/2026-11-02/experience-pug-piped-plan.md`

## Hub bytes before: 79735

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Experiences.vue` | `h2` (position + career-break variant) and `p.skills`: no longer a single `.code-line`; each holds 2 `.code-line` spans — an `aria-hidden` tag line (`depth-1`, `h2.position`/`h2.career-break`/`p.skills`) and a `.piped` line (`|` glyph as `aria-hidden` `.tag-label.pipe` + `.tag-text`). CSS: `.piped .line-content` 4ch indent (0 on mobile), `.pipe` colored `--theme-code-punct`. `.piped` deliberately not `depth-2`, so the mobile `- ` marker (`.depth-2 .tag-text::before`) doesn't apply. Only file changed. |

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (repo root, verbatim from `doctrine/MEMORY.md`)

## Output
- build: exit 0 — `◆ ✨ Build complete in 14.3s!`
- lint: exit 0 — `> eslint .`, no findings
- typecheck: exit 0 — no error lines
- test: exit 0 — `Test Files  8 passed (8)` / `Tests  18 passed (18)` (no test touches this SFC)
- Real UI: operator's running dev server `http://localhost:3000/` (HMR from working tree on `feature/371`; its stale `/api/resume` cache was cleared earlier this session), tab selected, visibilityState `visible`. First `article.experience` `.code-line` rows (text · aria-hidden · padding-left):
  - `article.experience` · true · 0px
  - `h2.position` · true · 17.2308px
  - `| Frontend Developer (SAPUI5 / TypeScript)` · false · 34.4615px
  - `p.company Laidon Group` · false · 17.2308px
  - `time.period 12/2024 - present` · false · 17.2308px
  - `ul.description` · true · 17.2308px / 6× `li …` · false · 34.4615px
  - `p.skills` · true · 17.2308px
  - `| SAPUI5, TypeScript, JavaScript, XML Views, OData, JSONModel, Jest, G…` · false · 34.4615px
  - every row `::before` content `counter(line)` (own line number)
  - a11y text (aria-hidden removed): h2 `Frontend Developer (SAPUI5 / TypeScript)`; skills `SAPUI5, TypeScript, JavaScript, XML Views, OData, JSONModel, Jest, Git, Jira`
  - Screenshot `.playwright-mcp/experience-piped.png`: lines 18–19 `h2.career-break` / `| Nghỉ việc tạm thời — Phát triển chuyên môn`; line 14 wrapped skills continue aligned after the `|`.
- 375×800: `innerWidth 375`, `scrollWidth 360`; both `.piped` lines `pipeShown: false`, padding `0px`, `::before` marker `none`; tag lines `h2.position:hidden`, `p.skills:hidden`. (Mobile element screenshot timed out twice in Playwright — "waiting for element to be stable"; no mobile screenshot, measurements above only.)

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) tag line + piped `|` line for h2 (both variants) and p.skills; others unchanged | rows above; screenshot lines 2–3, 13–14, 18–19; `p.company`/`time.period`/`li` rows keep tag+text on one line |
| (2) a11y | tag lines + pipe `aria-hidden: true`; a11y texts above |
| (3) mobile | `pipeShown: false`, pad `0px`, marker `none`, tag lines hidden |
| (4) real browser desktop + 375px, no h-scroll | `scrollWidth 360` ≤ 375 |
| (5) build+lint+typecheck+test | Output above |
| comments per code-comments.md | 1 new HTML comment explains the why (Pug piped text layout); skills comment updated to mention "piped"; no issue refs |

## Supersedes: none
## Still open: none

## Noticed, not done
- Verified on the operator's dev server, not a production build (`.output`) — build itself is clean above.

## Seal gate: none (no commit/push)
