# 2026-10-24 - deps-puppeteer-25 (diff)

- Worker: implementer · Version: 0.1.0
- Node: `deps-puppeteer-25` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: issue #260 (Phase 3.3 of #266), branch `feature/260` (worktree `scratchpad/wt-260`)
- Status: `sealed_pending_verifier` (local scope; Vercel preview = Still open)

## Hub bytes before
76703

## Diff
| File | Why |
|---|---|
| `package.json` | `"puppeteer-core": "^23.8.0"` → `"~25.11.0"` (via `npm install puppeteer-core@~25.11.0`). `~` on purpose: minor bumps change the Chrome major (see Traps row) |
| `package-lock.json` | Same install |
| `agent-hub/doctrine/domains/PROJECT.md` | New Traps row: keep puppeteer minor ↔ sparticuz major in lockstep |
| `haven/diagrams/dev-loop.prime-mermaid.md` | New node row appended |

No source change (`server/api/generate-pdf.ts` untouched — see plan's breaking-change + headless analysis).

## Command
```
npm install puppeteer-core@~25.11.0
npm ls puppeteer-core @sparticuz/chromium
grep -rhoE "chrome: ['\"][0-9.]+['\"]" node_modules/puppeteer-core/lib
npm run build ; npm run lint ; npx nuxi typecheck ; npm audit
curl /api/generate-pdf?lang=vi|en   (prod build, port 4012)
node scratchpad/cdp-pdf.cjs <worktree> http://localhost:4013
```

## Output
- `npm ls`: `├── @sparticuz/chromium@153.0.0` / `└── puppeteer-core@25.11.0`
- revisions: `chrome: '153.0.8010.36'` → matches sparticuz major 153
- `npm run build` → rc=0, `└  ✨ Build complete!`, no puppeteer error; `.output/server/node_modules/` contains `puppeteer-core`, `@puppeteer`, `chromium-bidi`, `@sparticuz`
- `npm run lint` → rc=0, 0 problems; `npx nuxi typecheck` → rc=0, 0 `error TS`
- `npm audit` → `55 vulnerabilities (1 low, 2 moderate, 49 high, 3 critical)` (60 → 55)
- `lang=vi http=200 type=application/pdf bytes=160795` · `%PDF-1.4` · 3 pages (baseline 160795 / 3)
- `lang=en http=200 type=application/pdf bytes=155689` · `%PDF-1.4` · 3 pages (baseline 155689 / 3)
- Byte compare v23 vs v25 after masking `(D:...)` dates: vi → `identical except CreationDate/ModDate`; en → same. (raw `cmp` differs at char 287 = `/CreationDate (D:20261024151821…)` vs `(D:20261024151951…)`)

## Browser verification
Prod build (port 4013), Chrome CDP :9888, `scratchpad/cdp-pdf.cjs`, viewport 1440×900, fresh server (in-memory PDF cache empty):
```
download button: BUTTON "Tải CV d"
response: 200 application/pdf content-length=160795 disposition=attachment; filename="votan.it_gmail.com.pdf" bytes=0 magic=
console issues: none
```
`bytes=0` = puppeteer can't read a fetch body the page already consumed into a blob; `content-length=160795` equals the curl'd vi PDF. Console filter excludes only the documented pre-existing `/visit` CORS error.

## Acceptance
| Criterion | Evidence |
|---|---|
| Pairing evidenced | revisions table in plan + `chrome: '153.0.8010.36'` |
| build/lint/typecheck clean | rc=0 ×3, 0 problems, 0 `error TS` |
| audit before/after | 60 → 55 |
| PDF vi/en 200, `%PDF`, same pages, identical but dates | Output above |
| Real button click → 200 PDF, 0 console errors | Browser verification above |
| Trap recorded | PROJECT.md Traps, new last row |
| Comments per code-comments.md | N/A — no source comments touched |

## Supersedes: none
## Still open
- Vercel preview deploy: `/api/generate-pdf` on the Linux + `@sparticuz/chromium` path can only run on Vercel; needs the branch pushed (outward-facing → seal gate). Check after `/ship`/PR: download CV on the preview URL.

## Noticed, not done
- `server/api/generate-pdf.ts` could follow the sparticuz README exactly (`headless: 'shell'` + `puppeteer.defaultArgs({ args: chromium.args, headless: 'shell' })`) instead of relying on arg ordering. Works today; would be a behavior-preserving cleanup.
- Latest puppeteer (25.16, Chrome 156) is ahead of the newest sparticuz (153) — bump again only when sparticuz ships a matching major.

## Seal gate
none in this pass (no push).
