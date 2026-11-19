---
name: todo
description: Resolve/create a GitHub issue + check out its own branch, then combine /worker analyst (feature, or a bug with no feature doc yet) + /worker implementer + /worker verifier into 1 command for the datvt243.github.io agent-hub — still runs 2 separate passes inside (doesn't break NeverVerifyOwnWork), automatically re-runs the implementer pass on REOPEN up to the retry limit. Trigger: /todo "[task]"|#[issue-number] [--ship]. Stops at SEAL or when the retry limit is hit, never commits on its own — unless --ship is given, in which case it goes on to call /ship (passing --ship IS the approval — /ship runs straight away, AutoCommitNoGate). Use when running any feat or fix task end-to-end.
argument-hint: "<task>|#<issue-number> [--ship]"
disable-model-invocation: true
---

# /todo "<task>"|#<issue-number> [--ship]

Pure orchestrator — does NOT re-implement any implement/verify logic of its
own. It calls the `worker` skill (`.claude/skills/worker/SKILL.md`) exactly
2 times, in 2 separate passes.

## Steps
1. **[added 2026-09-12] Resolve issue + checkout branch** (runs BEFORE any
   worker command):
   1. **Resolve issue**:
      - Arg matches `^#?\d+$` (issue mode) → `gh issue view <number> --json
        number,title,url`. Not found / `gh` not authenticated → stop, report
        the real error verbatim, don't keep guessing.
      - Otherwise (free-text mode) → `gh issue create --title "<first line
        of the task, shortened>" --body "<the full task text>"` to open a
        new issue, taking `<number>`/`<title>`/`<url>` from the command's
        real output. Error (no `gh`, not authenticated, no remote
        configured) → stop, report the error — never continue without an
        issue.
      - From here on, `<task>` for the rest of this `/todo` run is the
        title + body of the issue just resolved (enough context for the
        implementer/verifier), not only the raw arg that was typed in.
   2. **Compute the branch name**: [sync 2026-10-07] check `doctrine/domains/PROJECT.md`
      first for a documented branch-naming convention. This project
      documents `bug/<issue_number>`/`feature/<issue_number>` — use it
      exactly (`bug/` for a bug, `feature/` otherwise; unclear → ask), so
      the branch matches what `.claude/commands/ship.md`'s guard expects.
      Only if PROJECT.md documents none: `<number>-<slug>`, `<slug>` = the
      first 3 words of the issue title, lowercased, non-alphanumeric
      characters collapsed into `-`.
   3. **Resolve base branch**: read `doctrine/domains/PROJECT.md` (the
      project's git workflow: `staging` is the integration branch, `main`
      only receives code via `/release`) — the default base branch is
      `staging`, never `main`. Unclear → stop, ask, don't guess.
   4. **Really sync the base branch before branching off it**: `git fetch
      origin`, `git checkout <base>`, `git pull origin <base>` — always do
      this before creating a new branch, so both the new branch and the
      implementer's starting point come from the latest code, not a stale
      local copy. Pull error/conflict → stop, report the real error
      verbatim, never force/stash/discard on the operator's behalf.
   5. **Check out the issue's branch**: `gh issue develop <number> --list`
      first — if a linked branch already exists (resuming earlier work) →
      check out that branch, `git pull` as well (to get remote updates if
      any), never create a 2nd branch for the same issue. If none exists →
      `gh issue develop <number> --checkout --base <base> --name <branch
      from step 2>` — creates the branch from the base synced in step 4,
      links it to the issue on GitHub, and checks it out, in 1 real
      command. Git-level error (dirty tree, base ref doesn't exist...) →
      stop, report the real error verbatim, never force/stash/discard on
      the operator's behalf.
   6. **Report** the resolved issue (`#<number>`, URL) and the branch name
      to the operator before continuing — this is a report, NOT a 2nd
      approval gate; the only real approval gate in the whole `/todo`
      chain is still `/ship`'s push step at the end.
1b. **Pass 0 — analyst** (kit 2026-11-06): run `/worker analyst "<task>"`
   (separate subagent) BEFORE pass 1 when:
   - the issue is a feature (label `enhancement`/`feature`, else title
     starts with add/implement/support; unclear → ask) — spec mode; skip when resuming and the issue's doc in
     `agent-hub/doctrine/features/` already exists with no unanswered open
     question;
   - the issue is a bug (label `bug`, else title starts with fix/bug) and
     `agent-hub/doctrine/features/INDEX.md` has no row for the area/issue —
     backfill mode (`"document the feature touched by: <task>"`);
   - anything else → skip.
   `spec_ready`/`no_feature` → continue. `needs_input` → show its
   questions to the operator verbatim, wait, re-run pass 0 with the
   answers — never answer them yourself, never start pass 1 with a
   question open. `blocked` → stop, report.
2. **Pass 1 — implementer**: run exactly the `/worker implementer
   "<task>"` procedure (load bundle → become → pick_next → implement → real
   build+lint+typecheck+test → evidence note), already standing on the
   branch from step 1. Stops at `sealed_pending_verifier`.
   - `blocked`/`failed` → stop immediately, report to the operator, don't
     run pass 2. `--ship` doesn't fire (not SEALED).
3. **Pass 2 — verifier**: run exactly the `/worker verifier "<task>"`
   procedure as a COMPLETELY SEPARATE pass — carries none of pass 1's
   reasoning/context into the verdict, only reads the evidence note just
   written (`NeverVerifyOwnWork` still applies even though the same
   `/todo` command calls both). [sync 2026-11-07]
   Keep the verifier's agent id from the Agent tool result — step 4 reuses it.
4. **On REOPEN**: automatically go back to step 2 with the exact REOPEN
   reason from the verifier's evidence note, at most **3 iterations**. The
   issue/branch from step 1 stay the same across every REOPEN, never
   re-resolved. [sync 2026-11-07]
   Pass 2 of a REOPEN round: resume the SAME verifier via `SendMessage` to
   its agent id — "round <N>: re-read `<note path>` from disk, re-run
   `verify_seal` steps 2-12, write a new verdict note + log line" — instead
   of spawning a new one. It has never seen the implementer's reasoning, so
   isolation still holds; it skips reloading the bundle. Resume fails (no
   id, agent gone, error) → spawn a new one as in step 3. Limit hit →
   stop, report the whole REOPEN history for the operator to decide, never
   loop forever. `--ship` doesn't fire (not SEALED).
5. **On SEAL**: (kit 2026-11-09) print exactly this report, nothing else
   (no diff, no recap of the work — the evidence note has it):
   ```
   ✅ SEALED <slug> — <task>
   issue #<n> <url> · branch <branch>
   evidence: <note path>[, <note path>…]
   spawns: verifier <N> (<F> fresh, <R> resumed), REOPEN <k>
   next: /ship "<task>"
   ```
   `spawns:` is read back from
   `grep "role=verifier.*node=<slug> " evidence/worker-runs.log`, never
   counted from memory. A REOPEN round logged `fresh` means step 4's
   resume fell back — append ` (fresh: <why>)` to that line. With
   `--ship`, `next:` becomes `next: running /ship "<task>"`.
   Every non-SEAL stop (step 1 failure, `blocked`, `failed`, retry limit)
   uses the same shape:
   ```
   ⛔ STOPPED <slug|-> — <task> (<blocked|failed|retry-limit|issue/branch>)
   issue #<n> <url> · branch <branch>   (omit if step 1 failed)
   reason: <blocker | latest REOPEN reason | real error, verbatim>
   spawns: verifier <N> (<F> fresh, <R> resumed), REOPEN <k>   (omit if no verifier ran)
   next: <the one decision the user must make>
   ```
   - **Without `--ship`** (default): stop here. Do NOT
     `git commit`/`git push`/open a PR yourself — that's `/ship`'s job, a
     separate step the operator runs.
   - **With `--ship`**: immediately call `/ship "<task>"` exactly as that
     skill defines it — do NOT re-implement `/ship`'s logic here. `/ship`
     still runs its own full contract: `SealedOnly` (satisfied since SEAL
     just happened), shows the real `git add`/`git commit`/`git push`
     commands and then runs them straight away (`AutoCommitNoGate` —
     passing `--ship` IS the approval), `NoForce`, `ReadBackBeforeClaim`,
     its own evidence note. `--ship` on `/todo` only saves typing `/ship`
     as a 2nd command.

## Hard rules honored
`IssueBranchFirst` (resolve/create the GitHub issue + check out its own
branch before any worker command; branch name and base always come from
the resolved issue + `doctrine/domains/PROJECT.md`'s git workflow, never
guessed; the base branch is always synced — `fetch`+`checkout`+`pull` —
before branching off, never a stale local copy) | Inherits every hard rule
of both `implementer` and `verifier` (see each worker's `manifest.yaml`) |
`SealedOnly`/`NoForce`/`ReadBackBeforeClaim` (only with `--ship`, via the
real `/ship` command in step 5, not re-implemented here) — `/todo` has no
hard rule of its own besides `IssueBranchFirst`, the rest is only
orchestration.

## Failure branches
| Failure | Handling |
|---|---|
| `#<number>` but the issue doesn't exist / `gh` not authenticated | Stop, report the real `gh` error verbatim |
| Free-text task but `gh issue create` fails (no remote, not authenticated...) | Stop, report the error — never continue without an issue |
| Base branch unclear from `doctrine/domains/PROJECT.md` | Stop, ask — don't guess |
| `git fetch`/`checkout <base>`/`pull` fails (dirty tree, conflict, no remote...) | Stop, report the real error verbatim — never force/stash/discard on the operator's behalf |
| `gh issue develop`/checkout fails (dirty tree, base ref doesn't exist...) | Stop, report the real error verbatim — never force/stash/discard on the operator's behalf |
| Pass 1 reports `blocked` (missing env var, vague task...) | Stop immediately, don't run pass 2, report to the operator |
| REOPEN 3 times in a row for the same reason | Stop, suspect the acceptance criteria or the recipe is wrong — ask the operator to review the node/task, don't guess a 4th time |
| Resuming the verifier via `SendMessage` fails in a REOPEN round | Spawn a new verifier as in step 3 — never verify inline |
| Verifier can't find pass 1's evidence note | Stop, report the error — don't guess what pass 1 did |
| Task requires an outward-facing action in the middle of pass 1 | The SEAL GATE in the `implement.md` recipe still stops and waits for approval as usual, `/todo` doesn't skip it |
| `--ship` given but the loop stops at `blocked`/`failed`/retry limit (not SEALED) | Don't call `/ship` — there's nothing to ship |
| `--ship` given, SEALED, but `/ship` itself refuses (e.g. push rejected, or the project's own guard in `/ship`) | Report `/ship`'s real error — the SEAL from step 5 still stands, only the ship step failed |

## Runtime
`/todo "<task>"|#<issue-number> [--ship]`. First resolve (or create) the
GitHub issue, sync the base branch (`fetch`+`checkout`+`pull`, never a
stale local copy), then check out its own branch (named per step 1.2) via
`gh issue develop` — no worker is called before this part is done. The
rest is identical to calling `/worker implementer` then `/worker verifier`
(subagent) by hand in sequence, repeating on REOPEN, then — only with
`--ship` and when the loop ends at SEAL — calling `/ship "<task>"`
directly. Use it when you want 1 command instead of typing
`/worker implementer` then `/worker verifier` by hand; use the 2 separate commands
when you want to read the evidence yourself between the 2 steps before
letting the verifier judge.
