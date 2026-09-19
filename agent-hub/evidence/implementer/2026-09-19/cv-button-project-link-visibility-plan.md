# 2026-09-19 — cv-button-project-link-visibility (implementer plan)

- Worker: implementer
- Node: `cv-button-project-link-visibility` (new)
- Task: fix item 4 of the 4 critical items from the `.claude/review.md` audit
  (two related visibility gaps, grouped into one node per the operator's
  framing of "4 items").

## Acceptance criteria
1. `AboutMe.vue`'s CV download `<button>` (already has a working click
   handler) renders as plain `text-blue-400` inline text with no button
   chrome — restyle it as a real, visible button, reusing the existing
   bordered/padded/icon-plus-label pattern from `Detail.vue:67-76`'s
   "back to blog" button rather than inventing a new style.
2. `themes/portfolio-dev/pages/projects/Index.vue` never renders `p.link`
   even though `ProjectModel.link` is populated
   (`utils/ResumeAdapter.ts:88`, `models/Project.ts:11`) — add a
   conditional "View project" link/icon per card when `p.link` is
   non-empty, matching the page's existing badge/icon visual language.
3. Both changes need an i18n label (`projects.viewProject`) added to both
   `vi.json`/`en.json` — this repo's i18n is UI-chrome-only, a new visible
   label needs a translation key like every other button/label.
4. Verify via CDP: the CV button has real visible chrome (border, icon,
   dimensions), and a project card with a `link` value renders a working
   `<a>`; a card without one renders nothing extra.

## Env vars
None needed.
