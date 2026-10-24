# 2026-10-24 - claude-md-refactor (plan)

- Worker: implementer · Version: 0.1.0
- Node: `claude-md-refactor` on `haven/diagrams/dev-loop.prime-mermaid.md` (new row, appended at end of PM status table; slug grepped in both diagram files → 0 hits)
- Task (verbatim): "ok, refactor CLAUDE.md theo đề xuất đó đi" — resolved to issue #252 (https://github.com/datvt243/datvt243.github.io/issues/252), branch `feature/252` off freshly pulled `staging`.

## Hub bytes before: 76704

## Acceptance criteria
1. `wc -l CLAUDE.md` < 200 (was 232 lines / 12978 bytes).
2. Every trap, convention and env var from the old file is still present in `CLAUDE.md` or `.claude/rules/theme.md` (theme detail moves there, `paths:`-scoped so it loads only when touching theme files).
3. Changelog-style lines ("as of 2026-08-30", "replaced … on 2026-08-16", "previously `feature/*` was kept forever") removed — history already lives in `doctrine/domains/PROJECT.md`'s Decisions table.
4. Commands section lists `npm run lint`, `npm run lint:fix`, `npx nuxi typecheck` (from `doctrine/MEMORY.md`).
5. Giscus 3-step operator setup kept, as a block-level HTML comment (stripped from Claude's context, still readable by humans; `Comments.vue`'s "see root CLAUDE.md" stays valid).
6. Inbound refs to the moved "UI Theme" section repointed: `agent-hub/doctrine/domains/PROJECT.md:16`, `themes/portfolio-dev/tokens.css:2`. `README.md:142` points at the "Agent-Hub" section, which is kept.
7. `npm run build` + `npm run lint` + `npx nuxi typecheck` — no new errors (docs-only change; typecheck errors, if any, must pre-exist).

## Files
- `CLAUDE.md`
- `.claude/rules/theme.md` (new)
- `agent-hub/doctrine/domains/PROJECT.md` (1 ref)
- `themes/portfolio-dev/tokens.css` (1 comment ref)

## Blockers
none — no env var needed for a docs change.
