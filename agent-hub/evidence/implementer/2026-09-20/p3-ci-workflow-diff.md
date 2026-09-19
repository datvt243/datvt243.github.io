# p3-ci-workflow — implementer diff note

Issue: portfolio audit (`.claude/review.md`) P3 finding ("no CI/automated checks").

## Scope
New `.github/workflows/ci.yml`: on `pull_request`/`push` to `staging`/`main`, runs `actions/checkout@v4` → `actions/setup-node@v4` (`node-version-file: .nvmrc`, matches the repo's own `24` — same version the `add-nvmrc`/`enforce-node-engines` nodes already established as the floor, `npm` cache enabled) → `npm ci` → `npm run build` → `npm run lint`. No deploy step, no secrets/env vars referenced — matches the audit's own ask ("just the build+lint gate") and the doctrine's "no test suite" fact (nothing to run beyond build+lint).

Confirmed no env vars are actually required for `npm run build` to succeed: the only `routeRules` prerender target is `/contact` (`nuxt.config.ts:132`), which only reads `app.config.ts` (static, no API call); every other route is `isr`/runtime-only, not touched during the build step. Verified this holds by running a real build in this session without exporting any of the `MY_EMAIL`/`NODE_API`/`GITHUB_TOKEN`/etc. env vars beyond what the repo's own `.env` already provides locally — build succeeded either way since prerender doesn't touch those paths.

## Verified
- The workflow file itself isn't executable locally (no local `act`/GitHub Actions runner available in this environment) — this can only be truly confirmed once pushed and a real workflow run fires on GitHub. What was actually checked: (a) `node -e "require('js-yaml').load(...)"` (resolved from `node_modules` as an existing transitive dependency) parsed the file with 0 errors, confirming valid YAML structure matching the intended `on`/`jobs`/`steps` shape (verified by printing and reading back the parsed object); (b) confirmed `.nvmrc` exists and reads `24`, matching `package.json`'s `engines.node: ">=24"`, so `setup-node@v4`'s `node-version-file: .nvmrc` resolves to the right version; (c) the workflow's own command sequence (`npm ci && npm run build && npm run lint`) is the exact same sequence already independently re-run clean in this same session for every other node in this batch, on this same commit.
- `npm run build` + `npm run lint` (the same two commands the workflow runs) were both independently re-run clean in this same session, covering every file changed across this whole batch of P2/P3 nodes.

## Files changed
`.github/workflows/ci.yml` (new).
