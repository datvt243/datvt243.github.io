# 2026-10-19 - hero-contact-to-page (implementer diff)

- Worker: implementer · Version: 0.1.0
- Node: `hero-contact-to-page` (IN_PROGRESS)
- Issue: #239 (follow-up, same branch) · Branch: `bug/239`
- Task (verbatim): "nút liên hệ hãy bỏ gửi mail , đổi thành nav qua page contact"
- Status: **sealed_pending_verifier**

## Hub bytes before
156292

## Diff
| File | Change |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | The contact `<a :href="mailto:…">` becomes `<NuxtLink :to="localePath('/contact')">`. Classes, `data-shortcut="c"`, label and `<ThemeKbd>c</ThemeKbd>` are unchanged. `const { contact } = useAppConfig()` (now unused) is replaced by `const localePath = useLocalePath()` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New row appended |

`c` and `gc` now reach the same page. That's harmless; reported to the operator.

## Acceptance
| Check | Result |
|---|---|
| comments per code-comments.md | No comments touched |
| build / lint / typecheck | exit 0 / no problems / exit 0, 0 `error TS` (same run as the ui-review-239 rework) |
| Browser `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/fix239/t2.cjs` (output `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/fix239/run-t2.txt`) | Link: `A href=/contact` with badge `c`; 0 `mailto:` links on `/`. Click → `/contact`; key `c` → `/contact`. On `/en`: href and key `c` → `/en/contact`. The contact page still shows the email. The overlay still lists `c`. No mailto request fired |
