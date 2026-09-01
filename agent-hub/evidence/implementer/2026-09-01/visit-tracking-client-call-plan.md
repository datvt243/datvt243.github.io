# 2026-09-01 — visit-tracking-client-call (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `visit-tracking-client-call` (new)
- Task (verbatim, operator): "backend vừa update API visit
  (/Users/_david/Workspace/Project/resume/resume-nodejs-api) hãy đọc qua
  và bổ sung API vào project này"

## Node exists? No — created new node `visit-tracking-client-call`.

## Investigation (before touching code)
1. `resume-nodejs-api` (separate repo, read-only for this session) has no
   "visit" work on `main`/`staging` yet — found on branch
   `feat/visit-tracking` (not merged into either), commit `dd18f60
   feat(candidate): add profile visit tracking (count, timestamp, geo, IP
   per candidate)`.
2. Read that branch's own evidence note in full
   (`resume-nodejs-api/agent-hub/evidence/implementer/2026-09-01/
   add-visit-tracking-diff.md`, via `git show feat/visit-tracking:...`) —
   this is the real contract, not guessed from the diff alone:
   - New **public, uncached** `POST /api/me/:email/visit` — deliberately
     NOT hung off the existing `GET /api/me/:email` because that route is
     wrapped in this app's own `defineCachedEventHandler` (12-day maxAge)
     — hooking onto it would undercount by orders of magnitude.
   - Backend resolves candidate by `:email`, extracts IP from the request
     that reaches it, geo-locates offline (`geoip-lite`), records one
     `Visit` doc.
   - Backend's own evidence explicitly flags: "Frontend call site
     (`datvt243.github.io` calling the new endpoint client-side on page
     load) is a separate repo/session — not touched here." i.e. this
     repo's half of the work was left for this session.
   - Also flagged (pre-existing, backend-side, out of this repo's scope):
     no `trust proxy` set on the Express app, so `req.ip` may resolve to
     the reverse-proxy's address rather than the real visitor IP once
     deployed on Render. Noted here, not fixable from this repo.
3. Confirmed this repo already has both values the call needs as PUBLIC
   runtime config (`nuxt.config.ts`): `runtimeConfig.public.NODE_API`,
   `runtimeConfig.public.MY_EMAIL` — no new env var needed.
4. Confirmed `feat/visit-tracking` is NOT yet merged/deployed on the
   backend (`git branch --contains feat/visit-tracking` → only itself);
   production `NODE_API` (`https://nodejs-resume-api-ts.onrender.com`,
   from this repo's own `.env`) does not have this route live yet. This
   repo's change is still correct to make now (matches the real, reviewed
   contract) but will 404 in production until the backend branch ships —
   disclosed, not hidden.

## Design decision: client-only, not server-proxied
Considered proxying through a new `server/api/visit.ts` (this app's own
Nitro server calling the backend). Rejected: the backend needs the REAL
visitor's IP/geo to reach it directly. A server-side proxy hop would only
ever forward this app's own Nitro server's IP (Render outbound IP), which
would make every recorded visit look identical and wrong — worse than
just calling the backend directly from the browser. Also would only fire
once per ISR cache window if triggered during SSR render, not once per
real visit. A `.client.ts`-suffixed Nuxt plugin (client-only, runs once
per real browser page load, never during SSR/ISR) avoids both problems.

## Blockers
None — `NODE_API`/`MY_EMAIL` already set (`.env`, confirmed present).

## Acceptance criteria
1. New client-only plugin fires exactly one `POST` to
   `${NODE_API}/api/me/${MY_EMAIL}/visit` per real page load (not during
   SSR/ISR render, not on every SPA route change).
2. Never blocks rendering or throws on failure (fire-and-forget, caught).
3. `npm run build` + `npm run lint` clean, no new warnings.
4. Real UI check via Chrome CDP — request fires with the correct URL,
   page still renders/functions even though the backend doesn't have the
   route live yet (expected 404, not a bug in this repo).
