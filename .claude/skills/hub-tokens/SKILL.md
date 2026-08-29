---
name: hub-tokens
description: "Report the token cost of agent-hub/ — how much gets read every worker session (recurring cost) vs cold storage (evidence/, archived diagram rows) that's only opened on demand. Usage: /hub-tokens. Read-only, makes no changes."
---

# /hub-tokens — measure agent-hub's token cost

Read-only diagnostic. No file changes, no seal gate needed.

## Why this exists
`haven/diagrams/dev-loop.prime-mermaid.md` is read in full by every worker
session (implementer, verifier, and every subagent spawned for a `/todo`
verify pass re-loads it from scratch). Left unchecked it grows forever and
becomes the single biggest recurring token cost in the hub — this is what
the `dev-loop-archive.md` convention (see the diagram file's own header
note) exists to bound. This command measures whether that's actually
happening, instead of guessing.

There's no exact tokenizer available here — the report uses `bytes / 4` as
a documented, consistent proxy (not a real token count). Good enough to
catch size regressions and compare categories; don't quote it as a real
billed-token number.

## Steps
1. Run this exact script from the repo root (adjust `ROOT` if invoked
   elsewhere — it defaults to the current directory):

```bash
ROOT="."
HUB="$ROOT/agent-hub"

bytes_glob() { find $1 -maxdepth "${2:-99}" -type f \( -name "*.md" -o -name "*.yaml" -o -name "*.yml" \) 2>/dev/null -exec cat {} + 2>/dev/null | wc -c | tr -d ' '; }
bytes_glob_exclude() { find "$1" -type f \( -name "*.md" -o -name "*.yaml" -o -name "*.yml" \) ! -iname "*archive*" 2>/dev/null -exec cat {} + 2>/dev/null | wc -c | tr -d ' '; }
row() { local label="$1" b="$2"; local t=$(( b / 4 )); printf "  %-40s %9d B  ~%8d tok\n" "$label" "$b" "$t"; }

echo "agent-hub token report — $(date +%Y-%m-%d)  [$ROOT]"
echo "==================================================================="
echo "READ EVERY WORKER SESSION (this is the recurring cost):"
ROOT_B=$(bytes_glob "$HUB" 1)
DOCTRINE_B=$(bytes_glob "$HUB/doctrine")
DIAG_ACTIVE_B=$(bytes_glob_exclude "$HUB/haven/diagrams")
IMPL_B=$(bytes_glob "$HUB/haven/workers/implementer")
VERIF_B=$(bytes_glob "$HUB/haven/workers/verifier")
row "root files (NORTHSTAR/CLAUDE/etc)" "$ROOT_B"
row "doctrine/" "$DOCTRINE_B"
row "haven/diagrams/ (active file only)" "$DIAG_ACTIVE_B"
row "haven/workers/implementer/" "$IMPL_B"
row "haven/workers/verifier/" "$VERIF_B"
SESSION_B=$(( ROOT_B + DOCTRINE_B + DIAG_ACTIVE_B + IMPL_B + VERIF_B ))
row "= per-session total (implementer or verifier boot load)" "$SESSION_B"
echo
echo "COLD STORAGE (opened on demand only, NOT re-read wholesale by"
echo "pick_next/verify_seal — large size here is not a recurring cost):"
ARCHIVE_B=$(find "$HUB/haven/diagrams" -type f -iname "*archive*" 2>/dev/null -exec cat {} + 2>/dev/null | wc -c | tr -d ' ')
EVI_I_B=$(bytes_glob "$HUB/evidence/implementer")
EVI_V_B=$(bytes_glob "$HUB/evidence/verifier")
row "haven/diagrams/*archive*" "$ARCHIVE_B"
row "evidence/implementer/" "$EVI_I_B"
row "evidence/verifier/" "$EVI_V_B"
COLD_B=$(( ARCHIVE_B + EVI_I_B + EVI_V_B ))
row "= cold storage total" "$COLD_B"
echo
TOTAL_B=$(( SESSION_B + COLD_B ))
echo "-------------------------------------------------------------------"
printf "TOTAL agent-hub/ on disk: %d B  ~%d tok\n" "$TOTAL_B" "$((TOTAL_B/4))"
printf "Recurring per-session cost: %d B  ~%d tok (%.0f%% of total)\n" \
  "$SESSION_B" "$((SESSION_B/4))" "$(echo "$SESSION_B $TOTAL_B" | awk '{print ($1/$2)*100}')"
echo
echo "FLAGS:"
DIAG_FILE="$HUB/haven/diagrams/dev-loop.prime-mermaid.md"
if [ -f "$DIAG_FILE" ]; then
  DB=$(wc -c < "$DIAG_FILE")
  FULL_SEALED=$(grep -cE '\| SEALED \|' "$DIAG_FILE" 2>/dev/null || echo 0)
  POINTER_SEALED=$(grep -cE '— archived, see' "$DIAG_FILE" 2>/dev/null || echo 0)
  REAL_SEALED=$(( FULL_SEALED - POINTER_SEALED ))
  if [ "$DB" -gt 15360 ]; then
    echo "  ⚠ dev-loop.prime-mermaid.md is ${DB}B (>15KB threshold), $REAL_SEALED full SEALED entries not yet archived — consider moving nodes older than the current work session to haven/diagrams/dev-loop-archive.md"
  else
    echo "  ✓ dev-loop.prime-mermaid.md is ${DB}B, under the 15KB threshold ($REAL_SEALED full SEALED entries, $POINTER_SEALED archived pointers)"
  fi
fi
```

2. Report the output verbatim — don't paraphrase the numbers into prose,
   the table is already the report.
3. If the flag fires (active diagram over 15KB), that's a real signal to
   do an archive pass (see `haven/diagrams/dev-loop-archive.md`'s own
   convention note, or the equivalent section in
   `haven/diagrams/dev-loop.prime-mermaid.md`'s PM-status header) — but
   this command itself never edits anything. Archiving is a separate,
   explicit action.

## What the numbers mean
- **Recurring per-session cost** — what a fresh implementer or verifier
  worker reads before touching any code. This is the number that actually
  compounds: every subagent spawned for a verify pass pays it again, from
  zero, with no cache reuse across separate agent contexts.
- **Cold storage** — `evidence/` and archived diagram rows. Large here is
  normal and not itself a problem: `/boot` and `pick_next` only touch a
  handful of the most recent evidence notes, not the whole directory. Only
  worth worrying about if something starts reading it in bulk (e.g. a
  recipe that globs all of `evidence/` instead of the specific notes it
  needs).

## Runtime
`/hub-tokens`. Read-only — no seal gate, no evidence note, no worker
identity needed (this isn't a code-repo change).
