# 2026-11-05 - resume-hr-icons-exp (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `resume-hr-icons-exp` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: operator follow-up on #397, verbatim: "exp, thêm icon. icon cho đang làm company và Career break". Read as: skills table shows years (`exp`) + skill logos; current job and career-break entries get an icon. Branch `feature/397` (uncommitted).
- Status: `sealed_pending_verifier`

## Hub bytes before
80596 (measured before the node row was appended)

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Hr.vue` | `skillGroups` now maps each skill to `{ name, exp: yearsOfExperience, icon: skillIcon(name) }` (same shape `Skills.vue` builds). Table cell: `<ul>` flex-wrap of `<li>` = optional `<NuxtImg svg/<icon>.svg 16×16 alt="">` (same as `Hero.vue`) + name + `t('resume.hr.years', { n })` in muted `text-xs whitespace-nowrap` when `exp` > 0. Experience `h3.hr-title` → `flex items-start gap-2` with `<UIcon heroicons:pause-circle>` (muted) for career breaks, `<UIcon heroicons:briefcase>` (accent) for `isCurrent`, both `aria-hidden="true"`, title text in a `<span>`. New `.hr-title-icon` CSS (20px, `margin-top` so a wrapped title keeps the icon on line 1). |
| `i18n/locales/en.json`, `vi.json` | `resume.hr.years`: `"{n}+ yrs"` / `"{n}+ năm"` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Command / Output (final run, after the last edit)
```
lint=0
typecheck=0
 Test Files  8 passed (8)
      Tests  20 passed (20)
build=0  ◆ ✨ Build complete in 14.5s!
server7.log: grep -c onrender → 0   (NODE_API + NUXT_PUBLIC_NODE_API = mock :4599 at build and run)
```

## UI check (final build, Playwright tab selected, every reading `visibilityState: "visible"`)
- en, dark, 375: `skillItems: 40, withExp: 40, wrappedExp: 0, withIcon: 10, brokenImgs: 0`; experience h3s with `.i-heroicons:briefcase[aria-hidden=true]`: 1 (Laidon, "12/2024 - present"), with `pause-circle[aria-hidden=true]`: 2 (both career breaks); scrollWidth 360 = clientWidth 360. `.playwright-mcp/icons-final-dark-375.png`.
- en, light, 375: `wrappedExp: 0`, scrollWidth 360 = clientWidth 360. `.playwright-mcp/icons-final-light-375.png`.
- en, light, 1280: scrollWidth 1265 = clientWidth 1265. `.playwright-mcp/icons-final-light-1280.png`.
- en, dark, 1280: scrollWidth 1265 = clientWidth 1265. `.playwright-mcp/icons-final-dark-1280.png`.
- vi (`/`, `lang="vi-VN"`): first skill `"JavaScript (ES6+)4+ năm"`, 40 spans match `+ năm`.
- Pre-fix build (same file minus `whitespace-nowrap`): at 375 "4+ yrs" broke onto two lines — fixed by `whitespace-nowrap`; `wrappedExp: 0` above is after the fix.

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) Years per skill, localized | 40/40 skills show exp; en `+ yrs`, vi `+ năm` |
| (2) Logos only where `skillIcon` has one | 10 of 40 with `<img>`, 0 broken (`naturalWidth` > 0); e.g. `/_ipx/s_16x16/svg/js.svg`; `HTML5/SCSS` has none |
| (3) Current job + career break icons, decorative | 1 briefcase (isCurrent), 2 pause-circle, all `aria-hidden="true"` |
| (4) Dark + light, 1280 + 375, no overflow | four readings above, scrollWidth = clientWidth |
| build+lint+typecheck+test | Output above |
| Comments per code-comments.md | one CSS `/* */` one-line WHY on `.hr-title-icon` (keeps the icon on the first line of a wrapped title); no issue refs |

## Supersedes
none

## Still open
none

## Noticed, not done
- `skillIcon('HTML5/SCSS')` → no icon: key `html5scss` isn't in `SKILL_ICONS` (shared helper, Dev view behaves the same); not changed here.
- Past jobs have no icon, so their titles sit 28px left of the current job's; asked only for current + career break.

## Seal gate
none (no commit/push in this pass)
