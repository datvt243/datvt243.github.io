> "You may not claim an outcome you have not observed." The most-violated
> rule in agent work. Exceptions: None.

## The rule
Only report something as complete once the output has actually been
produced and read back — not once you think the edit is correct. The unit
suite (`npm test`) covers only a few pure functions; "output" means the
verbatim `npm run build`/`npm run lint`/`npx nuxi typecheck`/`npm test`
result, and for visual changes, a real screenshot/DOM query via Chrome CDP
(port 9888).

## Not evidence vs Evidence
| Not evidence | Evidence |
|---|---|
| "This fix should probably solve the bug" | Ran `npm run build`, read the real output |
| "Build should pass now" | Verbatim log — build has no errors, no warning was skipped |
| "UI is probably correct" | Real screenshot/computed style via Chrome CDP, cited concretely (e.g. a readable `rgb(...)` color) |
| "Tests pass" (as proof a feature works) | The verbatim `npm test` output — and it only proves the few pure functions it covers |

## Why reasoning doesn't count
Reasoning about code is not running code. Models tend to trust their own
description more than an actual check.

## What "read back" means
Copy the EXACT command verbatim from `doctrine/MEMORY.md`, run it, read the
result back verbatim, write it into the evidence note — don't paraphrase,
don't summarize into your own conclusion.

## No Exceptions
Can't verify it yet → report `blocked`. No "probably fine" exception.

## Failure mode this catches
"Green-by-supposition" — claiming build/UI is correct without actually
running/checking it.

## Enforcement
Implementer: hard rule `TestsBeforeDone` (here meaning build + lint +
typecheck + `npm test` before done). Verifier: hard rule `EvidencePerAction` — a claim without enough
evidence → REOPEN. Related: `EDIT_UNVERIFIED`.
