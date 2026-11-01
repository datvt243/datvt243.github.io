# 2026-11-01 - resume-isr-allow-lang (verifier: REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `resume-isr-allow-lang` (#361), branch `bug/361` off `staging` 270bb78, uncommitted
- Notes graded: `evidence/implementer/2026-11-01/resume-isr-allow-lang-plan.md`, `evidence/implementer/2026-11-01/resume-isr-allow-lang-diff.md`
- New PM status: unchanged, row stays IN_PROGRESS (REOPEN)

## Verdict: REOPEN

## Missing
- **Criterion 4 has no evidence.** The node row lists "after deploy,
  preview/live `?lang=en` returns the EN introduction" as an acceptance
  criterion. The note's Acceptance table says `pending — needs deploy`.
  Step 7 says a criterion with no evidence means REOPEN. The recipe has no
  deferred or conditional SEAL (`VerdictOnly`), so I can't SEAL around it,
  even though the note is upfront that it can't be proven locally.
  Two ways to close it. Pick one:
  (a) With operator approval (seal gate: push), push `bug/361` so Vercel
  builds a preview. Then curl the preview's `/api/resume?lang=en` and
  `?lang=vi` and paste both `"introduction"` prefixes plus the `etag`
  headers verbatim. They must differ, and EN must start
  `Frontend Developer with 4+ years`.
  (b) Move criterion 4 out of this node into a new post-deploy node (e.g.
  `resume-isr-allow-lang-live`, PENDING) and note the change in the next
  diff note, so this node only holds criteria that can be proven before
  deploy. Criteria 1-3 are already proven (see Cited), so (b) needs no new
  build.
- **Output paraphrase (step 5).** In `## Output`, the second file
  `.vercel/output/functions/api/resume/_payload.json-isr.prerender-config.json`
  is shown as `{ same as above }`, not its real contents. Step 5 counts
  hidden output as missing. Paste the real JSON. It doesn't change
  criterion 2, which the first file already proves.

## Cited
| Criterion | Result |
|---|---|
| 1 rule `{ isr: { expiration: 60, allowQuery: ['lang'] } }` | PASS. Diff: `+    '/api/resume': { isr: { expiration: 60, allowQuery: ['lang'] } },` |
| 2 vercel prerender config allows + passes `lang` | PASS. `api/resume-isr.prerender-config.json`: `"allowQuery": ["lang", "__isr_route"]`, `"passQuery": true`. Staging before: `{"expiration": 60}`. The second file is paraphrased (see Missing) |
| 3 build + lint + typecheck + test clean | PASS. `build exit=0`, `◆ ✨ Build complete in 14.5s!`, `lint exit=0`, `typecheck exit=0`, `Tests  14 passed (14)`. The commands match `doctrine/MEMORY.md` |
| 4 post-deploy live/preview EN | MISSING. `pending — needs deploy` |
| comments per code-comments.md | PASS. One `//` line says why ("Vercel ISR drops the query unless allowed..."). No issue ref |
| 7b Supersedes/Still open | PASS. `## Supersedes: none`. Only one #361 row is on the active diagram (line 97) |

## Forbidden states / seal gate / proportionality
- Forbidden states: none hit. The node row exists (IN_PROGRESS), notes are
  written, no code is in `haven/`, and the diagram matches the 2 changed
  files (`git diff --stat`: `nuxt.config.ts`, `dev-loop.prime-mermaid.md`).
- Seal gate: `none`. Nothing was committed or pushed. `.vercel/` was removed.
- Proportionality: PASS. One routeRule line plus one comment, the smallest fix.
- Browser verification N/A locally is accepted: there's no ISR outside
  Vercel, and the real check is criterion 4.
- Not blocking: the untracked `review/` and `.playwright-mcp/` folders
  aren't in the diff table. Keep them out of this commit. The 12-day
  browser `cache-control` in `## Noticed, not done` can still serve the old
  VI body to people who already loaded it. That's worth a line in the PR.

## Isolation proof
Spawned as a separate verifier subagent via the Agent tool, spawn
description "Verifier pass for #361". The task string starts "You are the
VERIFIER for the agent-hub ... Run `/worker verifier` on node
`resume-isr-allow-lang`". That differs from the implementer's task (the
verbatim issue body). This context didn't write the diff and didn't open it.
It read only the two notes, the diagram row, `git diff --stat` and the
standards.

## Re-run
none. I audited the notes only, the default. A local re-run can't produce
criterion 4's post-deploy evidence, and the paraphrase is a note fix, not a
build question.

## PM status
Not updated (REOPEN). Row `resume-isr-allow-lang` stays IN_PROGRESS (RatchetOnly).
