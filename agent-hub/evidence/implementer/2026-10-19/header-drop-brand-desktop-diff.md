# 2026-10-19 - header-drop-brand-desktop (implementer diff)

- Worker: implementer · Version: 0.1.0
- Node: `header-drop-brand-desktop` (IN_PROGRESS)
- Issue: #236 (follow-up) · Branch: `feature/236`
- Task (verbatim): "header có vẻ hơi chật rồi, hãy bỏ _datvt243"
- Status: **sealed_pending_verifier**

## Hub bytes before
154106

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/layout/Header.vue` | Brand `<NuxtLink>` class `flex` → `flex lg:hidden`. Scope call: the crowding is the desktop tab bar (tabs + g-badges + ?/locale/theme). Below `lg` the brand is the only left-side item (tabs collapse into the slideover); removing it there would leave a bare row of toggles with a left-border at the container edge. The home route stays reachable via `_resume` tab and `gr`. One-word revert (`lg:hidden` → `hidden`) if the operator wants it gone everywhere |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New row appended (`AppendOnly`) |

## Command / Output (Node 24, repo root)
- `npm run build` exit 0, `└  ✨ Build complete!`
- `npm run lint` exit 0
- `npx nuxi typecheck` exit 0, `error TS` count 0

## Browser verification
Clean headless Chrome (fresh temp profile), prod build `:3457`, script `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/hdr/t.cjs`: **13 pass / 0 fail**. At 1280 and 1024, vi+en, the brand is hidden and header row and document overflow are both 0 (header 46px). At 390, vi+en, the brand is shown with overflow 0. On desktop `gr` still reaches `/`. Screenshots `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/hdr/{desktop,lg-min,mobile}.png`: at 1024 the tab bar starts with `_resume`, and the mobile row reads `_datvt243 | VI | ☀ | ☰`.

## Not checked
768px (md) width; the brand at md is the same mobile layout.
