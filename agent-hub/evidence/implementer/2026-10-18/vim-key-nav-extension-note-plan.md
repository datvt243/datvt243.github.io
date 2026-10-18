# 2026-10-18 - vim-key-nav-extension-note (implementer plan)

- Worker: implementer · Version: 0.1.0
- Node: `vim-key-nav-extension-note` (new row appended at the end of the PM status table, IN_PROGRESS)
- Issue: #236 (follow-up) · Branch: `feature/236`
- Task (verbatim): "ok làm cách 2". This answers the operator's question "\"?\" đang bị chiếm dụng với các extension/plugin của browser, có hướng khắc phục không". I proposed option 2: add a one-line note to the help overlay. The operator approved it.

## Hub bytes before: 150784

## Why only a note
A page can't take keys back from an extension's content script, because the content script registers its listeners first. The `?` header button (`vim-key-nav-hint`) is already a way in that doesn't depend on any key. The note tells Vimium users how to pass keys through to the page.

Fact check: the installed Vimium C 2.12.2 (`~/.chrome-debug-profile/.../hfjbmagddngcpeloejdejnfgbamkjaeg/2.12.2_0`) source contains the default key map `... i enterInsertMode j scrollDown ...`. Insert mode passes keys to the page until `Esc`.

## Acceptance
1. A note in the help overlay, in vi and en: press `i` first (`Esc` to leave), or exclude the site in the extension.
2. Styled with theme tokens; legible in light and dark.
3. Nothing else changes. build, lint and typecheck are clean, and the change is checked in a real browser.

## Code anchors
- `themes/portfolio-dev/components/KeyNav.vue` template, below the bindings list.
- `i18n/locales/{en,vi}.json`: a new `keyNav.extensionNote` key.
