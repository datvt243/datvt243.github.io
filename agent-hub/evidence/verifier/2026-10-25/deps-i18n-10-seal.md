# 2026-10-25 - deps-i18n-10 (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `deps-i18n-10` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row before this verdict)
- Evidence judged: `evidence/implementer/2026-10-24/deps-i18n-10-diff.md` (incl. `## Rework 1`) + `-plan.md`; previous verdict `evidence/verifier/2026-10-24/deps-i18n-10-reopen.md`; artifacts in the session scratchpad `i18n/` dir
- New PM status: `SEALED` (row collapsed to an archive pointer; full row appended to `haven/diagrams/dev-loop-archive.md`)

## Isolation proof
Separate subagent spawned through the Agent tool with description
`"Verifier pass deps-i18n-10 round 2"`, fresh context. It did not write the diff, did not
open the code diff, and is not the round-1 verifier (`"Verifier pass deps-i18n-10"`) nor the
implementer (`/todo` flow "tiếp tục nhóm B" → issue #261).

## Reasoning
Round 1 REOPENed on two items only; every other criterion was judged met there with cited
evidence (`npm ls` 10.6.0, build rc=0 + `└  ✨ Build complete!` + 0 `import.meta`, lint 0
problems, typecheck 0 `error TS`, switcher vi→en→vi on `/github` and `/blogs` with
`Tải CV d` → `Download CV d`, `hydration msgs: 0 []`, audit 52 → 49, comments N/A,
Supersedes none). Nothing in Rework 1 touches those.

| Item | Evidence | Judgment |
|---|---|---|
| Missing 1: dated clarification of "byte-identical" in the node row | Row now reads "identical to the v9 baseline [clarified 2026-10-24 after REOPEN: compared after stripping v10's non-configurable `id="i18n-*"` attributes and sorting tags per route — byte-identity was never possible]". Rework 1 also records it under "Acceptance criteria clarified" | met |
| Missing 2: normalization command recorded | Rework 1: `sed -E 's/ id="i18n-[^"]*"//' v10-head.txt > v10s.txt`, then `python3 -I - v9-head.txt v10s.txt` (group by `== <route>`, sort each block, compare) → `routes: 10 semantically identical (...): 10`. Read-only spot-check: the recorded `sed` on `v10-head.txt` is `cmp`-identical to `v10s.txt` (`SED_REPRODUCES`); my own group-sort-compare of `v9-head.txt` vs `v10s.txt` → `10 10 10` (10 routes each side, 10 equal) | met — python body described, not pasted, but the procedure is fully specified and reproduces |
| SSR head criterion (as clarified) | Same as above, 10/10 | met |
| Still at 10.6.x | `npm ls @nuxtjs/i18n --depth=0` → `└── @nuxtjs/i18n@10.6.0`; `package.json` `"@nuxtjs/i18n": "^10.6.0"` | met |
| Comments per code-comments.md | No source files changed | N/A — met |
| Supersedes (7b) | `## Supersedes: none`; only this row references #261 | met |

Forbidden states: none hit. Seal gate: no outward-facing action (no commit/push/PR).
Proportionality: package.json, lockfile, diagram row, append-only correction note — minimal.

## Re-run
`none` — no build, lint, typecheck, server or CDP run. Read-only spot-checks only: `cmp` of
the recorded `sed` command's output against `v10s.txt`, an independent per-route
sort-and-compare of the existing head artifacts, and `npm ls --depth=0`.

## Diagram housekeeping
Collapse-on-SEAL (step 12): full row appended to `dev-loop-archive.md`; active row replaced by a pointer. Pointer rows were 24 → trimmed to 20 by deleting the 4 oldest (`github-updated-date-tz`, `ats-cv-template-local`, `comment-cleanup-standardize`, `comment-style-followup`), each confirmed present as a full SEALED row in the archive first.
