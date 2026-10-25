# 2026-10-24 - deps-i18n-10 (plan)

- Worker: implementer · Version: 0.1.0
- Node: `deps-i18n-10` (new row appended before the install; slug grepped → 0 hits)
- Task: `/todo`-flow "tiếp tục nhóm B" → issue #261 "chore(deps): Phase 3.4 — retry @nuxtjs/i18n 9→10 on Nuxt 3.21" (https://github.com/datvt243/datvt243.github.io/issues/261), branch `feature/261` off `staging` @ `7ec2b12`.

## Hub bytes before: 77958

## Research
- `npm view "@nuxtjs/i18n@^10" version` → `10.6.0`; module meta `compatibility.nuxt: ">=3.0.0-rc.11"`.
- #75's failure (`i18n-foundation`, archive): 10.x threw `Cannot use 'import.meta' outside a module` on Nuxt **3.13.2**; repo is now 3.21.11.
- v9→v10 migration guide (https://i18n.nuxtjs.org/docs/guide/migrating): removed `lazy`, `bundle.optimizeTranslationDirective`, `experimental.generatedLocaleFilePathFormat`, `useLocaleHead({ key })`, `onLanguageSwitched`/`onBeforeLanguageSwitch`, `$resolveRoute`/`$localeLocation`; `restructureDir` fixed to `'i18n'`; vue-i18n 11 (`$tc`/`tc`/`v-t` gone or deprecated).
- Repo: config uses `locales[].file`, `langDir: 'locales'` (files live in `i18n/locales/` ✓ restructureDir), string `baseUrl`, `detectBrowserLanguage: false`, `strategy: 'prefix_except_default'`; `git grep` for every removed API/option → 0 hits. → no config/code change expected.

## Baseline (i18n 9.5.6, prod build port 4061)
- build rc=0 with `[@nuxtjs/i18n]  WARN  bundle.optimizeTranslationDirective is enabled by default...`; audit `52 vulnerabilities (1 low, 2 moderate, 46 high, 3 critical)`
- SSR head (`scratchpad/i18n/head.sh`: html lang, hreflang alternates, canonical, og:locale(+alternate), title) for 10 routes → `scratchpad/i18n/v9-head.txt` (110 lines)

## Blockers
none
