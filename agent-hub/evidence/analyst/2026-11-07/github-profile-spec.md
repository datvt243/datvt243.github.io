# analyst — github-profile — 2026-11-07

## Task (verbatim)
document github-profile

## Doc
`agent-hub/doctrine/features/github-profile.md` (existing bulk-backfill draft, re-checked per recipe step 4, not rewritten)

## Sources read
- `agent-hub/haven/workers/analyst/SOUL.md`
- `agent-hub/haven/workers/analyst/recipes/spec_feature.md`
- `agent-hub/doctrine/features/INDEX.md`
- `agent-hub/doctrine/domains/PROJECT.md`
- `agent-hub/doctrine/MEMORY.md`
- `pages/github.vue`
- `server/api/github.ts`
- `server/utils/fetchGithub.ts`
- `themes/portfolio-dev/pages/github/Index.vue`
- `themes/portfolio-dev/pages/github/GitUser.vue`
- `themes/portfolio-dev/pages/github/GitRepos.vue`
- `themes/portfolio-dev/pages/github/part/Item.vue`
- `themes/portfolio-dev/components/FilterFolder.vue`
- `composables/debounceRef.ts`
- `nuxt.config.ts (routeRules)`
- `i18n/locales/en.json (github.*)`

## Re-check vs code
Behavior 1–7 match code. routeRules `/github`,`/en/github` `isr: 60`. Index.vue `useFetch('/api/github', { retry: 0 })`, error → fatal 502 "Unable to load GitHub data". API: `Promise.all` user + `repos?sort=pushed&per_page=100`, `!repo.fork` filter, `maxAge` 12 days, `shouldBypassCache: import.meta.dev`. `fetchGithub`: no token → plain `$fetch` retry 0; token → `Authorization: token …`; 401 or 403 with `x-ratelimit-remaining` ≠ `'0'` → retry unauthenticated; else rethrow. GitUser: avatar iff `avatar_url`, name link to `html_url` without target (Q5), login, bio CRLF-normalized, location iff present, followers · following; `v-if="props.user || Object.keys(props.user).length"` (Q1). Languages = unique sorted non-null; filter OR, repos without language dropped when active. GitRepos: `debouncedRef('', 500)`, `name.includes(search)` case-sensitive (Q2), `data-shortcut="/"`, no empty state (Q4). Item: name `_blank`, visibility, homepage/html_url icons, description, topics, language color map (9 langs, else `#8b8b8b`), stars/forks iff non-zero, `pushed_at` via `toLocaleDateString('en-US', { timeZone: 'UTC' })` (Q3). No discrepancy.

## Questions + answers
Operator (2026-11-07): "ok, behavior đúng" (Behavior section confirmed correct).
1. `GitUser.vue` uses `v-if="props.user || Object.keys(props.user).length"` —
   the `||` makes the "no data" branch effectively unreachable (and would
   throw on `null`). Was `&&` intended? → **Answer (operator 2026-11-07):** Bug: `&&` — #436
2. Name search is case-sensitive (`name.includes(search)`). Intended? → **Answer (operator 2026-11-07):** Bug: case-insensitive — #436
3. "Updated on" date is always formatted `en-US` (UTC), even in Vietnamese.
   Intended? → **Answer (operator 2026-11-07):** Bug: format by locale — #436
4. No empty state when search/filter matches nothing (blank list). Wanted? → **Answer (operator 2026-11-07):** Bug: add one — #436
5. The profile-name link opens in the same tab while repo links open a new
   tab. Intended? → **Answer (operator 2026-11-07):** Change: new tab — #436

## Result
status: verified — every open question answered + operator confirmed Behavior.
`Status: verified — confirmed by operator 2026-11-07, see evidence/analyst/2026-11-07/github-profile-spec.md` set in doc + INDEX row; Issues: #436. Behavior unchanged (describes code today; changes tracked by the issues).

## Isolation proof
Separate spawned agent (Agent tool), blank context. Received only the
dispatch prompt (5 tasks, operator's "ok, behavior đúng" confirmation, the
operator's answers + issue numbers). No implementer reasoning, no main
session transcript. All Behavior items re-checked by reading code myself.
