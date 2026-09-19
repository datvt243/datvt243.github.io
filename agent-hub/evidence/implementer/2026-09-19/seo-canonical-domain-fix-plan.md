# 2026-09-19 — seo-canonical-domain-fix (implementer plan)

- Worker: implementer
- Node: `seo-canonical-domain-fix` (new, `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: fix the 4 critical items from the `.claude/review.md` portfolio audit
  (published as an artifact this session) — this node covers item 1.

## Diagram check
Reused this session's `/boot` read of `NORTHSTAR.md`/root `CLAUDE.md`/
`doctrine/MEMORY.md`/`doctrine/domains/PROJECT.md`/the dev-loop diagram
(unchanged since, `git status --short` clean before this pass started). No
PENDING node matches this task — created 4 new nodes per `pick_next.md`'s
"no diagram match yet" branch, appended at the END of the PM status table.

## Acceptance criteria (from the audit + operator's domain choice)
1. `nuxt.config.ts`'s i18n `baseUrl`, `server/routes/sitemap.xml.ts`,
   `server/routes/rss.xml.ts` all independently hardcoded
   `https://datvt243.github.io` — a domain that serves an unrelated leftover
   static page, not this app. Operator confirmed via AskUserQuestion: use
   `https://resume-nuxt-vert.vercel.app` (the real live deployment per
   README) as the canonical origin.
2. Fix as one shared constant, not 3 independently hardcoded copies, so it
   can't drift out of sync again.
3. Build clean + lint clean; no visual/behavior change expected (server-only
   string constants + one static-config field), so no CDP check required for
   this node specifically — confirmed anyway via live `curl` since it's
   trivial to check.

## Env vars
Added one new optional var, `SITE_URL` — documented in root `CLAUDE.md`.
Defaults to the correct production domain if unset, so no `.env` change is
required for this to work.
