# 2026-10-18 - vim-key-nav (implementer plan)

- Worker: implementer · Version: 0.1.0
- Node: `vim-key-nav` (`haven/diagrams/dev-loop.prime-mermaid.md`, new row appended at the end of the PM status table, IN_PROGRESS)
- Issue: #236 https://github.com/datvt243/datvt243.github.io/issues/236 · Branch: `feature/236` (off `staging`)
- Task (verbatim): "tôi muốn xây dựng tính năng áp dụng nVIM, giúp thao tác nhanh di chuyển tới các mục porfolio thay vì phải dùng chuột"

## Hub bytes before: 149019
`/hub-tokens` script, "= per-session total" line. Measured after the one-line `Typecheck` row was added to `doctrine/MEMORY.md` (see below), before any code diff.

## pick_next
- No PENDING node existed (51/51 SEALED), so this is a new node per the "No diagram matches yet" branch.
- Blocker found and resolved: `implement.md` step 5 needs a `Typecheck` row in `doctrine/MEMORY.md` and there wasn't one. I asked the operator (AskUserQuestion). They chose "Add `npx nuxi typecheck`", so the row `| Typecheck | \`npx nuxi typecheck\` | repo root |` was added on this branch.
- Env vars: none needed (client-only feature).

## Acceptance (from issue #236)
1. `g`+key jumps to every `menuPrimary` route on any page, with locale-aware paths (`localePath`).
2. `j`/`k` scroll down/up; `gg` goes to the top and `G` to the bottom.
3. `?` opens a help overlay that lists the bindings. It's keyboard-accessible, uses theme tokens and works in light and dark. `Esc` closes it.
4. Keys are ignored inside input/textarea/select/contenteditable, or while Ctrl/Meta/Alt is held.
5. `npm run build`, `npm run lint` and `npx nuxi typecheck` show no new errors, and the feature is checked in a real browser.

## Code anchors
- `app.config.ts` `menuPrimary`: the nav routes. Add one `key` per entry so the bindings sit next to the nav data.
- `themes/portfolio-dev/layout/Header.vue`: site-wide chrome on every page. It renders the new component, so the `app.vue` theme contract doesn't change.
- New `themes/portfolio-dev/components/KeyNav.vue` (tag `ThemeKeyNav`): keydown handler plus a `UModal` help overlay (focus trap and Esc come built in).
- `i18n/locales/{en,vi}.json`: help overlay strings.

## Key choice
Following vim, `gg` means top, so the GitHub route can't use `g g`. Route keys: `gr` resume, `gp` projects, `gh` github, `gb` blogs, `gc` contact.
