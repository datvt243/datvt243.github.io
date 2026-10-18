# 2026-10-18 - vim-key-nav (verifier verdict)

- Worker: verifier · Version: 0.1.0
- Node: `vim-key-nav` (`haven/diagrams/dev-loop.prime-mermaid.md`, issue #236, branch `feature/236`)
- Notes graded: `evidence/implementer/2026-10-18/vim-key-nav-plan.md`, `vim-key-nav-diff.md`
- Verdict: **SEAL**
- New PM status: IN_PROGRESS → **SEALED** (row updated in place, not moved)

## Isolation proof
This pass ran as a separate Agent-tool subagent spawned with description
"Verifier pass vim-key-nav #236", in a blank context. The implementer was the
parent `/todo` session's main context, whose task string was the issue text
"tôi muốn xây dựng tính năng áp dụng nVIM, …". The two strings differ. This
pass did not write any product file. Its only writes are this note, the
SEALED state on the node row, and one `worker-runs.log` line.

## Reasoning
Steps 1-11 of `verify_seal.md`:

| Check | Result |
|---|---|
| 1. Own work? | No. See Isolation proof. |
| 4. Commands match `doctrine/MEMORY.md` | Yes: `npm run build`, `npm run lint`, `npx nuxi typecheck` (the Typecheck row was added on this branch with operator approval, recorded in the plan note). No "tests pass" claim. |
| 5. Truncated output | The note's build line elides with `…` and paraphrases the lint/typecheck results, so this pass re-ran all three (see Re-run). |
| 6. Concrete UI evidence | Yes. The verbatim script output and two screenshot paths were independently reproduced below. |
| 8. Forbidden states | `ADHOC_WORK`: no, the node row exists. `NO_EVIDENCE`: no. `EDIT_UNVERIFIED`: no, re-run matches. `CODE_IN_HAVEN`: no, the only `haven/` change is the diagram `.md` (`git status --short agent-hub/haven`). `DIAGRAM_DRIFT`: resolved by this SEAL. |
| 9. Seal gate | No outward-facing action. Nothing was committed, pushed or opened as a PR. |
| 10. Proportionality | The diff table has 1 new component, a 1-line render in `Header.vue`, a `key` per `menuPrimary` entry, i18n strings, and 3 hub doctrine/diagram files. The doctrine edits are the operator-approved Typecheck row and a Trap that the browser check itself needed. Nothing exceeds the node's scope. |

Acceptance, one by one. All results below are from this pass's own re-run, Node v24.19.0:

| Criterion | Evidence |
|---|---|
| `g`+key → each `menuPrimary` route, locale-aware | `gp -> /projects`, `gh -> /github`, `gb -> /blogs`, `gc -> /contact`, `gr -> /`, `/en gp -> /en/projects` |
| `j`/`k` scroll, `gg`/`G` top/bottom | `j scrollY 80`, `j,k scrollY 80`, `G scrollY 2280 max 2280`, `gg scrollY 0` |
| `?` help overlay, keyboard-accessible, `Esc` closes | `? dialog open true`, `Esc dialog open false`, `? again closes true` (keyboard only, no mouse) |
| Theme tokens, light + dark | `html class light` with `light dialog panel bg rgb(248, 250, 252)`, which equals `light.css` `--theme-panel: 248 250 252`. Screenshots were viewed: `verifier-ui/help-dark.png` (vi, dark slate panel, orange kbd accents, all 10 bindings) and `verifier-ui/help-light.png` (en, light panel, all 10 bindings). |
| Ignored in form fields / with modifiers | `typing in input -> path / scrollY 0 value gpj`, so the keys reached the input without navigating or scrolling. `Alt+j scrollY 0`. |
| Site-wide | It renders from `Header.vue`, which is on every page. Bindings fired on `/`, `/projects`, `/github`, `/blogs`, `/contact` and `/en` during the run. |
| build + lint + typecheck clean | `build exit 0` / `└  ✨ Build complete!` (only the existing `sharp binaries` and `optimizeTranslationDirective` WARNs). `lint exit 0` with no problems printed after `> eslint .`. `tc exit 0`, and `grep -c "error TS"` gives `0`. |
| comments per code-comments.md | The diff note cites the `KeyNav.vue` file-overview JSDoc with `@author`/`@see` (an existing house convention, matching `PageHeading.vue` and the sealed `author-github-see-line` node) plus one `//` WHY line on the modifier bail-out. No `(#N)` refs and no WHAT-comments are claimed. Accepted on the note, per `EvidenceOnly`. |

Issue #236 example bindings (`g g` → `/github`, `g h` → `/`) were remapped
to `gh`/`gr`. The issue itself says "`gg`-style top jump where it doesn't
clash", and its route keys are only examples ("e.g."). The remap is
documented in the plan note's "Key choice" section, so it is not a gap.

## Re-run
`partial`: build, lint, typecheck and browser check (no cold-cache wipe). This pass re-ran `npm run build`, `npm run lint` and `npx nuxi typecheck`
(warm cache, not cold) plus the browser check (prod build on `:3457`, clean
headless Chrome via the implementer's `ui.cjs` read first, into this pass's
own output dir `scratchpad/verifier-ui/`; server stopped afterwards). There
were two reasons. (1) The note's build/lint/typecheck output is elided or
paraphrased (`…`, "0 problems listed") instead of fully verbatim. (2) This is
a site-wide keydown handler on every page of the production site, which is the
outward-facing exception. Also, the operator's task for this pass asked for a re-run.

## Observations (not blocking)
- `doctrine/domains/PROJECT.md` is now 15412 B, just over the 15KB archive
  threshold, after this branch's new Vimium Trap row. The next `/hub-tokens`
  pass should archive older Traps/Decisions rows.
- Active diagram is 81227 B with 37 unarchived SEALED rows. This was already noted
  by the implementer.

## Hub bytes before / after
149019 (implementer note) / 150217 (`/hub-tokens` per-session total, after the SEALED update)
