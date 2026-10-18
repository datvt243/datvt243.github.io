# 2026-10-18 - vim-key-nav-extension-note (implementer diff)

- Worker: implementer · Version: 0.1.0
- Node: `vim-key-nav-extension-note` (IN_PROGRESS)
- Issue: #236 (follow-up) · Branch: `feature/236`
- Task (verbatim): "ok làm cách 2"
- Status: **sealed_pending_verifier**

## Hub bytes before
150784 (see `vim-key-nav-extension-note-plan.md`)

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/components/KeyNav.vue` | Adds one `<p class="mt-4 border-t border-theme-border pt-3 text-xs text-theme-muted">{{ t('keyNav.extensionNote') }}</p>` after the bindings `<ul>` inside the overlay. No script changes |
| `i18n/locales/{en,vi}.json` | New `keyNav.extensionNote` string. Both files still parse as JSON (checked with `json.load`) |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New row appended at the end (`AppendOnly`) |

## Command
Node v24.19.0, repo root: `npm run build` · `npm run lint` · `npx nuxi typecheck`

## Output
- `build exit 0` and `└  ✨ Build complete!`
- `lint exit 0`. The output is only `> eslint .` and lists no problems
- `tc exit 0` and `grep -c "error TS"` returns `0`

## Browser verification
Script `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/note.cjs`: production build on `:3457` in a clean headless Chrome. It sets the color mode with `evaluateOnNewDocument`, presses `?` and reads `[role="dialog"] p`. Verbatim output:
```
note-vi-dark html class dark {"text":"Đang dùng Vimium hoặc extension tương tự? Nhấn \"i\" trước để nhường phím cho trang (Esc để thoát), hoặc thêm site này vào danh sách loại trừ của extension.","color":"rgb(148, 163, 184)","visible":true}
note-en-light html class light {"text":"Using Vimium or a similar extension? Press \"i\" first to pass keys to this page (Esc to leave), or exclude this site in the extension.","color":"rgb(100, 116, 139)","visible":true}
```
Both colors match the token: `dark.css` `--theme-muted: 148 163 184` and `light.css` `--theme-muted: 100 116 139`. Screenshots are `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/note-vi-dark.png` and `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/note-en-light.png`. The note sits under a divider at the bottom of the overlay, and all 10 bindings above it are unchanged.

## Acceptance
| Criterion | Evidence |
|---|---|
| Note in overlay, vi+en, mentions `i`/Esc/exclude | Both `text` values above, `visible:true` |
| Theme tokens, light+dark | Computed colors equal `--theme-muted` per mode; screenshots |
| Nothing else changes | The diff is one template line plus one i18n key per locale; the screenshots show the same bindings list |
| build+lint+typecheck clean | Output above |
| comments per code-comments.md | No comments touched |

## Noticed, not done
- The `i` advice is checked against Vimium C 2.12.2's default map only (see plan). Original Vimium uses the same `i` default, but I haven't checked it here. A user with a custom map may need a different key, so the note also offers "exclude this site".

## Seal gate
None. No commit or push.
