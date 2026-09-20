# 2026-09-20 — p3-nice-to-have-fixes

**Worker:** implementer
**Version:** 1.0.0 (dev-loop diagram)
**Node:** `p3-nice-to-have-fixes` (new — no prior node matched, created per `pick_next.md`'s "No diagram matches yet" branch)
**Task:** Fix P3/nice-to-have findings from portfolio review — issue #181: (1) Silent `mailto:` failure fallback note in `contact/Index.vue`. (2) `prefers-reduced-motion` guard on page/layout transitions. (3) Resume-panel tab-gating — explicitly framed by the issue itself as a judgment call ("consider IF worth the trade-off"), not a definite ask. (4) No automated test suite — explicitly framed by the issue itself as "candidate's own call... not recommended purely to look complete."

## Hub bytes before: 115870

## Scope decision (read before the diff)
Only items (1) and (2) are concrete, low-risk fixes with a clear right answer — implemented below.
Items (3) and (4) are **deliberately not code-changed**, per the issue's own explicit framing:
- (3) is presented as "a deliberate consequence of the IDE/editor metaphor, not a bug" and "a design call for the candidate" — building a parallel single-scroll resume view or an expand-all toggle would be a real UX redesign decision, not a bug fix, and isn't something this implementer pass should decide unilaterally. Disclosed here, not implemented.
- (4) explicitly says not to add a testing framework "purely to look complete." No test tooling was added. Confirmed still true: no `test` script in `package.json`, `grep -rln` for `*.test.*`/`*.spec.*` still finds 0 files.

## Acceptance criteria
1. `contact/Index.vue`'s form has a visible fallback line naming the real email, in case `mailto:` doesn't open anything.
2. `pageTransition`/`layoutTransition`'s `transition-opacity` CSS respects `prefers-reduced-motion: reduce` without breaking Vue's `<Transition>` completion detection (i.e. not `transition: none`, which would leave Vue waiting for a `transitionend` that never fires).
3. `npm run build` clean, `npm run lint` clean (0 errors, warning count not increased from baseline).
4. Real UI check via Chrome CDP — both changes are visual/behavior, including emulating `prefers-reduced-motion: reduce`.

## Files to touch
- `themes/portfolio-dev/pages/contact/Index.vue`
- `assets/css/styles.scss`
- `i18n/locales/{vi,en}.json` (new key: `contact.mailFallback`)

No env var needed, no new dependency.
