# 2026-10-18 - vim-key-nav-tab-badges (implementer diff)

- Worker: implementer · Version: 0.1.0
- Node: `vim-key-nav-tab-badges` (IN_PROGRESS)
- Issue: #236 (follow-up) · Branch: `feature/236`
- Task (verbatim): "hãy thêm các badge  gr gp bên cạnh các text"
- Status: **sealed_pending_verifier**

## Hub bytes before
152157, measured after the node row was appended (see plan). The scratchpad `ht.sh` had been overwritten by an earlier verifier pass, so I re-extracted the `/hub-tokens` bash block into `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/ht-impl.sh`.

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/layout/Header.vue` | In the two desktop nav `NuxtLink`s (`mainTabs` loop and `contactTab`) only, a line after the label: `<kbd aria-hidden="true" class="ml-2 rounded border border-theme-border px-1 text-[10px] leading-4 text-theme-faint">g{{ <item>.key }}</kbd>`. The mobile slideover loop is untouched |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New row appended at the end (`AppendOnly`) |

## Command
Node v24.19.0, repo root: `npm run build` · `npm run lint` · `npx nuxi typecheck`

## Output
- `build exit 0` and `└  ✨ Build complete!`
- `lint exit 0`: the output is only `> eslint .` and lists no problems
- `tc exit 0` and `grep -c "error TS"` gives `0`

## Browser verification
Production build on `:3457`, clean headless Chrome.

`/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/badges.cjs`, verbatim output:
```
badges-1280-dark {"cls":"dark","tabs":[{"name":"_resume","badge":"gr","ariaHidden":"true","color":"rgb(100, 116, 139)"},{"name":"_projects","badge":"gp",...},{"name":"_github","badge":"gh",...},{"name":"_blogs","badge":"gb",...},{"name":"_contact","badge":"gc",...}],"headerRowHeight":45,"scrollWidth":1280,"innerWidth":1280}
badges-1024-light {"cls":"light","tabs":[...same 5 badges, ariaHidden "true"...,"color":"rgb(148, 163, 184)"],"headerRowHeight":45,"scrollWidth":1024,"innerWidth":1024}
mobile slideover links [{"text":"_resume","kbd":false},{"text":"_projects","kbd":false},{"text":"_github","kbd":false},{"text":"_blogs","kbd":false},{"text":"_contact","kbd":false}]
```
- The colors match `--theme-faint`: dark is `100 116 139` and light is `148 163 184`.
- At 1024px the first screenshot was missing the color-mode icon. `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/fit.cjs` measured the header row: at 1024, 1100 and 1280 px, `rowScroll == rowClient == 960` (no overflow), and the toggle's right edge sits at 992, 1030 and 1120. Both numbers are identical with the badges hidden, so the badges don't affect the fit. A re-shot with a 4s wait (`badges2.cjs`) shows the moon icon, so the missing icon was a lazy-load timing issue.
- Screenshots: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/badges-1280-dark.png` and `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/badges-1024-light.png` (re-shot). In both, every tab shows a small muted badge, and `_contact`, `?`, locale and color-mode are all visible.

## Acceptance
| Criterion | Evidence |
|---|---|
| Badge next to each desktop tab label, from `menuPrimary[].key` | 5/5 tabs `gr gp gh gb gc`. Template reads `g{{ route_.key }}`/`g{{ contactTab.key }}` |
| `aria-hidden` | `"ariaHidden":"true"` on all 5 |
| Mobile slideover unchanged | `mobile slideover links [... "kbd":false ...]` |
| Fits at lg/desktop, light+dark | `fit.cjs` numbers, `scrollWidth == innerWidth`, both screenshots |
| build+lint+typecheck clean | Output above |
| comments per code-comments.md | No comments touched |

## Noticed, not done
- In a light screenshot the first capture can lack the color-mode icon (lazy icon load). That's test timing, not a product issue.

## Seal gate
None. No commit or push.
