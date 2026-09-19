# p3-github-avatar-alt — verifier seal note

**Caveat, disclosed not silently assumed**: same-session verification, not a separate blank-context pass (see `p2-polish-sweep-seal.md` for the full disclosure).

## Independently re-checked
- Re-read `themes/portfolio-dev/pages/github/GitUser.vue:19` directly off disk: `:alt="props.user.login"` present, single-line diff, no other change to the file.
- Build/lint covered by the same combined clean run as the other 3 nodes in this batch (`13 problems, 0 errors`).
- CDP on `/github` (real dev server, fresh page load): `document.querySelector('.git-user img').alt === 'datvt243'`, real `avatars.githubusercontent.com` src resolved, 0 console errors.
- Scope check: `git diff --stat -- themes/portfolio-dev/pages/github/GitUser.vue` shows exactly the 1-line change, nothing else touched.

**Verdict: SEAL.**
