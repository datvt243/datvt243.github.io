# 2026-11-05 - resume-hr-icons-exp (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `resume-hr-icons-exp` (#397 follow-up, operator: "exp, thêm icon. icon cho đang làm company và Career break"; branch `feature/397`, uncommitted working tree)
- Note judged: `evidence/implementer/2026-11-05/resume-hr-icons-exp-diff.md`
- Verdict: **SEAL** · New PM status: SEALED (archived)

## Isolation proof
Separate Agent-tool subagent spawned with the task string "You are the VERIFIER worker of the agent-hub ... (`/worker verifier` semantics; fresh context, separate from the implementer). ... Node `resume-hr-icons-exp` ... File times (Hr.vue last edit vs `.output/nitro.json` build vs `.playwright-mcp/icons-final-*.png`) can confirm the evidence comes from the final code." That string differs from the implementer's task string. I started with a blank context and did not write this diff.

## Re-run
none. I audited the note and re-ran no build, lint, test or browser check. Read-only checks: `stat` mtimes show Hr.vue 19:51:27, en/vi.json 19:50:13, `.output/nitro.json` 19:51:50, `icons-final-*.png` 19:52:01–19:52:15. The build and every screenshot postdate the last edit. `grep -c onrender server7.log` → `0` (log mtime 19:51:52). I viewed `icons-final-dark-375.png` (logos and "N+ yrs" with no wrapped years) and `icons-final-light-1280.png` (skills table with logos and years). `grep` of comments in Hr.vue found one new CSS line-comment giving the WHY and no issue refs.

## Reasoning
| Criterion (node row) | Verdict | Cited |
|---|---|---|
| (1) Years per skill when > 0, localized | met | `withExp: 40` of `skillItems: 40`. en "4+ yrs" in the screenshots. vi page (`lang="vi-VN"`): first skill `"JavaScript (ES6+)4+ năm"`, 40 spans match `+ năm`. |
| (2) Logo only where `skillIcon` has one | met | `withIcon: 10, brokenImgs: 0`, e.g. `/_ipx/s_16x16/svg/js.svg`. `HTML5/SCSS` has no logo, which shows in both screenshots. |
| (3) Current job + career break: distinct heroicon, `aria-hidden` | met | DOM reading on the final build: 1 `heroicons:briefcase[aria-hidden=true]` (Laidon, "12/2024 - present") and 2 `pause-circle[aria-hidden=true]` (both career breaks). These are two different icons. The screenshots I viewed show only the skills section, so this rests on the DOM reading. |
| (4) Dark + light, 1280 + 375, no overflow | met | scrollWidth = clientWidth: 360/360 dark and light at 375, 1265/1265 dark and light at 1280. Screenshot for each of the four. `visibilityState: "visible"` on every reading. |
| build + lint + typecheck + test | met | `lint=0`, `typecheck=0`, `Tests  20 passed (20)`, `build=0  ◆ ✨ Build complete in 14.5s!`, run after the last edit (mtimes above). This is the same exit-code format the earlier #397 seals accepted. |
| Comments per code-comments.md | met | One `/* */` WHY comment on `.hr-title-icon`, with no issue refs. |

## Forbidden states
None hit.

## Seal gate
No outward action. OK.

## Proportionality
OK. The diff touches Hr.vue skills and experience titles plus one i18n key per locale, and reuses `skillIcon`, the NuxtImg pattern and UIcon. The note lists the past-job alignment and the missing `html5scss` icon as not done, and both are outside this node's scope.

## Supersedes
none
