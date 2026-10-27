# 2026-10-27 - experience-skills-text (diff)

- Worker: implementer · Version: 0.1.0
- Node: `experience-skills-text` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #336 follow-up after `experience-skills-inline` SEALED. Operator: "đổi design lại thành p.skills, rồi list ra theo string, cách nhau bằng ', '"
- Status: `sealed_pending_verifier`

## Hub bytes before
80096

## Acceptance criteria
1. Skills line label is `p.skills` (element is a real `<p>`), no badges, no `ul`/`li`.
2. Text is `el.skills.join(', ')`.
3. Still one code line per job (wraps under the text on long lists).
4. `utils/themeBadgeUi.ts` back to its staging content (badges no longer used here).
5. build + lint + typecheck + `npm test` clean.

## Diff (vs staging)
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Experiences.vue` | Skills block → `<p class="code-line depth-1">` with `pugTag('p','skills')` label + `{{ el.skills.join(', ') }}`; same markup shape as the `p.company` line; `accentBadgeUi` import removed |
| `utils/themeBadgeUi.ts` | Reverted (`git checkout`) — `git diff --stat` shows only Experiences.vue |

## Output
```
◆ ✨ Build complete in 15.0s!
lint=0
typecheck=0
      Tests  10 passed (10)
```
(build/server env: NODE_API=NUXT_PUBLIC_NODE_API=http://localhost:4199 mock; prod server log `grep -c onrender` → 0)

## Browser verification
Operator asked to test on their own dev server http://localhost:3000/ (real data, HMR). Playwright at 1280px, skills `p.code-line` text per article:
```
"p.skillsSAPUI5, TypeScript, JavaScript, XML Views, OData, JSONModel, Jest, Git, Jira"
"p.skillsVue.js 2 & 3, TypeScript, Pinia, Axios, GitLab"
"p.skillsHTML5, Pug, SCSS, Grunt"
```
Screenshot `.playwright-mcp/exp-skills-text-3000.png`: line 5 `p.skills SAPUI5, TypeScript, …, JSONModel,` wraps `Jest, Git, Jira` aligned under the text, single line number. Career-break job has no skills line (v-if).

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 | textContent starts `p.skills`; template `<p v-if="el.skills?.length" class="code-line depth-1">` |
| 2 | `", "`-separated strings above |
| 3 | one line number (5) in screenshot |
| 4 | `git diff --stat` → only Experiences.vue |
| 5 | Output block |
| comments per code-comments.md | one-line WHY template comment kept, wording updated |

## Supersedes: none (`experience-skills-inline` already SEALED; this is its operator-requested follow-up)

## Noticed, not done
- Vietnamese descriptions in the screenshot show detached diacritics (e.g. "dư liệu") — font rendering, untouched by this diff; possibly the self-hosted Fira Code subset from #332. Worth its own issue.

## Seal gate
none (no commit/push)
