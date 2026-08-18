# 2026-08-19 — giscus-live-fix (verdict)

- Worker: verifier
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `giscus-live-fix`
- New PM status: **SEALED** (from IN_PROGRESS)
- Source: `agent-hub/evidence/implementer/2026-08-19/giscus-live-fix-{plan,diff}.md`

## Reasoning
| # | Criterion | Cited evidence | Met? |
|---|---|---|---|
| 1 | `onMounted` awaits `nextTick()` before `loadGiscus()` | Diff cited | ✅ (independently re-confirmed below) |
| 2 | Build/lint clean | Cited | ✅ (independently re-run below, from a cold cache) |
| 3 | Real iframe appears with correct repo/category IDs, 0 console errors | Cited, exact JSON with real IDs | ✅ (independently re-run below, bit-for-bit match) |

Independent spot-checks the verifier ran directly:
- `git status --short` → only `Comments.vue` + diagram + evidence dir —
  matches the note's file table, `giscus-comment`'s SEALED row untouched
  (`git diff HEAD -- .../dev-loop.prime-mermaid.md | grep -c "^-.*giscus-comment"`
  → `0`, independently re-confirming LAI-13 was honored, not just
  claimed).
- `grep -n "nextTick" themes/portfolio-dev/pages/post/Comments.vue` →
  present in `onMounted`, confirming the fix is real code, not just
  narrated.
- Re-ran `rm -rf node_modules/.cache .nuxt .output` + `npm run build`
  independently (full cold cache) → clean, exit 0.
- Re-ran `npm run lint` independently → `✖ 34 problems (0 errors, 34
  warnings)`, exact session baseline; grepped `Comments.vue` → 0 matches.
- Independently started a fresh preview server and ran an independently-
  written `puppeteer-core` script against the same real `/blogs/<id>`
  page, with the operator's real `.env` values already in place (not
  synthetic): iframe appeared with
  `repoId=R_kgDOM3bPGg&category=Announcements&categoryId=DIC_kwDOM3bPGs4DDqo8`
  in its `src` — matches the operator-provided real values exactly, not
  a coincidental pass. `requests` showed `304` instead of the
  implementer's `200` for `client.js`/`default.css` (browser cache from
  the implementer's own just-prior run reusing the same Chrome profile)
  — a cosmetic difference, not a discrepancy: `304 Not Modified` still
  means the request succeeded and the resource was used. 0 console
  errors, matching exactly.
- Preview server + temp script cleaned up after verification.

## Forbidden states scan
| State | Hit? | Note |
|---|---|---|
| `ADHOC_WORK` | No | New node created for a regression (not editing `giscus-comment`'s SEAL), per LAI-13 |
| `NO_EVIDENCE` | No | Full plan + diff notes present, including the pre-fix failure reproduction |
| `EDIT_UNVERIFIED` | No | Verbatim build/lint (independently re-run from cold cache) + real CDP evidence with real operator credentials (independently re-run and matched) |
| `CODE_IN_HAVEN` | No | Only the diagram `.md` in `haven/` |
| `DIAGRAM_DRIFT` | No (after this seal) | PM status updated to match below |

## Visual/behavior check
Unusually strong: the verification used the operator's actual real
Giscus credentials (not fakes) and confirmed the iframe's own query
string echoes those exact values back — this is about as close to "the
real feature genuinely works end-to-end" as a CDP check can get for a
third-party embed.

## Seal gate
None recorded, none needed — no commit/push/PR happened in this
implementer pass; `git status` shows only working-tree changes on
`bug/81`.

## Proportionality
1-line fix (`onMounted(() => ...)` → `onMounted(async () => { await
nextTick(); ... })`) + 1 diagram row + evidence — exactly what a
regression fix should look like, nothing more.

## Missing
None — no REOPEN.
