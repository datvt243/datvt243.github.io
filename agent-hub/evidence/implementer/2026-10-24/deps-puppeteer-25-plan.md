# 2026-10-24 - deps-puppeteer-25 (plan)

- Worker: implementer · Version: 0.1.0
- Node: `deps-puppeteer-25` (new row appended; slug grepped in both diagram files → 0 hits)
- Task: `/todo` "xử lý nhóm A" → issue #260 "chore(deps): Phase 3.3 — puppeteer-core 23→24/25 + @sparticuz/chromium pairing (research)" (https://github.com/datvt243/datvt243.github.io/issues/260), branch `feature/260` off `staging` @ `603f1e1`, separate git worktree `scratchpad/wt-260`.

## Hub bytes before: 76703

## Process deviation (disclosed)
`NodeBeforeCode` was violated: `npm install puppeteer-core@~25.11.0` ran BEFORE this node row was appended. Research + baseline were done first, the node row and this plan were written right after the install, before writing evidence. No other file was touched before the node existed.

## Research (live, 2026-10-24)
- Chrome revision per `puppeteer-core` version (from each tarball's `revisions.js` `chrome:`): 23.8.0 → `131.0.6778.69`; 24.43.1 → `148.0.7778.97`; 25.6.0 → `151.0.7922.77`; 25.8.0 → `152.0.7977.42`; 25.10.0 → `152.0.7977.75`; **25.11.0 → `153.0.8010.36`**; 25.12.0 → `154.0.8037.57`; 25.16.0 (latest) → `156.0.8078.47`.
- `@sparticuz/chromium`: latest = `153.0.0` (what the repo has). Its README: "not tied to specific puppeteer versions ... To determine which version of @sparticuz/chromium you need, visit the Puppeteer Chromium Support page" → match majors.
- ⇒ target `puppeteer-core@~25.11.0` (`npm view "puppeteer-core@~25.11.0" version` → `25.11.0`), keep `@sparticuz/chromium@^153.0.0`. Latest 25.16 would be Chrome 156 — 3 majors ahead of the newest sparticuz build.
- Current state was already mismatched: puppeteer 23.8.0 (Chrome 131) + sparticuz 153.
- Node: `puppeteer-core@25` engine `node >=22.12.0`; repo `package.json` `engines.node ">=24"`, `.nvmrc` 24, local v24.19.0.
- Breaking changes v24.0.0/v25.0.0 (`gh api repos/puppeteer/puppeteer/releases`): removed Firefox-over-CDP, deprecated Launch/Connect options, `Puppeteer.product`, `MouseOptions.clickCount`, `Browser.isConnected()`, Cookie `sameParty`, webdriver wrappers. `server/api/generate-pdf.ts` uses only `launch({ executablePath, args })`, `newPage`, `setContent`, `pdf({ format, printBackground, margin, tagged })`, `close` → none affected.
- Headless: `chromium.args` already contains `--headless='shell'`; both v23 and v25 `ChromeLauncher.defaultArgs` push `--headless=new` first and `...args` LAST, so the sparticuz flag keeps winning — unchanged behavior, no code change needed.
- v25 ships ESM only (`lib/puppeteer`, no `lib/cjs`); Nitro bundles server code → verify by build.

## Baseline (v23.8.0, prod build port 4011, system Chrome 155.0.8059.85 via darwin fallback path)
- build rc=0, typecheck rc=0, eslint 0 problems, audit `60 vulnerabilities (1 low, 3 moderate, 52 high, 4 critical)`
- `GET /api/generate-pdf?lang=vi` → `http=200 type=application/pdf bytes=160795`, `%PDF-1.4`, 3 `/Type /Page`
- `GET /api/generate-pdf?lang=en` → `http=200 type=application/pdf bytes=155689`, `%PDF-1.4`, 3 pages
- both `Content-Disposition: attachment; filename="votan.it_gmail.com.pdf"`

## Files
`package.json`, `package-lock.json`, `agent-hub/doctrine/domains/PROJECT.md` (Traps row), diagram row.

## Blockers
Vercel (Linux, sparticuz binary) path can't be exercised locally — needs a preview deploy, which needs a push (seal gate). Tracked as Still open, not claimed.
