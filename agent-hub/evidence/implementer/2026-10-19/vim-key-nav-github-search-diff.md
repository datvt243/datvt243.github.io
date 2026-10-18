# 2026-10-19 - vim-key-nav-github-search (implementer diff)

- Worker: implementer · Version: 0.1.0
- Node: `vim-key-nav-github-search` (IN_PROGRESS)
- Issue: #236 (follow-up; PR #237 already merged the earlier nodes) · Branch: `feature/236` (re-created off freshly pulled `staging`)
- Task (verbatim): "ở page github, bổ sung key nvim '/' cho input search, sẽ foucus vào ô search, 'esc' sẽ mất focuse". Carries the operator's earlier uncommitted "update lại readme.md claude.md" docs change.
- Status: **sealed_pending_verifier**

## Hub bytes before
153378 (last verifier hub_bytes_after in worker-runs.log); 154111 after this node's row + note

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/github/GitRepos.vue` | UInput gets `data-shortcut="/"` + `:data-shortcut-label` (UInput v2 has `inheritAttrs:false` and binds `attrs` onto the inner `<input>`, checked in node_modules/@nuxt/ui/dist/runtime/components/forms/Input.vue), plus a `#trailing` `<ThemeKbd aria-hidden>/</ThemeKbd>`. Reuses the existing data-shortcut mechanism, no KeyNav knowledge of the page |
| `themes/portfolio-dev/components/KeyNav.vue` | (1) `isTyping` early-return now first blurs on `Escape`, so Esc leaves any form field. (2) A matched page shortcut calls `e.preventDefault()`; without it the `/` keypress lands in the input just focused (and Firefox opens quick-find) |
| `README.md` | New "Keyboard Shortcuts" section (operator's earlier docs request) + `/` / `Esc` row |
| `CLAUDE.md` | KeyNav/Kbd in the component list, "Keyboard navigation" paragraph, `--theme-kbd` rationale, `/`+Esc note |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New row appended (`AppendOnly`) |

## Command
Node 24, repo root: `npm run build` · `npm run lint` · `npx nuxi typecheck`

## Output
- build exit 0, `└  ✨ Build complete!`
- lint: output only `> eslint .`, no problems listed
- typecheck exit 0, `grep -c "error TS"` = 0

## Browser verification
Clean headless Chrome (`puppeteer.launch` with a fresh temp userDataDir, so no Vimium), production build on `:3457`. Script `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/slash/t.cjs`. Result: **27 pass / 0 fail** on `/github` and `/en/github`:
- badge `/` visible, rgb(251,146,60) dark, rgb(234,88,12) light
- `/` focuses the input; value stays `''`
- typing works; `j` types instead of scrolling while focused
- Esc blurs and keeps the value; `j` scrolls again afterwards
- the overlay lists the search shortcut
- Ctrl+/ is ignored; `gr` still navigates
- on `/`, `2` still selects the skills tab, and `/` there is a no-op

Screenshot: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/slash/github-dark-focused.png`.

## Not checked
Mobile/narrow viewport; Firefox (the quick-find claim is the reason for preventDefault, not tested in Firefox).
