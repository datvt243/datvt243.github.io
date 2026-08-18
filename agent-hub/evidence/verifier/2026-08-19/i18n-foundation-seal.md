# 2026-08-19 — i18n-foundation (verdict)

- Worker: verifier
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `i18n-foundation`
- New PM status: **SEALED** (from IN_PROGRESS)
- Source: `agent-hub/evidence/implementer/2026-08-19/i18n-foundation-{plan,diff}.md`

## Reasoning
| # | Criterion | Cited evidence | Met? |
|---|---|---|---|
| 1 | `@nuxtjs/i18n` in `dependencies`, in `modules`, correct major version | Cited, including the real v10 build failure and its root cause | ✅ (independently re-confirmed below) |
| 2 | `locales`/`defaultLocale`/`strategy` config | Cited | ✅ (independently re-confirmed below) |
| 3 | `vi.json`/`en.json` catalogs | Cited | ✅ (files exist, referenced by config) |
| 4 | `Header`/`Footer` use `$t`/`useI18n()` | Cited | ✅ (independently re-run CDP below) |
| 5 | Language switcher | Cited | ✅ (independently re-run CDP below) |
| 6 | Build/lint clean | Cited, including 3 real bugs caught and fixed | ✅ (independently re-run below, including a full cache wipe) |
| 7 | CDP: root=vi unprefixed, switch→`/en`, nav preserves prefix, 0 errors | Cited, exact JSON | ✅ (independently re-run below, bit-for-bit match) |
| 8 | Nav labels / per-page content not translated | `app.config.ts` untouched | ✅ (independently re-confirmed below) |

Independent spot-checks the verifier ran directly (fact-checking specific
citations against the real repo state, not re-deriving judgment from the
diff):
- `git status --short` → exactly the file set the note claims (`package.
  json`/`package-lock.json`, `nuxt.config.ts`, `Header.vue`, `Footer.vue`,
  diagram, plus new `i18n/` dir and evidence dir) — no extra/missing
  files, confirming `SmallestDiff` proportionality for a foundation node.
- `git diff --stat app.config.ts` → empty — independently confirms nav
  tab labels (`_resume.ts` etc.) were correctly left untranslated, as
  claimed.
- `grep "@nuxtjs/i18n" package.json` → `"^9.5.6"` — confirms the disclosed
  version pin is real, not just narrated.
- `npm view @nuxtjs/i18n@10.6.0 dependencies.@nuxt/kit` → `^4.5.1` —
  independently confirms the v10 incompatibility root cause (Nuxt-4-
  targeted kit) is real, not a fabricated excuse for a version pin.
- Re-ran `rm -rf node_modules/.cache .nuxt .output` + `npm run build`
  independently (full cold cache, not reusing the implementer's build
  artifacts) → clean, `Σ Total size: 28.5 MB (10.3 MB gzip)`, exit 0 —
  matches the note's cited tail even from a cold cache.
- Re-ran `npm run lint` independently → `✖ 34 problems (0 errors, 34
  warnings)`, exact match to session baseline; grepped specifically for
  `Header.vue`/`Footer.vue` → 0 matches, confirming 0 new lint problems.
- Independently started a fresh preview server and ran an independently-
  written `puppeteer-core` script (not copy-pasted) exercising the exact
  same 4-step sequence (load `/`, click switcher, click a nav tab, click
  switcher again): result
  `{"initial":{"url":"/","footer":"Tìm mình ở:..."},"afterToggle":{"url":"/en","footer":"find me in:..."},"afterNavClick":{"url":"/en/projects"},"afterToggleBack":{"url":"/projects","footer":"Tìm mình ở:..."},"consoleErrors":[]}`
  — bit-for-bit matches the implementer's cited numbers, independently
  reproduced.
- Independently re-ran `npm audit` → `52 vulnerabilities (4 low, 8
  moderate, 34 high, 6 critical)` — exact match to the note's cited
  number (the note's own before/after stash comparison was itself already
  disclosed as independently re-verified by the implementer; this
  verifier re-confirmed the "after" side matches the current tree).
- Preview server + temp script cleaned up after verification, no
  lingering process; `git status` after cleanup shows no stray files.

## Forbidden states scan
| State | Hit? | Note |
|---|---|---|
| `ADHOC_WORK` | No | Node created via `pick_next`'s documented failure branch; task's inherent ambiguity was resolved via `AskUserQuestion` BEFORE implementation started, not guessed |
| `NO_EVIDENCE` | No | Full plan + diff notes present, including 3 disclosed real bugs |
| `EDIT_UNVERIFIED` | No | Verbatim build/lint (independently re-run from a cold cache and matched) + real CDP evidence (independently re-run and matched bit-for-bit) |
| `CODE_IN_HAVEN` | No | Only the diagram `.md` in `haven/` |
| `DIAGRAM_DRIFT` | No (after this seal) | PM status updated to match below |

## Visual/behavior check
Concrete and unusually thorough for a foundation node: 3 separate real
bugs were caught live (wrong major version, unwanted auto-redirect,
locale-prefix-dropping nav links) rather than assumed away — each fix is
independently verifiable and was independently re-verified here, not
just narrated.

## Seal gate
None recorded, none needed — no commit/push/PR happened in this
implementer pass; `git status` shows only working-tree changes on
`feature/75`.

## Proportionality
This node deliberately scoped itself to chrome-only (Header/Footer) per
the operator's own narrowed answer in `AskUserQuestion`, explicitly
declining to translate nav labels (correctly recognized as filename-style
UI, not prose) and per-page content (recorded honestly as "Noticed, not
done" rather than silently expanding scope or silently skipping). This is
exactly the right size for a "foundation" node given the precedent
(`resume-data-models` → `resume-adapter-class` split) already established
in this diagram.

## Missing
None — no REOPEN. The two disclosed "Noticed, not done" items (per-page
translation, `useLocaleHead()` for `<html lang>`) are legitimate scope
boundaries for a foundation node, not gaps in this node's own acceptance
criteria.
