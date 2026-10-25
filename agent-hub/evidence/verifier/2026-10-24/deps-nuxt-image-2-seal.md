# 2026-10-24 - deps-nuxt-image-2 (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `deps-nuxt-image-2` (`haven/diagrams/dev-loop.prime-mermaid.md`), issue #259 (Phase 3.2 of #266), branch `feature/259` (worktree `scratchpad/wt-259`)
- Judged note: `evidence/implementer/2026-10-24/deps-nuxt-image-2-diff.md` (plan: `...-plan.md`)
- New PM status: SEALED

## Isolation proof
Spawned via the Agent tool by `/todo`, description "Verifier pass deps-nuxt-image-2", as a fresh subagent context distinct from the implementer pass (this context started from the verifier spawn prompt only; it never ran `npm install` or wrote package.json/package-lock.json or the implementer notes).

## Reasoning
| Criterion | Evidence cited | OK |
|---|---|---|
| `npm ls @nuxt/image` shows 2.2.x | note: `@nuxt/image@2.2.0` → `ipx@4.0.0` → `sharp@0.35.5`; spot-check `npm ls` in worktree → same tree | yes |
| `npm run build` clean | note: rc=0, `└  ✨ Build complete!` | yes |
| `npm run lint` clean (baseline 0) | note: rc=0, `npx eslint . \| grep -c problem` → `0` | yes |
| `npx nuxi typecheck` clean (baseline rc 0) | note: rc=0, `grep -c "error TS"` = `0`, last line quoted. Command matches `doctrine/MEMORY.md` Typecheck row | yes |
| `sharp` darwin-arm64 warning re-checked (baseline present) | plan baseline quotes `[@nuxt/image]  WARN  sharp binaries for darwin-arm64 cannot be found.`; diff note: grep on v2 build log → no match | yes |
| `npm audit` before/after (baseline 60) | note: `57 vulnerabilities (1 low, 3 moderate, 49 high, 4 critical)`, 60 → 57 | yes |
| Prod build: every `<img>` loads on `/`, `/github` (direct + click), `/projects`, 404; 0 responses ≥400; counts 14/1/2/1 | note's CDP table (`scratchpad/cdp-img.cjs`, `complete && naturalWidth > 0`): v2 `/` 14/14, `/github` 1/1, `/projects` 2/2, 404 1/1, `/github` click 1/1, img responses ≥400 none — identical to v1 baseline in plan | yes |
| Dev server: 0 hydration messages | note: `hydration msgs: 0 []`; remaining dev warnings named (404-probe router warn, devtools iframe) and none image-related | yes |
| Comments per code-comments.md | N/A — no source file touched, so no comments added/changed | yes |

- Command (step 4): `npm run build`, `npm run lint`, `npx nuxi typecheck` — match `doctrine/MEMORY.md`; no "tests pass" claim.
- Output not truncated (step 5): key lines quoted with rc, no `...` hiding a result.
- Browser evidence (step 6): concrete per-route counts + response/console checks, not "looks fine".
- Supersedes (7b): `#259` only on this row — `none` correct.
- Forbidden states (step 8): none hit — node row exists, evidence written, commands actually run, no code in `haven/`, PM status updated by this verdict.
- Seal gate (step 9): no commit/push/PR — none needed.
- Proportionality (step 10): `package.json` 1-line range bump + lockfile from the same install + the node row. No source/config change, consistent with the plan's finding that no v2 breaking change applies (no `image:` config, custom provider, `sizes`/`densities`).
- Carried-forward risk (not blocking, from the note's "Noticed, not done"): on Vercel, @nuxt/image may pick the `vercel` provider, which local checks don't exercise. Check images on the PR preview deploy.

## Re-run
none. No build/lint/typecheck/CDP re-run: the node isn't outward-facing or a `/release` gate, and PROJECT.md doesn't flag this class of change. Read-only spot-checks only: `npm ls @nuxt/image ipx sharp` and `git diff package.json` (one line, `^1.11.0` → `^2.2.0`). Reading that diff is a small step past `EvidenceOnly`, done only to confirm proportionality.
