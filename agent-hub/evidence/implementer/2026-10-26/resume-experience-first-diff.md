# 2026-10-26 - resume-experience-first (diff)

- Worker: implementer · Version: 0.1.0
- Node: `resume-experience-first` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #295, branch `feature/295` off `staging` 6cb5f88
- Status: `sealed_pending_verifier`

## Hub bytes before
77904

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Index.vue` | `experience` moved to `sections[0]` (default tab / clean URL / shortcut 1 all derive from the index); one `//` WHY line. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output
```
npm run build → "◆ ✨ Build complete in 13.4s!", 1 pre-existing WARN (components-BKndnV3n.js (369:0))
npm run lint → rc=0
npx nuxi typecheck → 0 "error TS"
```

## Browser (prod build :4144 → mock :4199 with the captured API data; CDP :9888 incognito; current role in data: "Frontend Developer (SAPUI5 / TypeScript) @ Laidon Group")
```
1440 /   and /en: tabs [1:experiences.pug, 2:about-me.md, 3:skills.ts, 4:educations.json, 5:languages.json]; experience entry "Frontend Developer (SAPUI5 / TypeScript)" displayed, top 641px → in viewport
390  /   and /en: same tab order; experience entry displayed, top 1063px → below the fold (sidebar stacks above the content on mobile)
/en?tab=about-me → About tab, query kept; pressing "1" → Experience, query cleared
```
Screenshots `scratchpad/p1/e295-{1440,390}-{vi,en}.png`. At 390 the hero (in viewport) already shows "> Frontend Developer" and "4+ years experience — most recently at Laidon Group".

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. Current role visible on first load without a click | 1440: experience entry in viewport. 390: the hero line names the role and current company in viewport; the Experience tab is active, its entries start below the fold |
| 2. Deep links + shortcuts | deepAbout / key1 lines |
| 3. checks | above |
| 4. comments per code-comments.md | One `//` one-liner above `sections` in `Index.vue`: states WHY experience is first (recruiter priority; hero already covers about-me), not what the array is; no `(#N)` refs |

## Supersedes
none (REOPEN 1 by verifier: missing comments row — added; no code change)

## Noticed, not done
- At 390 the personal-info sidebar sits between the hero and the content; moving/collapsing it on mobile is #298's scope.
- Tab labels stay file-style (editor aesthetic); not changed.

## Seal gate
none.
