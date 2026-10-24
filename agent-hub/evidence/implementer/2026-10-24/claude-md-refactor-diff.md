# 2026-10-24 - claude-md-refactor (diff)

- Worker: implementer · Version: 0.1.0
- Node: `claude-md-refactor` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task (verbatim): "ok, refactor CLAUDE.md theo đề xuất đó đi" → issue #252, branch `feature/252`
- Status: `sealed_pending_verifier`

## Hub bytes before
76704

## Diff
| File | Why |
|---|---|
| `CLAUDE.md` | Rewritten: 232 → 130 lines (12978 → 5674 bytes). Added lint/lint:fix/typecheck to Commands + "no test suite" verify line; added `/projects` row (no routeRule, `useResumeStore` — confirmed `themes/portfolio-dev/pages/projects/Index.vue:10`); Server API paragraph → bullets; theme detail replaced by a 3-bullet "UI layer" section pointing to `.claude/rules/theme.md`; changelog lines (2026-08-16 / 2026-08-30 / "previously feature/* kept forever") removed, replaced by a pointer to PROJECT.md's Decisions table; `/ship`/`/release` behavior details dropped (skills self-describe); Giscus 3-step setup moved to an HTML comment. |
| `.claude/rules/theme.md` (new, 78 lines) | Theme structure, color mode, Dracula editor palette, KeyNav — content of the old "UI Theme" section, bulleted, with `paths:` frontmatter (`themes/**`, `pages/**`, `app.vue`, `tailwind.config.js`) so it loads only when those files are touched. |
| `.gitignore` | `.claude/*` was ignored except commands/skills → added `!.claude/rules/` (verified: `git check-ignore .claude/rules/theme.md` rc=0 before, rc=1 after). Comment updated to say "commands/skills/rules". |
| `agent-hub/doctrine/domains/PROJECT.md:16` | Repointed "see the "UI Theme" section of root `CLAUDE.md`" → `.claude/rules/theme.md`. |
| `themes/portfolio-dev/tokens.css:2` | Same repoint in the header comment. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | New node row appended at end (`AppendOnly`). |

Inbound refs checked via grep: `README.md:142` → "Agent-Hub" section (kept, heading now "Agent-Hub (`agent-hub/`) & git workflow"); `themes/portfolio-dev/pages/post/Comments.vue:15` "see root CLAUDE.md" for Giscus steps (still true — HTML comment in root CLAUDE.md).

## Command
```
npm run build
npm run lint
npx nuxi typecheck
wc -l CLAUDE.md .claude/rules/theme.md
```

## Output
- `npm run build` → rc=0, tail: `[nitro] ✔ You can preview this build using node .output/server/index.mjs` / `└  ✨ Build complete!`
- `npm run lint` → `> nuxt-app@1.4.1 lint` / `> eslint .`, no findings, rc=0
- `npx nuxi typecheck` → rc=0, `grep -c "error TS"` on its log = `0`
- `wc -l` → `130 CLAUDE.md`, `78 .claude/rules/theme.md`

Content-retention grep (each key fact of the old file, counted across new `CLAUDE.md` + `.claude/rules/theme.md`), all ≥1: `R G B`, `binary PDF`, `Vimium`, `theme-kbd`, `editor-scope`, `classSuffix`, `data-shortcut`, `localePath`, `ListRender`, `500ms`, `SITE_URL`, `DEPLOY_HOOK_URL`, `PUPPETEER_EXECUTABLE_PATH`, `GISCUS_REPO_ID`, `giscus/installations`, `Closes #`, `staging`, `histories`, `/browser`, `provide/inject`, `personalSkills`, `maxAge 12 days`, `onrender.com`, `menuPrimary`, `useColorMode`, `ACTIVE_THEME`, `` 1`–`5 ``.

## Browser verification
N/A — no visual change (docs + one comment line in `tokens.css`).

## Acceptance
| Criterion | Evidence |
|---|---|
| `CLAUDE.md` < 200 lines | `130 CLAUDE.md` |
| Traps/conventions/env vars retained | retention grep above, all ≥1 |
| Changelog lines removed | no `2026-08` / `previously` in new CLAUDE.md (old dates live in PROJECT.md Decisions rows 100–102) |
| Commands list lint/lint:fix/typecheck | new Commands block |
| Giscus steps as HTML comment | `<!-- Giscus one-time operator setup ... -->` in CLAUDE.md |
| Inbound refs repointed | PROJECT.md:16 + tokens.css:2 lines above |
| build/lint/typecheck no new errors | rc=0 ×3, 0 `error TS` |
| Comments per code-comments.md | only changed source comment is `tokens.css:2` — still a pointer to docs (Keep: "links to docs"), no `(#N)` refs |

## Supersedes: none
(grep `#252` in active diagram → only this row)

## Noticed, not done
- `.claude/rules/theme.md` only auto-loads in Claude Code builds that support path-scoped rules; nothing else depends on it.
- `.gitignore` had no trailing newline; it now ends with one (side effect of the line append, harmless).

## Seal gate
none — no commit/push/PR in this pass. `.gitignore` change is local only.
