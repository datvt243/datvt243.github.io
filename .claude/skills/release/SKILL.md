---
name: release
description: "Promote staging into main by running the bundled release.sh: build/test gate, real merge commit (no squash), semver bump + tag vX.Y.Z, deploy via DEPLOY_HOOK_URL or report the deploy workflow run, sync the bump back to staging, close shipped issues (Closes #n in the release PR, read from the merged PRs). Usage: /release [patch|minor|major]. Invoking this skill IS the operator's go-ahead — no separate confirmation prompt."
argument-hint: "[patch|minor|major]"
disable-model-invocation: true
---

# /release — promote `staging` into `main`

All logic lives in `${CLAUDE_SKILL_DIR}/release.sh` — the operator can run
the same script by hand: `.claude/skills/release/release.sh [patch|minor|major]`.
Never re-implement or skip its steps by hand. Gate commands come from
`release.env` next to it (from `agent-hub/doctrine/MEMORY.md`).

1. Run `bash "${CLAUDE_SKILL_DIR}/release.sh" $ARGUMENTS` (timeout 600000 —
   it waits on CI). Print its output verbatim.
2. Exit 2 = bump type needed (no arg, `RELEASE_AUTO_BUMP` off): run
   `git log origin/main..origin/staging --oneline`, ask (AskUserQuestion)
   patch/minor/major — never guess a breaking change — then rerun with it.
3. Exit 1 = stopped (dirty tree, gate failed, red CI, merge blocked, tag
   exists): report the real output, don't retry with workarounds, never
   `--force`/direct push/force-merge.
4. Exit 0: relay its final report (version, tag, PR URLs, deploy, issues).

`main` only ever receives code through this script — no direct push, no
PR from a feature/fix branch.
