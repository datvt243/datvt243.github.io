# 2026-09-05 — editor-dracula-badge-label-fix (verifier seal)

- Worker: verifier
- Node: `editor-dracula-badge-label-fix` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Note graded: `evidence/implementer/2026-09-05/editor-dracula-badge-label-fix-{plan,diff}.md`

## Verdict: SEAL

## Isolation proof
- My own task string (verbatim, as given to this subagent — different from
  the implementer's own task string, which per the implementer's plan note
  was the operator's Vietnamese go-ahead `"xử lý #137 và #138 luôn đi"`):
  `Chạy /worker verifier "editor-dracula-badge-label-fix" cho repo tại
  /Users/_david/Workspace/Project/resume/datvt243.github.io — đọc TOÀN BỘ
  bundle agent-hub/haven/workers/verifier/ (manifest.yaml, SOUL.md, mọi
  file trong recipes/), rồi theo đúng recipe verify_seal.md để chấm
  evidence note tại agent-hub/evidence/implementer/2026-09-05/
  editor-dracula-badge-label-fix-plan.md và
  agent-hub/evidence/implementer/2026-09-05/
  editor-dracula-badge-label-fix-diff.md. Ghi rõ task string này và định
  danh subagent của bạn vào '## Isolation proof' trong seal/reopen note.`
- Subagent identifier: this verifier pass ran as its own Claude Code
  session (`session_01NCE6r9JR3nN5XTTzFcP5ZG`), spawned fresh for this
  grading task with no prior context of the diff — never saw
  `themes/portfolio-dev/pages/projects/Index.vue`'s change until reading
  the implementer's evidence note in this pass. Confirmed I did not write
  this diff (`NeverVerifyOwnWork` — this pass's first real action was
  reading doctrine/bundle files, not editing `Index.vue`).

## Bundle read
`agent-hub/haven/workers/verifier/manifest.yaml`, `SOUL.md`,
`recipes/verify_seal.md` (the only file in `recipes/` — confirmed via
`find`, nothing else present) — read in full before grading, per this
pass's own instructions and `agent-hub/CLAUDE.md`'s required-reading list.
Also read `NORTHSTAR.md`, root `CLAUDE.md`, `doctrine/MEMORY.md`,
`doctrine/domains/PROJECT.md`, `doctrine/standards/{recipes,
edit-verification}.md`, and `haven/diagrams/dev-loop.prime-mermaid.md`
first, per `agent-hub/CLAUDE.md`'s required-reading order.

## Diff scope check (excluding known parallel-process files)
`git diff -- themes/portfolio-dev/pages/projects/Index.vue
agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` reproduced the exact
same hunks as the implementer's diff note (`text-blue-400` →
`text-theme-accent` on the label `<p>`, new `techBadgeUi` const + `:ui`
prop on `<UBadge>`, new PM-status row). No other file was touched by this
node. `git status --short` shows 7 unrelated modified/untracked entries
(`.claude/skills/worker/SKILL.md`, `agent-hub/haven/workers/implementer/
manifest.yaml`, `agent-hub/haven/workers/implementer/recipes/
pick_next.md`, `agent-hub/haven/workers/verifier/manifest.yaml`,
`agent-hub/haven/workers/verifier/recipes/verify_seal.md`,
`.claude/skills/persona-load/`, `agent-hub/.gitattributes`) — these match
exactly the implementer note's own "Working tree note (not from this
pass)" disclosure, confirmed pre-existing from a parallel process, out of
scope for this node's forbidden-states scan.

## Acceptance criteria — one by one
| # | Criterion | Evidence | Met? |
|---|---|---|---|
| 1 | `text-blue-400` → `text-theme-accent` on the label | Scoped `git diff` above, line-for-line match to the note | ✅ |
| 2 | `<UBadge>` gets a per-instance `:ui` override (not global `app.config.ts`) | Scoped `git diff` shows `techBadgeUi` + `:ui="techBadgeUi"`; `app.config.ts` absent from the scoped diff entirely | ✅ |
| 3 | `post/Item.vue`'s `UBadge` / other editor tokens untouched, `SmallestDiff` | `git status --short` — only `Index.vue` + diagram row changed by this node | ✅ |
| 4 | `npm run build` clean | Independently re-run (see Re-run below), exit 0, only the pre-existing darwin-arm64 `sharp` warning (unrelated, seen in prior sealed nodes too) | ✅ |
| 5 | `npm run lint` clean, unchanged baseline | Independently re-run: `✖ 32 problems (0 errors, 32 warnings)` — exact match to the note's cited baseline and to the last several sealed nodes | ✅ |
| 6 | Real UI check via Chrome CDP, both color modes, on `/projects` | Independently re-verified (see below) — concrete computed-style values cited, not "looks fine" | ✅ |

## Command (matches `doctrine/MEMORY.md`, verbatim)
```
rm -rf node_modules/.cache .nuxt .output && npm run build
```
Independently re-run by this verifier pass (cold cache) under `.nvmrc`'s
Node 24 (`nvm use 24`). Exit 0. Same darwin-arm64 `sharp` binary warning as
`dependency-upgrade-phase2` — pre-existing, not from this diff.

```
npm run lint
```
Independently re-run. Verbatim tail: `✖ 32 problems (0 errors, 32
warnings)` — exact match to the implementer's cited baseline and to this
hub's running baseline across the last several sealed nodes.

## Real UI check — independent CDP re-verification
Not a note audit alone: this node changes production-facing colors, and
this pass's own task instructions required real re-verification of the
implementer's specific `dark:`-prefix merge claim, not just trusting the
note. Ran `/browser` (Chrome already up on 9888 from a prior session check
in this pass — confirmed via `curl -s http://localhost:9888/json/version`
returning JSON before reuse). Preview server: fresh cold-cache build,
`PORT=3997 node .output/server/index.mjs` (port 3997 — different from the
implementer's 3996). Wrote a brand-new `puppeteer-core` script (not the
implementer's, which no longer exists), read the real rendered `<article>`
label `<p>` and the tech-tag `<span class="inline-flex">` (the actual
`UBadge` root, not the sidebar filter list), then did a REAL click on the
header's color-mode toggle button and re-read both.

Verbatim result (2 real color modes, labeled by the actual `htmlClass`
returned):
```json
{
  "first":  { "htmlClass": "dark",
    "label": { "className": "font-theme-mono text-sm text-theme-accent mb-2", "color": "rgb(189, 147, 249)", "hasLiteralBlue": false },
    "badge": { "className": "inline-flex items-center font-medium rounded-md text-xs px-2 py-1 gap-1 text-theme-accent dark:text-theme-accent ring-1 ring-inset ring-theme-accent/40 dark:ring-theme-accent/40", "color": "rgb(189, 147, 249)", "ringColor": "rgb(189 147 249/.4)", "hasDarkPrimary": false, "hasLiteralPrimaryOrBlue": false } },
  "toggled": true,
  "second": { "htmlClass": "light",
    "label": { "className": "font-theme-mono text-sm text-theme-accent mb-2", "color": "rgb(124, 58, 204)", "hasLiteralBlue": false },
    "badge": { "className": "inline-flex items-center font-medium rounded-md text-xs px-2 py-1 gap-1 text-theme-accent dark:text-theme-accent ring-1 ring-inset ring-theme-accent/40 dark:ring-theme-accent/40", "color": "rgb(124, 58, 204)", "ringColor": "rgb(124 58 204/.4)", "hasDarkPrimary": false, "hasLiteralPrimaryOrBlue": false } },
  "consoleErrors": []
}
```

### Independent confirmation of the implementer's `dark:`-prefix dead-end
The implementer's diff note reported that a first attempt using ONLY the
non-dark override (`text-theme-accent ring-theme-accent/40`, no `dark:`
classes) left Nuxt UI's default `dark:text-primary-400`/
`dark:ring-primary-400` classes surviving in the real rendered `<span>`,
because `defuTwMerge` merges by class-modifier group and doesn't treat
`dark:`-prefixed and non-dark classes as conflicting — fixed by also
adding explicit `dark:text-theme-accent`/`dark:ring-theme-accent/40`.

This pass did not revert the fix to reproduce the broken intermediate
state (out of scope — that would mean editing source code as a verifier).
What this pass DID independently confirm, from its own fresh CDP read of
the CURRENT code: the real rendered badge `<span>`'s `className` contains
BOTH `text-theme-accent` AND `dark:text-theme-accent`/
`dark:ring-theme-accent/40` (i.e. the `dark:` half of the fix is actually
present in the shipped markup, not just in the source comment), and in
BOTH real color modes there is zero `primary`/`blue` remnant
(`hasDarkPrimary: false`, `hasLiteralPrimaryOrBlue: false`) and the
computed `color` exactly matches the intended Dracula token in each mode.
This is consistent with, and corroborates, the implementer's account of
why the `dark:`-prefixed classes were necessary — the claim holds up under
independent re-derivation, not just note-trusting.

- `rgb(189, 147, 249)` = `#bd93f9` = Dracula canonical Purple, this repo's
  documented `--theme-accent` for `.dark .editor-scope` — exact match, for
  both label and badge.
- `rgb(124, 58, 204)` = the Dracula-light companion's `--theme-accent` —
  exact match for both label and badge, and identical to the value cited
  in the implementer's own CDP run.
- `consoleErrors: []` across page load + the real toggle click.

## Forbidden-states scan
| State | Hit? | Why |
|---|---|---|
| `ADHOC_WORK` | No | Traces to the `editor-dracula-badge-label-fix` node on the diagram |
| `NO_EVIDENCE` | No | Plan + diff notes exist, this seal note now exists |
| `EDIT_UNVERIFIED` | No | Build/lint/CDP independently re-run and read back by this pass, not just reasoned about |
| `CODE_IN_HAVEN` | No | Only `.vue` code changed, outside `haven/` |
| `DIAGRAM_DRIFT` | No (fixed by this seal) | PM status row updated to SEALED below |

No forbidden state hit. No "tests pass" claim anywhere in the note (this
project has no test suite).

## Proportionality (`SmallestDiff`)
Diff is exactly the 2 lines named in the issues plus the minimal `ui`
override needed to also cover dark mode (itself forced by the real
`defuTwMerge` behavior, not scope creep) — no unrelated file touched. The
2 newly-discovered same-bug-class instances in `github/part/Item.vue`
(disclosed in the implementer's "Noticed, not done") were correctly left
out, per `NodeBeforeCode`.

## Seal gate
No outward-facing action was taken by this pass — no `commit`/`push`/PR.
This note only updates the diagram's PM status (an allowed verifier
action, not a git action) and appends one log line, both writes explicitly
within `haven/workers/verifier/manifest.yaml`'s `writes:` scope.

## PM status update
`haven/diagrams/dev-loop.prime-mermaid.md`'s `editor-dracula-badge-label-fix`
row updated in place (`AppendOnly` — not moved/reordered) from `IN_PROGRESS`
to `SEALED`.

## Re-run
`full` — re-ran `npm run build` (cold cache) and `npm run lint` from
scratch, plus an entirely new CDP script/port for the UI check. Reason:
(1) this pass's own task instructions explicitly required independent
CDP re-verification of the `dark:`-prefix merge claim rather than trusting
the note, and (2) this node is a production-facing visual change on
`/projects`, satisfying the "Re-run scope" section's outward-facing
exception in `verify_seal.md`.

## Hub bytes before / after
- `hub_bytes_before` (reused from the implementer note's own citation):
  73187
- `hub_bytes_after` (measured via `/hub-tokens`'s script, after the PM
  status update above): 75160

## Cleanup
Preview server (PID 43630, port 3997) killed; confirmed no LISTEN socket
remains (`lsof -nP -iTCP:3997 -sTCP:LISTEN` → empty, and `ps -p 43630` →
no such process). This pass's own temp CDP script
(`.tmp-verify-cdp-137-138.mjs`, project root copy + scratchpad original)
deleted. `npm run lint` re-run after cleanup: `✖ 32 problems (0 errors, 32
warnings)` — identical, confirming no leftover temp file polluted the
baseline. `git status --short` after cleanup shows only the pre-existing
unrelated parallel-process files + this node's real diff — nothing else.
