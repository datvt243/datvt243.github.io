# 2026-10-24 - deps-nuxt-image-2 (diff)

- Worker: implementer · Version: 0.1.0
- Node: `deps-nuxt-image-2` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: issue #259 "chore(deps): Phase 3.2 — @nuxt/image 1→2" (Phase 3.2 of #266), branch `feature/259` (git worktree at `scratchpad/wt-259`, off `staging` @ `603f1e1`)
- Status: `sealed_pending_verifier`

## Hub bytes before
76703

## Diff
| File | Why |
|---|---|
| `package.json` | `"@nuxt/image": "^1.11.0"` → `"^2.2.0"` (via `npm install @nuxt/image@^2.2.0`) |
| `package-lock.json` | Same install; pulls `ipx@4.0.0` → `sharp@0.35.5` |
| `haven/diagrams/dev-loop.prime-mermaid.md` | New node row appended |

No source/config change: no `image:` config, no custom provider, no `sizes`/`densities` — none of v2's breaking changes apply (see plan).

## Command
```
npm install @nuxt/image@^2.2.0
npm ls @nuxt/image ipx sharp
npm run build
npm run lint
npx nuxi typecheck
npm audit
node scratchpad/cdp-img.cjs <worktree> http://localhost:4001   # prod build
node scratchpad/cdp-img.cjs <worktree> http://localhost:4002   # nuxi dev
```

## Output
- `npm ls`: `@nuxt/image@2.2.0` → `ipx@4.0.0` → `sharp@0.35.5`
- `npm run build` → rc=0, `└  ✨ Build complete!`; `grep -i "sharp\|[@nuxt/image]"` on the build log → **no match** (baseline v1 had `[@nuxt/image]  WARN  sharp binaries for darwin-arm64 cannot be found.` — gone with IPX v4)
- `npm run lint` → rc=0; `npx eslint . | grep -c problem` → `0`
- `npx nuxi typecheck` → rc=0, `grep -c "error TS"` = `0`, last line `✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons`
- `npm audit` → `57 vulnerabilities (1 low, 3 moderate, 49 high, 4 critical)` (baseline 60 → 57)

## Browser verification
Chrome CDP :9888, viewport 1440×900, `scratchpad/cdp-img.cjs`: per route forces `loading=eager` + scroll, waits 2.5s, checks every `document.images` for `complete && naturalWidth > 0`, records every image response ≥400, counts `/hydrat/i` console messages. Console filter excludes the known pre-existing `/visit` CORS + `api-resume` dev warning (documented in `deps-pinia-4` evidence).

Prod build (port 4001) — v1 baseline vs v2:
| Route | v1 (baseline) | v2 |
|---|---|---|
| `/` | 14/14 ok, `/_ipx/s_24x24/svg/js.svg`… | 14/14 ok, same URLs |
| `/github` | 1/1 (`https://avatars.githubusercontent.com/u/9960924?v=4`) | 1/1 same |
| `/projects` | 2/2 (`/_ipx/_/images/projects/simplemdg.svg`, `aihr.svg`) | 2/2 same |
| 404 `/this-page-does-not-exist` | 1/1 (`/_ipx/_/error.png`) | 1/1 same |
| `/github` via real click | 1/1 | 1/1 |
| img responses ≥400 | none | none |
| hydration msgs | 0 | 0 |
| console issues | none | none |

Dev server (port 4002, v2): identical image table; `img responses >=400: none`; `hydration msgs: 0 []`. Console warnings, none image-related: `[Vue Router warn]: No match found for location with path "/this-page-does-not-exist"` (×5 — the intentional 404 probe) and `An iframe which has both allow-scripts and allow-same-origin...` (Nuxt devtools iframe, dev-only).

## Acceptance
| Criterion | Evidence |
|---|---|
| @nuxt/image 2.2.x | `npm ls` |
| build/lint/typecheck clean | rc=0 ×3, 0 problems, 0 `error TS` |
| sharp warning re-checked | baseline present → v2 absent |
| audit before/after | 60 → 57 |
| all images load, 0 ≥400, same counts 14/1/2/1 | prod table above |
| click-nav | `/github (click)` 1/1 |
| 0 hydration (dev) | `hydration msgs: 0 []` |
| Comments per code-comments.md | N/A — no comments touched |

## Supersedes: none
(grep `#259` in active diagram → only this row)

## Noticed, not done
- On Vercel, @nuxt/image may auto-select the `vercel` provider instead of `ipx`; v2 changed the Vercel provider's format allow-list. Local checks can't exercise that — worth a look on the preview deploy of the PR.
- `npm install` `allow-scripts` warnings persist (npm install-script gate); sharp now works without its install script (no build warning).

## Seal gate
none — no commit/push/PR.

---

## Correction (added 2026-10-24 by the implementer of `deps-i18n-10`, #261)
The `## Output` claim above — `grep -i "sharp\|[@nuxt/image]"` on the build log → **no match** — was wrong in what it implied. The pattern `\[@nuxt/image\]` only matched lines prefixed `[@nuxt/image]`; @nuxt/image 2.2.0 introduced 12 build lines of a different shape that it missed:
` WARN  [plugin node-resolve] Could not resolve import "nuxt/server" in .../node_modules/@nuxt/image/dist/runtime/server/utils/image.js using exports defined in .../node_modules/nuxt/package.json.` + `"nuxt/server" is imported by ... but could not be resolved – treating it as an external dependency.`
Counts: v1 baseline build (`i0b.log`) 0 → v2 build (`i1b.log`) 12. Cause: v2's new server-side `useImage` util imports `nuxt/server`, an export that only exists in Nuxt 4 (Nuxt 3.21's `package.json` `exports` has no `server` key). Impact: none at runtime — `grep -r 'nuxt/server' .output/server` → no match (tree-shaken; the repo never calls server-side `useImage`). Goes away with #263 (Nuxt 4). The sharp-warning finding itself stands.
