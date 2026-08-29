# 2026-08-30 — remove-dead-related-articles (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `remove-dead-related-articles` (new)
- Task (verbatim, issue #88): `themes/portfolio-dev/pages/post/
  RelatedArticles.vue` is not imported/used anywhere in the codebase.
  Content is fake Flowbite placeholder ("Volosoft", `href="#"` links),
  hardcoded `gray-50`/`gray-800` colors not using any theme token — would
  break light/dark mode if ever rendered. Delete the file.

## Node exists? No — created new node `remove-dead-related-articles`.

## Confirmation the file is truly dead (read, not guessed)
- `grep -rn "RelatedArticles" --include="*.vue" --include="*.ts"
  --include="*.js" .` (excluding `node_modules`/`.nuxt`/`.output`) → 0
  matches anywhere, including inside the file's own directory siblings.
- `grep -rn "ThemePostRelatedArticles"` (the Nuxt auto-import tag name this
  file would resolve to under the `Theme` prefix convention) → 0 matches.
- Confirms: not referenced by any `pages/*.vue`, not referenced by
  `Detail.vue` (the file that actually renders `post/` components), not
  referenced anywhere else.

## Blockers
None.

## Acceptance criteria
1. `themes/portfolio-dev/pages/post/RelatedArticles.vue` deleted.
2. `npm run build` + `npm run lint` clean, no new warnings (there
  shouldn't be any change to the warning count — the file had 0 lint
  findings before deletion).
3. Real UI check via Chrome CDP on a real `/blogs/<id>` page — confirms
  the post-detail page is unaffected by removing this unrelated dead file,
  0 console errors.
