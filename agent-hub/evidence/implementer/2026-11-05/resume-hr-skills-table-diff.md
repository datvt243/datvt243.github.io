# 2026-11-05 - resume-hr-skills-table (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `resume-hr-skills-table` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: operator follow-up on #397, verbatim: "phần skill, chỉnh UI dạng table cho dễ nhìn". Branch `feature/397` (uncommitted).
- Status: `sealed_pending_verifier`

## Hub bytes before
81374 (measured before the node row was appended)

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Hr.vue` | Skills `<dl>` grid → `<table class="w-full border-collapse text-sm"><tbody>`, one `<tr>` per group (`border-b border-theme-border-subtle last:border-b-0 even:bg-theme-panel-subtle/50`), group in `<th scope="row">` (`w-1/3 sm:w-56`, top-aligned, bold), skills joined by `, ` in `<td>`. Personal-skills list below unchanged. Theme tokens only. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Command / Output
Same final run as `resume-hr-emphasis` pass 2 (one build covers both):
```
lint=0
typecheck=0
 Test Files  8 passed (8)
      Tests  20 passed (20)
build=0  ◆ ✨ Build complete in 14.6s!
server5.log: grep -c onrender → 0
```

## UI check (prod build, mock backend, `visibilityState: "visible"`)
- light 1280: table `rows: 9, th[scope=row]: 9, td: 9`, row border `1px`; first headers `Languages`, `Vue ecosystem`, `SAP`; scrollWidth 1265 = clientWidth. `.playwright-mcp/final-light-1280.png` (striped rows, group column left).
- light 375: table width 294px, scrollWidth 360 = clientWidth 360; text wraps inside cells. `.playwright-mcp/final-light-375.png`.
- dark 1280 / 375: scrollWidth = clientWidth (1265 / 360); stripes + borders visible. `.playwright-mcp/final-dark-1280.png`, `.playwright-mcp/final-dark-375.png`.

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) `<table>`, one row per group, `th scope="row"` + `td`, row borders | 9 rows / 9 `th[scope=row]` / 9 `td`, border-bottom 1px |
| (2) 375 + 1280, no overflow | scrollWidth = clientWidth at both widths, both modes |
| (3) Dark + light | four screenshots above |
| build+lint+typecheck+test | Output above |
| Comments per code-comments.md | no comments touched |

## Supersedes
none

## Still open
none

## Noticed, not done
- Skills carry `exp` (years) in the data; not shown as a column (not asked).

## Seal gate
none (no commit/push in this pass)
