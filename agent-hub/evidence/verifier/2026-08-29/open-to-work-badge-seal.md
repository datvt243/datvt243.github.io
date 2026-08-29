# 2026-08-29 — open-to-work-badge (verdict)

- Worker: verifier
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `open-to-work-badge`
- New PM status: **SEALED** (from IN_PROGRESS)
- Source: `agent-hub/evidence/implementer/2026-08-29/open-to-work-badge-{plan,diff}.md`

## NeverVerifyOwnWork
This is the same Claude Code conversation that ran the implementer pass.
Per the project's own `/todo` design (`.claude/skills/todo/SKILL.md`: "vẫn
chạy 2 lượt tách biệt bên trong, không phá vỡ NeverVerifyOwnWork"), running
both passes in one session is sanctioned as long as this pass doesn't carry
forward the implementer's reasoning and instead independently reproduces
the evidence. Done below: fresh build/lint run, fresh mock server on new
ports, fresh separately-written CDP script — none reused from the
implementer pass.

## Reasoning
| # | Criterion | Cited evidence | Met? |
|---|---|---|---|
| 1 | `GeneralInformation.openToWork: boolean` | Note's diff hunk for `types/resume-document.ts`; independently re-ran `git diff -- types/resume-document.ts` — identical hunk, `openToWork: boolean` present | ✅ |
| 2 | `HeroModel.openToWork` defaults `false` | Note's diff hunk for `models/Hero.ts`; independently re-ran `git diff -- models/Hero.ts` — identical hunk | ✅ |
| 3 | `ResumeAdapter.toHero()` maps via `Boolean(...)` | Note's diff hunk for `utils/ResumeAdapter.ts`; independently re-ran `git diff -- utils/ResumeAdapter.ts` — identical hunk, `Boolean(generalInformation.openToWork)` | ✅ |
| 4 | Badge shows only when `true`, fully absent (not just hidden) when `false` | Independently re-verified below via a fresh CDP script — `domCheck.found: true` (mocked `true` case) vs `domCheck.found: false` (real production `false`/absent case) | ✅ |
| 5 | No i18n regression on this branch | Independently re-ran `git diff -- themes/portfolio-dev/pages/resumeObject/Hero.vue` — no `useI18n`/`t(` import added, badge text is plain `"Open to work"` matching the file's existing un-translated strings | ✅ |
| 6 | Build/lint clean, 0 new warnings vs. baseline | Independently re-run below, exact match | ✅ |
| 7 | Real UI check, 0 console errors | Independently re-run below with a fresh script | ✅ |

## Independent re-verification the verifier ran directly
- `git status --short` (before any verifier action) → exactly the file set
  the note's diff table lists (`models/Hero.ts`, `themes/portfolio-dev/
  pages/resumeObject/Hero.vue`, `types/resume-document.ts`, `utils/
  ResumeAdapter.ts`), plus `agent-hub/haven/diagrams/dev-loop.prime-
  mermaid.md` (PM status) and the new untracked `agent-hub/evidence/
  implementer/2026-08-29/` dir. No other file touched.
- `git diff -- agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` showed
  only the new `open-to-work-badge` row appended between `giscus-live-fix`
  and the closing LAI-13 note — every prior SEALED row's text is
  byte-for-byte untouched (`LAI-13` honored, confirmed via `grep -c "^-"`
  on the diff = 1, i.e. exactly one line removed: the blank separator line
  re-added after the new row, not a deletion of existing content).
- Confirmed branch `feature/84` (`git branch --show-current`), matching the
  note.
- Independently re-read every touched file's `git diff` — all 4 hunks are
  byte-for-byte identical to what the note's `## Diff` section quotes; no
  undisclosed extra changes anywhere in the working tree.
- Re-ran `rm -rf node_modules/.cache .nuxt .output && npm run build`
  independently (full cold cache) → exit `0`. Grepped the full log
  case-insensitively for `error|warn` — only the pre-existing
  `[@nuxtjs/i18n] WARN bundle.optimizeTranslationDirective...` line,
  unrelated to this diff (present on the codebase before this task).
- Verified machine default Node is `v20.18.0`; `v24.19.0` already
  installed via `nvm` (documented trap: `eslint-flat-config-utils` needs
  ≥21). Ran `npm run lint` independently under `nvm use 24` →
  verbatim `✖ 34 problems (0 errors, 34 warnings)` — exact match to the
  note's claimed baseline. None of the 34 warnings are in any file this
  diff touched.
- Chrome CDP: confirmed already running on port 9888 (`curl -s
  http://localhost:9888/json/version` → JSON, reused per doctrine, not
  relaunched).
  - Independently re-fetched the real production payload
    (`curl https://nodejs-resume-api-ts.onrender.com/api/me/
    votan.it@gmail.com`) → confirmed `openToWork` key absent from
    `data.generalInformation`, matching the note's claim about the
    backend not being deployed yet.
  - Built a fresh mock payload (`/tmp/verifier-mock-resume.json`, own
    Python one-liner, not reusing the implementer's `/tmp/mock-resume.
    json`) — same real payload with `openToWork` flipped to `true`.
  - Wrote a fresh, separately-authored `.tmp-verifier-mock-api.mjs` (own
    script, not copied from the implementer's) serving that payload on
    port `4601` (implementer used `4501` — different port, no reuse).
  - Started two independent preview instances on ports `3910`/`3911`
    (implementer used `3902`/`3903`) via `NUXT_PUBLIC_NODE_API`/
    `NUXT_PUBLIC_MY_EMAIL` env overrides — one pointed at the fresh mock
    (`true` case), one at real production (`false`/absent case).
  - Wrote a fresh `.tmp-verifier-check.mjs` (own script) that connects via
    `puppeteer.connect({browserURL: 'http://localhost:9888'})`, does a
    real `page.goto` (`networkidle0`) against each port, and searches the
    live DOM via `page.evaluate` + `getComputedStyle` (stronger check than
    the implementer's — reads real computed CSS, not just text presence).
  - Verbatim result:
    ```json
    {
      "true_case_mocked": {
        "domCheck": { "found": true, "inDom": true, "display": "inline-flex", "color": "rgb(74, 222, 128)", "hasGreenDot": true },
        "consoleErrors": [],
        "finalUrl": "http://localhost:3910/"
      },
      "false_case_real_production": {
        "domCheck": { "found": false },
        "consoleErrors": [],
        "finalUrl": "http://localhost:3911/"
      }
    }
    ```
  - `rgb(74, 222, 128)` is exactly Tailwind v3's `green-400` — confirms the
    badge really renders with the intended `text-green-400` styling, not
    just present-but-unstyled markup.
  - `domCheck.found: false` on the real-production page confirms the
    element is genuinely absent from the DOM (the `page.evaluate` search
    matched nothing), not merely `display:none`.
  - `consoleErrors: []` on both pages.
- Cleanup: both preview processes and the mock API server killed (own
  PIDs, tracked in `/tmp/verifier-pids.txt`), confirmed via `ps aux | grep`
  no stray listeners remained. Both temp scripts
  (`.tmp-verifier-mock-api.mjs`, `.tmp-verifier-check.mjs`) deleted.
  `git status --short` re-checked after cleanup — identical to before,
  only the diff's real file set plus the untracked evidence dirs.

## Forbidden states scan
| State | Hit? | Note |
|---|---|---|
| `ADHOC_WORK` | No | New node `open-to-work-badge` on the diagram, traces to issue #84, branch `feature/84` |
| `NO_EVIDENCE` | No | Full plan + diff notes present, matching the real diff |
| `EDIT_UNVERIFIED` | No | Build/lint independently re-run from cold cache + real CDP evidence independently re-run with a fresh script/mock/ports, all matching the note's claims |
| `CODE_IN_HAVEN` | No | Only `haven/diagrams/dev-loop.prime-mermaid.md` (PM status text, not code) touched in `haven/` |
| `DIAGRAM_DRIFT` | No (after this seal) | PM status updated to match below |

## Visual/behavior check
Full independent re-run, fresh script/mock server/ports, real Chrome CDP,
real production data for the negative case — reproduced the note's claim
exactly, with a stronger check (`getComputedStyle` color, not just text
match).

## Proportionality
Diff is 4 small, targeted hunks (1 interface field, 1 model field, 1
adapter line, 1 template block) — no unrelated refactor, no rename, no
opportunistic i18n work pulled in from the unmerged `feature/80`. Matches
`SmallestDiff`.

## Seal gate
None recorded, none needed — no commit/push/PR happened in either pass;
`git status` shows only working-tree changes on `feature/84`.

## Missing
None — no REOPEN.
