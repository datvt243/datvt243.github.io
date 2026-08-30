# 2026-08-30 — dependency-upgrade-plan (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `dependency-upgrade-plan`
- Status: `sealed_pending_verifier`

## Diff
| File | Why |
|---|---|
| `DEPENDENCY-UPGRADE-PLAN.md` (new, repo root) | The plan itself — current audit state, root-cause classification (build-time-only vs runtime-reachable), a live registry cross-check finding (nuxt's `npm outdated` numbers were stale), phased bump order, per-package risk notes, explicit "what not to do" section |

```
$ git status --short
?? DEPENDENCY-UPGRADE-PLAN.md
```
Single new file, nothing else touched.

## Commands
```
npm audit
```
Verbatim tail:
```
53 vulnerabilities (4 low, 8 moderate, 35 high, 6 critical)
```

```
npm audit fix --dry-run
```
Verbatim tail (unchanged after the dry-run):
```
53 vulnerabilities (4 low, 8 moderate, 35 high, 6 critical)
```

```
npm run build
```
Exit code `0`. Verbatim tail:
```
Σ Total size: 28.5 MB (10.5 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```

```
nvm use && npm run lint
```
Verbatim tail (resolved to `v24.19.0` via `.nvmrc`):
```
✖ 32 problems (0 errors, 32 warnings)
```
Unchanged from the standing baseline — expected, no source/`package.json`
file touched, only a new docs file added.

## Key live-registry finding (cited in the plan)
```
$ npm outdated   (earlier read)
nuxt   3.13.2   3.17.7   3.17.7
$ npm view "nuxt@^3.13.0" version   (live)
... highest listed: 3.21.11 ...
$ npm view nuxt dist-tags
{ '3x': '3.21.11', latest: '4.5.2', ... }
```
Confirms `npm outdated`'s cached `nuxt` numbers understated the real
range-satisfying max by 4 minor versions. Cross-checked `@nuxt/ui` (outdated
said `2.22.3`, `npm view "@nuxt/ui@^2.18.6" version` live confirms
`2.22.3` — accurate) and `@nuxt/image` (outdated said `1.11.0`, live
confirms `1.11.0` — accurate) to establish this was `nuxt`-specific, not a
systemic staleness across every package.

## Browser verification
N/A — no visual/behavior change. A new root-level markdown planning
document, not shipped/served to any real user, doesn't touch any runtime
code path.

## Acceptance
| Criterion | Evidence | Met? |
|---|---|---|
| Plan document exists, phased, cites real data | `DEPENDENCY-UPGRADE-PLAN.md` — see its Phase 1/2/3 tables + the live-registry-finding section above | ✅ |
| No dependency actually bumped | `git status --short` shows only the new `.md` file; `package.json`/`package-lock.json` untouched | ✅ |
| Build/lint clean | Tails above, exit 0 / `32 problems (0 errors, 32 warnings)`, unchanged baseline | ✅ |

## Noticed, not done
- `puppeteer-core`'s correct target version (beyond the current `23.8.0`)
  wasn't fully researched — `npm audit`'s own suggestion (`19.8.3`) is a
  downgrade, disclosed as a "don't do this" in the plan rather than solving
  it here; flagged as needing its own research pass in Phase 3.
- No actual bump was attempted (including Phase 1's low-risk items) — out
  of scope for this node by the issue's own explicit request ("1 pass
  riêng để lên kế hoạch... không làm gộp 1 lần").

## Seal gate
None — no commit/push/PR in this pass. `git status --short` shows only the
new untracked file on branch `feature/91`.
