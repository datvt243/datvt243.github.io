> This is the recipe that touches code the most — the place `EDIT_UNVERIFIED`
> gets caught, or slips through.

# Contract
- Input: output of `pick_next`.
- Output: `{status: sealed_pending_verifier | reopened_by_build | failed,
  node, diff summary, command, evidence}`
- NEVER: `status: done` — only the verifier uses a sealed state.

## Steps
1. Re-read the node + acceptance criteria.
2. Read every related file before writing — match the existing naming/
   style/idiom (e.g. the `Theme*` prefix tag convention, semantic Tailwind
   tokens `bg-theme-*`/`text-theme-*` instead of literal colors).
3. Smallest diff — only change what the acceptance criteria require.
4. SEAL GATE before an outward-facing action (commit/push/delete file/open
   PR) — stop, show the diff, wait for approval.
5. Run the EXACT command from `doctrine/MEMORY.md`: `npm run build` then
   `npm run lint` — copy it verbatim, don't guess.
6. READ THE OUTPUT BACK verbatim — an uncited claim = `EDIT_UNVERIFIED`.
7. If the change has a visual/behavior part the user would see: check the
   real UI via Chrome CDP port 9888 (`curl -s
   http://localhost:9888/json/version` to check it's already running; if
   not, launch with `--remote-debugging-port=9888
   --user-data-dir="$HOME/.chrome-debug-profile"`), connect with
   `puppeteer-core`. Prefer real click-based navigation over
   `Page.navigate` when testing cache/hydration behavior.
8. Only report `sealed_pending_verifier` when ALL criteria pass with
   evidence (clean build + clean lint + UI verification if needed).
9. If you hit a new bug/trap (in the same style as the existing traps in
   `doctrine/domains/PROJECT.md`), consider adding it to the Traps table.
10. Write it into `evidence/` following the format in `evidence/README.md`.
11. [added 2026-09-02] ONLY when the result is `blocked` or `failed`
    (never reaches the verifier) — append one line to
    `evidence/worker-runs.log` (create the file if missing):
    `role=implementer outcome=blocked|failed node=<slug>
    hub_bytes_before=<N from pick_next step 7> verifier_rerun=n/a`. When
    the result is `sealed_pending_verifier`, do NOT log here — the
    verifier logs both sides (before/after) in `verify_seal.md` once it
    has a real verdict. Same logging whether called via `/todo` or a
    standalone `/worker implementer`.

## Hard rules honored
`SmallestDiff` | `TestsBeforeDone` | `EvidencePerAction` | `NoSilentFailure` |
`NodeBeforeCode`

## Failure branches
| Failure | Handling |
|---|---|
| `npm run build` fails | `reopened_by_build`, write the error verbatim into evidence, don't guess a fix if the root cause isn't clear |
| Build fails/flakes, not reliably reproducible | Suspect cache first (`rm -rf node_modules/.cache .nuxt .output`), check the related trap in `doctrine/domains/PROJECT.md` before concluding |
| A needed env var for build/run is missing | `blocked`, don't fake a value |

## Runtime
`/worker implementer "<task>"` or pass 1 of `/todo "<task>"`.
