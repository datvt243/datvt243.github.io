# GitHub profile and repositories

- Status: verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/github-profile-spec.md`
- Source: backfill from code
- Issues: #436
- Anchors: `pages/github.vue`, `server/api/github.ts`, `server/utils/fetchGithub.ts`, `themes/portfolio-dev/pages/github/Index.vue`, `themes/portfolio-dev/pages/github/GitUser.vue`, `themes/portfolio-dev/pages/github/GitRepos.vue`, `themes/portfolio-dev/pages/github/part/Item.vue`, `themes/portfolio-dev/components/FilterFolder.vue`, `composables/debounceRef.ts`

## Goal
Visitors see the owner's GitHub profile and his own public repositories,
filterable by language and searchable by name.

## Behavior
1. `/github` and `/en/github` are ISR-cached 60s and call `/api/github`
   (no retry). A fetch error throws a fatal 502 "Unable to load GitHub data".
2. `/api/github` fetches `users/${GITHUB_USER}` and
   `users/${GITHUB_USER}/repos?sort=pushed&per_page=100` in parallel, removes
   forks, and caches the result 12 days (bypassed in dev).
3. With `GITHUB_TOKEN` set it sends `Authorization: token …`; on 401, or on a
   403 that is not a rate limit (`x-ratelimit-remaining` ≠ `0`), it retries
   once without the token. A real rate-limit 403 or any other error is
   thrown. Without a token it calls unauthenticated.
4. Sidebar: avatar, name linking to the GitHub profile (new tab), login, bio (line
   breaks normalized), location when present, followers · following counts.
5. Sidebar filter: languages of the shown repos, unique and sorted. Selected
   languages filter repos to those whose language is one of them (OR); repos
   without a language are hidden while a filter is active.
6. Search box (shortcut `/`) filters repo names by case-insensitive substring,
   500ms debounced, applied after the language filter. No repo left → a
   localized "no repositories match" message.
7. Each repo row: name (new tab), visibility badge, website link (when
   `homepage`) and source link icons, description, topic badges, language
   with a color dot (known colors for Vue/JavaScript/TypeScript/Python/CSS/
   SCSS/HTML/Lua/Pug, else grey), stars and forks when non-zero, and
   "updated on <date>" from `pushed_at`, formatted in the current locale
   (`vi-VN` / `en-US`, UTC calendar date).

## Acceptance criteria
- `npm test` passes, including `tests/fetchGithub.test.ts`.
- `curl -s <host>/api/github | jq '[.data.repos[].fork] | any'` prints
  `false`.
- On `/github`, pressing `/` focuses the search; typing a repo name's
  substring leaves only matching repos after ~0.5s.
- Selecting a language in the sidebar shows only repos with that language.

## Edge cases
- Token rejected (401) → page still loads with unauthenticated data.
- Rate-limited (403 + remaining 0) → `/api/github` errors → 502 error page.
- More than 100 repos → only the 100 most recently pushed are fetched.

## Out of scope
- Private repos, forks, pagination beyond 100.

## Open questions
1. `GitUser.vue` uses `v-if="props.user || Object.keys(props.user).length"` —
   the `||` makes the "no data" branch effectively unreachable (and would
   throw on `null`). Was `&&` intended? → **Answer (operator 2026-11-07):** Bug: `&&` — #436
2. Name search is case-sensitive (`name.includes(search)`). Intended? → **Answer (operator 2026-11-07):** Bug: case-insensitive — #436
3. "Updated on" date is always formatted `en-US` (UTC), even in Vietnamese.
   Intended? → **Answer (operator 2026-11-07):** Bug: format by locale — #436
4. No empty state when search/filter matches nothing (blank list). Wanted? → **Answer (operator 2026-11-07):** Bug: add one — #436
5. The profile-name link opens in the same tab while repo links open a new
   tab. Intended? → **Answer (operator 2026-11-07):** Change: new tab — #436

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
| 2026-11-07 | Operator confirmed Behavior + answered all open questions; Status → verified | analyst backfill re-check, see `evidence/analyst/2026-11-07/github-profile-spec.md` | - |
| 2026-11-08 | Behavior #4 profile link new tab; #6 case-insensitive search + empty state; #7 date by locale (also fixes the `||` no-data guard) | operator answers to Open questions 1-5 (2026-11-07) | `github-page-fixes` |
