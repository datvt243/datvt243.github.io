# 2026-10-19 - vim-key-nav-github-search (verifier verdict)

- Worker: verifier · Version: 0.1.0
- Node: `vim-key-nav-github-search` (`haven/diagrams/dev-loop.prime-mermaid.md`, PM status table, last row)
- Note graded: `evidence/implementer/2026-10-19/vim-key-nav-github-search-diff.md`
- Verdict: **SEAL** · New PM status: SEALED (row flipped IN_PROGRESS → SEALED in place)

## Isolation proof
This pass is a separate Agent-tool subagent spawned with the brief "You are the **verifier** worker ... Node to verify: `vim-key-nav-github-search`", with its own scratch dir `scratchpad/verifier-slash/`. The implementer worked from the operator's task string "ở page github, bổ sung key nvim '/' cho input search, sẽ foucus vào ô search, 'esc' sẽ mất focuse" and used `scratchpad/slash/`. This pass did not write any of the product diff.

## Reasoning
| Criterion | Evidence (verifier re-run, verbatim) |
|---|---|
| `/` focuses the repo search on `/github` and `/en/github` without typing `/` | `PASS /github: '/' focuses search (INPUT)`, `PASS /github: no '/' inserted (value="")`, and the same two lines for `/en/github` |
| `Esc` in the box blurs it and keeps the value | `PASS /github: Esc blurs (active=BODY)`, `PASS /github: value kept after Esc (nuxtj)`, and the same for `/en/github` |
| j/k/g work again after Esc | `PASS /github: j scrolls after Esc (scrollY=80)`, `PASS /github: k scrolls back`, the same for `/en/github`, and `PASS gr navigates to / (http://localhost:3458/)`. While the box is focused, `j` is typed: `PASS ... typing incl. 'j' goes into input (value=nuxtj)` |
| `/` ThemeKbd badge in the shared orange | `badge {"visible":true,"color":"rgb(251, 146, 60)","kbd":"251 146 60","aria":true,...}` → `PASS /github: badge color rgb(251, 146, 60) == --theme-kbd (251 146 60)`. Light mode: `PASS light: badge rgb(234, 88, 12) == --theme-kbd 234 88 12`. Screenshots are `github-focused.png` and `github-light.png` |
| Help overlay lists it under "On this page" | `PASS /github: overlay lists '/' with label` (label `Tìm tên repo...`; en `Search repos name...`). Screenshot `overlay.png` shows "Trên trang này / Tìm tên repo... /" |
| `/` is a no-op on pages without a search box | `PASS /: '/' is a no-op on resume (active=BODY)` |
| Previous shortcuts unchanged | `resume shortcuts c,d,1,2,3,4,5` → `PASS /: c,d,1-5 still declared`, `PASS /: '2' focuses skills tab (sc=2)`, `PASS gr navigates to /`. Guards: `PASS ... '/' ignored while overlay open`, `PASS ... Ctrl+/ ignored`. Esc with the overlay open still closes it: `PASS /github: Esc closes overlay`, `PASS /: Esc closes overlay on resume` |
| README + CLAUDE.md document it | `git diff README.md` adds a "Keyboard Shortcuts" table with the row ``| `/` / `Esc` | GitHub page: focus / leave the repo search box |``. `git diff CLAUDE.md` adds the "Keyboard navigation (Vim-style)" paragraph, which covers `/`, preventDefault, and Esc blur |
| build + lint + typecheck clean | Re-run on Node `v24.19.0`. Build: `build_exit=0` and `└  ✨ Build complete!`. Lint: `lint_exit=0`, whose only output is `> nuxt-app@1.2.9 lint` / `> eslint .`. Typecheck: `tc_exit=0` and `grep -c "error TS"` = `0`. These match the note's commands, which follow MEMORY.md, including the Typecheck row |
| comments per code-comments.md | The diff adds 2 `//` comments in `KeyNav.vue`: the Esc hand-back and the reason for preventDefault (`/` lands in the input / Firefox quick-find). Both are WHY comments and neither carries an issue number |

- Regression review of `KeyNav.vue`. (1) The `isTyping` early return now runs after the modifier/defaultPrevented guard, as before, and only adds an Esc blur. The overlay's Esc is handled by UModal and still works (see above). (2) `e.preventDefault()` runs only when a visible `data-shortcut` matches. Letters and digits on a non-input target have no default action, so `c`, `d` and `1`–`5` behave as before, which the check `'2' focuses skills tab` confirms. `target?.` changed to an early `return` with the same semantics.
- Forbidden states: none. The node exists and its row is now updated. Both notes exist. Every result was run and read back.
- Seal gate: no commit, push or PR was made, so nothing outward-facing happened.
- Proportionality: two product files, 22 changed lines, plus the docs the node requires. The Esc blur applies to every form field (contact form, blog search), not just the repo box. This is slightly broader than the operator's wording, but it is the smallest place to implement it, it is documented in CLAUDE.md, and it is harmless.
- No "tests pass" claim appears in the note.

## Re-run
partial. I re-ran `npm run build`, `npm run lint` and `npx nuxi typecheck` on a warm cache, not a cold rebuild, plus my own puppeteer-core script. The reason is the operator's explicit request for an independent re-run, and this change touches the global keydown handler on every page. The script is `scratchpad/verifier-slash/v.cjs`. It used a clean headless Chrome with a fresh temp `userDataDir` against the production build on `:3458`, and did not reuse the implementer's `t.cjs`. Result: `TOTAL pass=38 fail=0`. One of those, "/: overlay opens", is a tautological assert (`|| true`), so the real count is **37/37**. The server on `:3458` was stopped (`lsof -i :3458` is empty). Ports 3000 and 9888 were not touched.

## Not checked
- Firefox quick-find (the stated reason for preventDefault), and mobile/narrow viewports.
- Esc inside the contact-form fields was not exercised in the browser. The code path is the same `isTyping` branch.
