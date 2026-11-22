# 2026-11-17 - claude-md-projects-isr (plan)
- Worker: implementer · Version: 0.1.0
- Node: `claude-md-projects-isr` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: `/todo #434` — "CLAUDE.md: /projects is ISR 60s, not "no routeRule"" (body: root `CLAUDE.md` says `/projects` has "none (no routeRule)", but `nuxt.config.ts` sets `isr: 60` for `/projects` and `/en/projects`. Expected: fix `CLAUDE.md` to match the config (the config is right).)

## Hub bytes before: 95190

## Feature doc: doctrine/features/projects.md
Behavior #1: "`/projects` and `/en/projects` are ISR-cached 60s". Open question 1 answered by operator 2026-11-07: "The config is right; fix CLAUDE.md — #434". Fix matches the doc; doc not edited.

## Acceptance
1. `CLAUDE.md` Pages & Caching `/projects` row reads `ISR 60s` (matches `features/projects.md` Behavior #1 and `nuxt.config.ts:156-157`).
2. `grep -rn "no routeRule"` (excl. node_modules/.nuxt/.output/evidence/histories) finds no stale claim — only the feature doc's answered question and this node's own row.
3. `npm run build` + `npm run lint` + `npx nuxi typecheck` + `npm test` clean.

## Anchors
- `CLAUDE.md:43`
- `nuxt.config.ts:156-157` (`'/projects': { isr: 60 }`, `'/en/projects': { isr: 60 }`)

## Acceptance criteria clarified: none (criteria written fresh on the new node)
