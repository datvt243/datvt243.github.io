# 2026-11-01 - resume-isr-allow-lang (verifier: SEAL, round 2)

- Worker: verifier · Version: 0.1.0
- Node: `resume-isr-allow-lang` (#361), branch `bug/361` off `staging` 270bb78, uncommitted
- Notes graded: `evidence/implementer/2026-11-01/resume-isr-allow-lang-plan.md`, `evidence/implementer/2026-11-01/resume-isr-allow-lang-diff.md` (pass 2, `## REOPEN 1 response`)
- Prior verdict: `evidence/verifier/2026-11-01/resume-isr-allow-lang-reopen.md` (kept, not overwritten)
- New PM status: SEALED (row collapsed to a pointer, full row appended to `haven/diagrams/dev-loop-archive.md`). Follow-up node `resume-isr-allow-lang-live` stays PENDING.

## Verdict: SEAL

## REOPEN 1 items
| Item | Result |
|---|---|
| 1. Criterion 4 (post-deploy `?lang=en`) had no evidence | Resolved via option (b), which REOPEN 1 explicitly offered. Diagram row 98 adds `resume-isr-allow-lang-live` PENDING with a concrete criterion: preview/live `?lang=en` introduction starts `Frontend Developer with 4+ years`, `?lang=vi` the VI one, different etags, both verbatim. Blocked on the operator push. This node's row now ends "build+lint+typecheck+test clean. Post-deploy live check moved to `resume-isr-allow-lang-live`", and the note records the change as `## Acceptance criteria clarified: <before> → <after>` (the `pick_next.md` 4b format). |
| 2. Second prerender-config file paraphrased as `{ same as above }` | Resolved. `## Output` now shows `.vercel/output/functions/api/resume/_payload.json-isr.prerender-config.json` in full: `"expiration": 60`, `"allowQuery": ["lang", "__isr_route"]`, `"passQuery": true`. It was re-captured in pass 2 (`vercel build exit=0`). No ellipsis or paraphrase is left in `## Output`. |

## Is the split acceptable?
Yes. The recipe has no conditional SEAL (`VerdictOnly`). A criterion that can only be proven after a push can't be proven in a pass that isn't allowed to push (seal gate). Moving it into its own PENDING node leaves no criterion unproven and drops no obligation. The live check is still a tracked open row with a pass/fail condition anyone can check, so it isn't a quiet weakening. RatchetOnly holds because no state moved backwards. The `-live` row is new and PENDING, and this row goes from IN_PROGRESS to SEALED. The node-local criteria (rule + Vercel output config) are the cause of the bug the plan diagnosed (no `allowQuery`, so no `lang` reaches the function). So the SEALed half is the full local fix, not a stand-in.

## Reasoning (current criteria)
| Criterion | Evidence |
|---|---|
| 1. rule `{ isr: { expiration: 60, allowQuery: ['lang'] } }` | Diff: `+    '/api/resume': { isr: { expiration: 60, allowQuery: ['lang'] } },`. `git diff --stat` shows `nuxt.config.ts | 3 ++-`, which matches. |
| 2. Vercel prerender config allows + passes `lang` | Both files: `"allowQuery": ["lang", "__isr_route"]`, `"passQuery": true`. Staging before: `{"expiration": 60}` (×2). |
| 3. build + lint + typecheck + test clean | `build exit=0`, `◆ ✨ Build complete in 14.5s!`, `lint exit=0`, `typecheck exit=0`, `Tests  14 passed (14)`. Pass 2 changed no code (only the diagram and the note), so the pass-1 output still applies. |
| comments per code-comments.md | One `//` line, why only ("Vercel ISR drops the query unless allowed: ..."), no issue ref. |
| Step 4 commands | `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`, all as in `doctrine/MEMORY.md`. The Typecheck row has no `baseline:`. |
| Step 5 truncation | None left (REOPEN item 2 fixed). |
| Step 6 visual/behavior | N/A locally, accepted as in round 1: there's no ISR outside Vercel. The behavior check is now the `-live` node. |
| 7b Supersedes/Still open | The only other open #361 row is `resume-isr-allow-lang-live`, which this pass created. The note covers it: Acceptance row 4 says "moved to node `resume-isr-allow-lang-live` (PENDING)", and REOPEN 1 response item 1 gives the reason (needs a push). `## Supersedes: none` is correct, since nothing is retired. Not blocking: the note has no literal `## Still open` heading, but the content is there. |

## Forbidden states / seal gate / proportionality
- Forbidden states: none hit. Node row exists, notes written, no code in `haven/`, diagram updated (DIAGRAM_DRIFT clear: `-live` row + this pointer).
- Seal gate: `none`. Nothing was committed or pushed. `.vercel/` is absent (`ls: .vercel: No such file or directory`).
- Proportionality: one routeRule line plus one comment. The `-live` row is the smallest way to keep criterion 4 tracked.
- Carry into the PR (from `## Noticed, not done`): `/api/resume` sends `cache-control: max-age=1036800`, so browsers that already hold the VI body may keep it for up to 12 days.

## Isolation proof
Spawned as a separate verifier subagent via the Agent tool, spawn description "Verifier re-pass for #361 after REOPEN 1". The task string starts "You are the VERIFIER for the agent-hub ... This is the second verification round". It differs from the implementer's task (the verbatim issue body) and from round 1's spawn ("Verifier pass for #361"). This context didn't write the diff and didn't open it. It read only the notes, the diagram rows, `git diff --stat` and the hub docs.

## Re-run
none. I audited the notes only, the default. The output is verbatim, the commands match MEMORY.md, and none of the three re-run exceptions applies: this isn't a `/release` gate, and the live behavior is the `-live` node's job.

## PM status
`resume-isr-allow-lang`: IN_PROGRESS → SEALED, collapsed in place to a pointer. The full row was appended to `dev-loop-archive.md`. The active file then had 21 pointers, so I deleted the oldest (`light-hover-footer-targets`), whose full row is already in the archive at line 106. `resume-isr-allow-lang-live` stays PENDING.
