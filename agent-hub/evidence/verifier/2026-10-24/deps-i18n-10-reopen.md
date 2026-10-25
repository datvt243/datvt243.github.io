# 2026-10-24 - deps-i18n-10 (REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `deps-i18n-10` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Evidence judged: `evidence/implementer/2026-10-24/deps-i18n-10-diff.md` (+ `-plan.md`), and the artifacts it names in the session scratchpad `i18n/` dir (`v9-head.txt`, `v10-head.txt`, `b0.log`, `b1.log`, `dev-*.log`, `head.sh`)
- New PM status: unchanged, `IN_PROGRESS`. This is a REOPEN, and the ratchet only moves on SEAL.

## Isolation proof
This pass is a separate subagent spawned through the Agent tool with description
`"Verifier pass deps-i18n-10"`, in a fresh context. It did not write the diff and did not open
the code diff. It read the notes, the node row, the bundle, and the implementer's
artifacts. For hub-integrity only, it ran `git diff --numstat` on the evidence file that was
touched. The implementer's task string was the `/todo` flow "tiếp tục nhóm B" → issue #261,
which is different from this one.

## Reasoning
| Criterion (node row) | Evidence | Judgment |
|---|---|---|
| `npm ls @nuxtjs/i18n` 10.6.x | Note: `@nuxtjs/i18n@10.6.0`, `vue-i18n@11.4.16`. Spot-check `npm ls --depth=0` → `└── @nuxtjs/i18n@10.6.0` | met |
| build clean, #75 `import.meta` error absent | Note: rc=0, `└  ✨ Build complete!`. `b1.log`: `grep -ci import.meta` = 0, and the last line is `└  ✨ Build complete!` | met |
| lint clean | rc=0, 0 problems. This is a count, not a verbatim tail. The same format was accepted for `deps-pinia-4` | met |
| typecheck clean | rc=0, 0 `error TS` (same format as the pinia precedent). `tc1.log` shows only info lines | met |
| **SSR head of 10 routes "byte-identical to the v9 baseline"** | Raw `diff v9-head.txt v10-head.txt` gives 160 changed lines. v10 adds `id="i18n-alt-*"`/`i18n-can`/`i18n-xd`/`i18n-og*` attributes, and the sort order changes because of them. I normalized the files independently (strip ` id="i18n-[^"]*"`, sort lines within each route) and they came out `IDENTICAL`, with 10/10 `http=200` on both sides. The note itself says it is "not literally byte-identical as the row says" | **not met as written** (see Missing 1) |
| switcher vi→en→vi keeps route + translates | CDP output `/github`→`/en/github`→`/github`, `/blogs`→`/en/blogs`→`/blogs`, `lang` vi-VN↔en-US, `Tải CV d` → `Download CV d` | met |
| 0 hydration messages on dev | `hydration msgs: 0 []`. Every `dev-*.log` has `grep -ci hydration` = 0 | met |
| `npm audit` before/after | 52 → 49 | met |
| comments per code-comments.md | N/A. The only changes are package.json, the lockfile, a diagram row, and an evidence note, with no source comments | met |
| Supersedes check (7b) | `## Supersedes: none`. `grep "261"` on the active diagram finds only this row | met |

### The three points the operator asked about
1. **"Byte-identical" vs. what the evidence shows.** This is a REOPEN, so the criterion has to
   be clarified first. Semantically the evidence holds up, and I confirmed it myself: the
   values of html lang, hreflang (including x-default), canonical, og:locale(+alternate) and
   title match on all 10 routes. The `id="i18n-*"` attributes are v10's head-dedup keys and
   can't be configured away, so byte-identity was never reachable on v10. The criterion was
   mis-specified, and the implementation is not at fault. Still, the row literally says
   "byte-identical", and the verifier cannot reinterpret or drop a criterion
   (`RatchetOnly`/`EvidenceOnly`, same reasoning as the `deps-pinia-4` REOPEN). Sealing a
   criterion that is disclosed as unmet would be a "looks good but". The fix is cheap and
   needs no re-run (see Missing).
2. **`## Correction` appended to `deps-nuxt-image-2-diff.md`.** This is within the rules and
   acceptable for this PR. `git diff --numstat` shows `7 0`: lines were added and nothing was
   removed, which is exactly what evidence/README rule 2 asks for ("a wrong note gets a
   correction added, not deleted"). The correction is dated and attributed. It doesn't change
   that node's SEAL or its row, and it is the provenance this node relies on for its own A/B
   claim about the 12 warnings. It is listed in the diff table, so it is disclosed.
3. **A/B claims.**
   - The `nuxt/server` warning is pre-existing. `grep -c "nuxt/server"` returns 12 in `b0.log`
     and 12 in `b1.log`. `b0.log` is really v9: `optimizeTranslationDirective` = 1, while
     `b1.log` has 0. **Confirmed.**
   - The dev `/cache` write errors are pre-existing. `Cache write error` counts are:
     `dev-v9b.log` 18 (v9, which carries the `[@nuxtjs/i18n]` WARN marker), `dev-v10c.log` 18,
     `dev-v10d.log` 18, and 0 in both curl-only runs (`dev-v9.log`, `dev-v10b.log`). The
     source is `nuxt.config.ts:140 PostDetail: { driver: 'fs', base: '/cache' }`.
     **Confirmed.** Neither claim is a reason to hold the node.

Forbidden states: none hit. The row exists, the notes are present, there is no code in
`haven/`, and the claims are backed by evidence.
Seal gate: there was no outward-facing action (no commit, push, or PR), so none was needed.
Proportionality: the diff is limited to package.json, the lockfile, one diagram row, and an
append-only correction, so it is minimal.

## Missing
1. The SSR-head criterion as written ("byte-identical to the v9 baseline") is not met, and the
   note itself discloses this. Before re-verify, the node row needs a dated in-row
   clarification, added by the implementer or operator and not by the verifier. It should
   restate the criterion as: values identical to v9 after stripping v10's `id="i18n-*"`
   dedup attributes and sorting per route.
2. The diff note's `## Command` lists `head.sh` but not the normalization step behind
   `routes: 10 semantically identical ... : 10`. Add that command verbatim, or the script
   path (`v9n.txt`/`v10s.txt` exist, but the command that produced them isn't cited).

Once both are in, a re-verify can SEAL straight off the existing artifacts with no rebuild.
Every other criterion is already met above.

## Re-run
`none`: no build, lint, typecheck, dev/prod server, or CDP run. I only did read-only
spot-checks of the implementer's existing artifacts: grep counts on `b0/b1/dev-*.log`, my own
`id`-strip-and-sort comparison of `v9-head.txt`/`v10-head.txt`, `npm ls --depth=0`, and
`git diff --numstat` on the corrected evidence note.
