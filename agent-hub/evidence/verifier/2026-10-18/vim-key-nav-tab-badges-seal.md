# 2026-10-18 - vim-key-nav-tab-badges (verifier verdict)

- Worker: verifier · Version: 0.1.0
- Node: `vim-key-nav-tab-badges` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row of the PM status table)
- Verdict: **SEAL**
- New PM status: SEALED (row updated in place, IN_PROGRESS → SEALED)
- Notes graded: `evidence/implementer/2026-10-18/vim-key-nav-tab-badges-{plan,diff}.md`

## Isolation proof
This pass ran as a separate subagent spawned through the Agent tool with the description "Verifier pass vim-key-nav-tab-badges #236". The implementer pass ran in the parent session's main context, and its task string was "hãy thêm các badge  gr gp bên cạnh các text". This context did not write the diff.

## Reasoning
| Check | Result |
|---|---|
| 1. Own work? | No, see Isolation proof. |
| 4. Commands match `doctrine/MEMORY.md` | `npm run build` · `npm run lint` · `npx nuxi typecheck` on Node v24.19.0. These match the Build, Lint and Typecheck rows. |
| 5. Truncated output | The note's "verbatim output" block for the browser check is elided: `{"name":"_projects","badge":"gp",...}` and `[...same 5 badges, ariaHidden "true"...]`. The `fit.cjs` numbers are paraphrased, and build/lint/typecheck are given as selected lines only. Earlier nodes in this tree handled this with a partial re-run, so this pass re-ran everything (see Re-run). |
| 6. Concrete UI evidence | Re-run output below, plus screenshots. |
| 8. Forbidden states | None hit. The node exists, an evidence note exists, the results were checked by re-running, there's no code in `haven/`, and the diagram row is updated. |
| 9. Seal gate | Nothing outward-facing happened (no commit or push). The note says "none". |
| 10. Proportionality | The note's Diff lists one product file. `grep -n "<kbd" Header.vue` shows the two new badge lines at :54 and :68. The only other `<kbd>`, at :78, is the `?` button from the sealed `vim-key-nav-hint` node. Nothing beyond the node's scope. |

### Acceptance, one by one
| Criterion | Evidence (this pass's re-run, verbatim) |
|---|---|
| Each desktop tab, `_contact` included, shows a `g<key>` badge read from `menuPrimary[].key` | `badges2.cjs` gives badges `gr`, `gp`, `gh`, `gb`, `gc` for `_resume`, `_projects`, `_github`, `_blogs` and `_contact`. The template reads `g{{ route_.key }}` (Header.vue:54) and `g{{ contactTab.key }}` (:68). The keys `r/p/h/b/c` come from `app.config.ts` lines 8, 13, 18, 23 and 28. |
| Badge is `aria-hidden` | `"ariaHidden":"true"` on all 5 tabs, in both the 1280-dark and 1024-light runs. |
| Mobile slideover unchanged | `mobile slideover links [{"text":"_resume","kbd":false},{"text":"_projects","kbd":false},{"text":"_github","kbd":false},{"text":"_blogs","kbd":false},{"text":"_contact","kbd":false}]` |
| Fits at lg (1024) and desktop widths | `1024 {"withBadges":{"rowScroll":960,"rowClient":960,"toggleRight":992},"noBadges":{"rowScroll":960,"rowClient":960,"toggleRight":992}}` · `1100 {... "toggleRight":1030} ...` (identical with and without badges) · `1280 {"withBadges":{"rowScroll":960,"rowClient":960,"toggleRight":1120},"noBadges":{...same...}}`. `scrollWidth` equals `innerWidth` (1280 and 1024). |
| Light + dark, theme tokens | dark `"color":"rgb(100, 116, 139)"` and light `"color":"rgb(148, 163, 184)"` on all 5 badges, which are the `--theme-faint` values the note cites. In the screenshots, every tab plus `?`, `VI` and the color-mode icon are visible in both modes. |
| build + lint + typecheck clean | `build exit 0` / `└  ✨ Build complete!` · `lint exit 0`, output is only `> nuxt-app@1.2.9 lint` / `> eslint .` · `tc exit 0`, `grep -c "error TS"` = `0` |
| comments per code-comments.md | The note says "No comments touched". Header.vue:54 and :68 hold only markup, so that checks out. |

Verbatim `badges2.cjs` output from this pass:
```
badges-1280-dark {"cls":"dark","tabs":[{"name":"_resume","badge":"gr","ariaHidden":"true","color":"rgb(100, 116, 139)"},{"name":"_projects","badge":"gp","ariaHidden":"true","color":"rgb(100, 116, 139)"},{"name":"_github","badge":"gh","ariaHidden":"true","color":"rgb(100, 116, 139)"},{"name":"_blogs","badge":"gb","ariaHidden":"true","color":"rgb(100, 116, 139)"},{"name":"_contact","badge":"gc","ariaHidden":"true","color":"rgb(100, 116, 139)"}],"headerRowHeight":45,"scrollWidth":1280,"innerWidth":1280}
badges-1024-light {"cls":"light","tabs":[{"name":"_resume","badge":"gr","ariaHidden":"true","color":"rgb(148, 163, 184)"},{"name":"_projects","badge":"gp","ariaHidden":"true","color":"rgb(148, 163, 184)"},{"name":"_github","badge":"gh","ariaHidden":"true","color":"rgb(148, 163, 184)"},{"name":"_blogs","badge":"gb","ariaHidden":"true","color":"rgb(148, 163, 184)"},{"name":"_contact","badge":"gc","ariaHidden":"true","color":"rgb(148, 163, 184)"}],"headerRowHeight":45,"scrollWidth":1024,"innerWidth":1024}
mobile slideover links [{"text":"_resume","kbd":false},{"text":"_projects","kbd":false},{"text":"_github","kbd":false},{"text":"_blogs","kbd":false},{"text":"_contact","kbd":false}]
```

Before running them, this pass read `badges2.cjs` and `fit.cjs`. Each launches a clean headless Chrome (fresh `userDataDir`, no extensions, per the Vimium trap in PROJECT.md) against the production build on `:3457`. They measure the DOM and don't change anything except `fit.cjs`, which hides the `kbd`s only to compare widths.

Outputs (new folder, nothing existing was overwritten): `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/verifier-badges/` (`build.log`, `lint.log`, `tc.log`, `badges2.out`, `fit.out`, `badges-1280-dark.png`, `badges-1024-light.png`). The server was stopped and the `clean-profile` dirs were deleted.

## Re-run
partial: `npm run build`, `npm run lint`, `npx nuxi typecheck` (warm cache, not cold), plus `badges2.cjs` and `fit.cjs`. Reason: the note's browser output is labeled verbatim but is elided with `...`, and the `fit.cjs` numbers are paraphrased. The note was missing verbatim citations (the first exception in "Re-run scope"), so this pass followed the same-tree precedent (`vim-key-nav*-seal.md`) of regenerating the evidence instead of reopening over formatting.
