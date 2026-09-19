# p3-github-avatar-alt — implementer diff note

Issue: portfolio audit (`.claude/review.md`) P3 accessibility finding.

## Scope
`themes/portfolio-dev/pages/github/GitUser.vue`'s `<NuxtImg :src="props.user.avatar_url">` had no `alt`. Added `:alt="props.user.login"` (the GitHub username — every other image in the theme carries a real, meaningful `alt`, this now matches).

## Verified
- Build/lint: see `p2-polish-sweep-diff.md`'s combined run (same pass covered this file too — `13 problems, 0 errors`, no new warnings from this change).
- Chrome CDP on `/github` (fresh page load, real dev server): `document.querySelector('.git-user img')` → `alt: "datvt243"`, `src` resolves to the real GitHub avatar URL. 0 console errors.

## Files changed
`themes/portfolio-dev/pages/github/GitUser.vue` (1 line).
