# Visit tracking

- Status: draft
- Source: backfill from code
- Issues: #389, #398
- Anchors: `plugins/VisitTracker.client.ts`, `server/api/visit.post.ts`, `nuxt.config.ts` (`runtimeConfig.public.NODE_API` / `MY_EMAIL`)

## Goal
The site owner wants to know how many people open the resume site, and
from where. Every real page load records a visit on the resume backend
(`resume-nodejs-api`, feature `profile-visits`), and the visitor never
notices.

## Behavior
1. When a browser loads the app (first page of the session, any route),
   the client-only plugin sends one `POST /api/visit` to this app's own
   server. It does not run during SSR/ISR rendering and it does not run
   again on in-app (client-side) navigation.
2. The plugin call is fire-and-forget: no retry, and a failure is only
   logged in the browser console as `VISIT:TRACK -----`. The page renders
   the same either way.
3. The `/api/visit` server route relays the visit to
   `${NODE_API}/api/me/${MY_EMAIL}/visit` (`NODE_API`/`MY_EMAIL` from
   `runtimeConfig.public`, so `NUXT_PUBLIC_NODE_API` / `NUXT_PUBLIC_MY_EMAIL`
   override them at runtime) with header `x-forwarded-for: <visitor IP>`
   (from `getRequestIP(event, { xForwardedFor: true })`; header omitted if
   no IP), no body, 5s timeout, no retry.
4. `/api/visit` always answers 204 with no body, whatever the backend
   did. Any backend failure (timeout, network, 4xx/5xx incl. rate limit
   429) is only logged on the server as `VISIT:TRACK -----`.
5. The relay exists because the backend sends no CORS headers; the
   browser never calls the backend directly.
6. What the backend does with the call (its `profile-visits` doc, repo
   `resume-nodejs-api`): uses the leftmost `x-forwarded-for` entry as the
   visitor IP, looks up geo location from it, and stores at most one visit
   per IP per candidate per 24h. A repeat inside 24h, or a call for a
   private profile (404), stores nothing; a repeat still answers 200, so
   this app logs nothing for it.
7. When the app runs locally — `npm run dev` or `npm run preview` — no
   visit is recorded: the backend's `/visit` endpoint receives no call
   from that run. This is intentional (local runs would otherwise land in
   the production stats under a loopback IP) and is written down in a
   code comment next to the skip and in root `CLAUDE.md`. Deployed
   (production) builds keep Behavior 1-6 unchanged.

## Acceptance criteria
- (#389) `npm run dev` with `NODE_API` and `NUXT_PUBLIC_NODE_API` set to a logging mock, then a browser load of `/`, `/projects`, `/contact`, `/github`, `/blogs` → the mock logs 0 `POST /api/me/<MY_EMAIL>/visit`; no console error in the browser.
- (#389) Same check against `npm run preview` (production build served locally) → mock logs 0 visit POSTs.
- (#389) The skip has a one-line WHY code comment, and root `CLAUDE.md` states that local runs (dev/preview) never record visits.
- (#389) The implementer's evidence note names the root cause of the original report from a real local run (server log `VISIT:TRACK` lines and the runtime `NODE_API` host), not from reasoning.
- `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test` all clean (`doctrine/MEMORY.md`).
- On a deployed (non-local) build: browser load of `/`, `/projects`, `/contact`, `/github`, `/blogs` → each shows exactly one `POST /api/visit` (same origin) in the network log, no request straight to the backend `/visit`, and no console error.
- Relay contract (deployed build, or however the implementer exercises the non-local path without hitting the real backend) against a mock backend (`NODE_API` and `NUXT_PUBLIC_NODE_API` both set to the mock, server log has 0 `onrender` hits): one `POST /api/visit` with incoming `x-forwarded-for: 203.0.113.7` → response 204, and the mock logs exactly 1 `POST /api/me/<MY_EMAIL>/visit` with `x-forwarded-for: 203.0.113.7`.
- Mock answers 500, or takes more than 5s → `/api/visit` still answers 204, mock logs exactly 1 call, server log shows 1 `VISIT:TRACK` line.
- Client-side navigation between pages after the first load → no further `POST /api/visit`.

## Edge cases
- Local run (`npm run dev` / `npm run preview`), even with `.env` `NODE_API` pointing at the real backend → nothing reaches the backend (Behavior 7). Before #389 such runs sent loopback-IP visits into production stats, deduped to one per 24h with empty location, so the count looked frozen.
- The relay criteria above must stay checkable without calling the real backend (user rule): the implementer's evidence must show how the non-local path was exercised against a mock.
- Backend rate limit (shared with production) hit → backend 429, relay 204, server log `VISIT:TRACK`.
- `NODE_API` or `MY_EMAIL` unset → relay POSTs to `undefined/api/me/undefined/visit`, fails, logs, still 204.
- Behind Vercel, `getRequestIP(..., { xForwardedFor: true })` takes the incoming `x-forwarded-for`, which a client can set itself; the backend accepts a forged IP by design (its own doc). Whether production records the real IP and geo is #398.
- Ad blocker / failed `/api/visit` → console log only, page unaffected.

## Out of scope
- Showing visit counts or stats on this site (the backend's owner endpoints do that).
- Bot filtering, consent/privacy notice, authentication of the relay (anyone can POST `/api/visit`, same as the backend endpoint).
- Backend dedup, geo lookup, IP choice — owned by `resume-nodejs-api` `profile-visits`.
- Known gap, tracked separately (not #389/#398): the app sends no `{ referrer, profile }` body, so the backend stores every visit with `referrer: null`, `profileId: null`.

## Open questions
1. (#389) What should a local run (dev/preview) do with visits? → **Answer (operator 2026-11-17):** (a) record nothing, documented as intentional — Behavior 7.
2. Should the relay/plugin send the backend's optional `{ referrer, profile }` body? → **Answer (operator 2026-11-17):** separate issue, out of scope for #389/#398 — noted under Out of scope.

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-17 | Backfilled from code | analyst backfill for #389 | - |
| 2026-11-17 | Operator answers: local runs record no visits (Behavior 7, #389 criteria); referrer/profile body = separate known gap | operator answer round 1 | - |
