# 2026-10-21 - resume-api-error-standard (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `resume-api-error-standard` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- New PM status: SEALED (PENDING → SEALED, row updated in place)
- Notes audited: `evidence/implementer/2026-10-21/resume-api-error-standard-plan.md`, `...-diff.md`

## Isolation proof
Separate Agent spawn, `subagent_type: general-purpose`, description "Verify node resume-api-error-standard" — distinct from the implementer's task string "/todo #244". This context did not write the diff and did not open it (only the notes, the diagram row, issue #244 and doctrine).

## Reasoning
| Criterion | Evidence cited from the diff note |
|---|---|
| Backend 400/404/5xx or `success:false` → `/api/resume` controlled 502, no uncaught 500 | Runtime table vs mock backend: 404 `NOT_FOUND` → `statusCode: 502, "Unable to load resume data"` `[502]` ×2; 200 `{ success:false }` → `[502]` |
| Failure not cached 12 days | Same server, mock switched to 200 `{ success:true, data }` with no restart → `{"success":true,"resume":{...}} [200]`. Plan cites the mechanism (`nitropack .../cache.mjs:57-62` rethrows without `setItem`, :151 `validate` rejects `>= 400`) |
| `/api/generate-pdf` controlled 502 | Runtime table: same 404 → `statusCode: 502, "Unable to load resume data"` `[502]` |
| `ResumeAPIResponse` matches envelope, old field optional | `error?: { code: string; message: string; details?: { field: string; message: string }[] }`, `errors?: string[]`; typecheck exit 0 |
| VisitTracker 201 needs no change | Note: only `.catch`es, 201 is 2xx — matches issue item 4 ("chỉ cần kiểm tra lại") |
| Build + lint + typecheck clean (commands per `doctrine/MEMORY.md`) | `npm run build` exit 0, `✨ Build complete!` (only pre-existing `@nuxt/image` sharp WARN); `npm run lint` → `> eslint .` exit 0 no output; `npx nuxi typecheck` exit 0 no diagnostics |
| comments per code-comments.md | Row present: 3 comments, all WHY/API-doc `/** */`, no issue refs |
| Browser verification | N/A justified — server/API + type only, no visual change |

- Truncation: none (`...`/"truncated" absent from Output).
- Forbidden states: none hit — node exists on diagram (not ADHOC_WORK), notes exist (not NO_EVIDENCE), real outputs + runtime run quoted (not EDIT_UNVERIFIED), no code under `haven/` (not CODE_IN_HAVEN), PM row updated here (not DIAGRAM_DRIFT).
- Seal gate: none needed — no commit/push/PR in the implementer pass.
- Proportionality: 1 new helper shared by the 2 call sites + 1 type change; optional issue item 5 correctly left out; the now-redundant `if (data)` guard left in place and logged under "Noticed, not done". No scope creep.

## Re-run
none — audit only. Node is not outward-facing or a `/release` gate, note output is not truncated, and the runtime evidence is concrete per criterion.
