# p3-ci-workflow — verifier seal note

**Caveat, disclosed not silently assumed**: same-session verification, not a separate blank-context pass (see `p2-polish-sweep-seal.md` for the full disclosure). Also disclosed again here because it matters most for this node: **the workflow has not actually run on GitHub** — nothing in this repo's tooling can execute a GitHub Actions workflow locally, so "verified" here means "structurally correct and consistent with what's proven to work," not "observed running green in CI."

## Independently re-checked
- Re-ran the YAML parse independently (`node -e "require('js-yaml').load(...)"`, resolved from `node_modules` as an existing transitive dependency — not a new tool added for this check) and re-read the parsed structure: `on.pull_request.branches`/`on.push.branches` both `[staging, main]`, single job `build-and-lint` on `ubuntu-latest`, 5 steps in the right order (`checkout@v4` → `setup-node@v4` with `node-version-file: .nvmrc` + `cache: npm` → `npm ci` → `npm run build` → `npm run lint`) — matches the implementer note's description exactly.
- Confirmed `.nvmrc` independently (`cat .nvmrc` → `24`) matches `package.json`'s `"engines": { "node": ">=24" }`.
- Confirmed the 3 run steps (`npm ci`/`npm run build`/`npm run lint`) are the literal `doctrine/MEMORY.md`-specified commands, not paraphrased or invented ones.
- Re-ran `npm run build && npm run lint` locally one more time (this verifier's own pass, not reused from the implementer's run) to reconfirm the sequence this workflow will run is currently clean: exit 0, `13 problems (0 errors, 13 warnings)`.
- Scope check: `git status --short` shows exactly 1 new file (`.github/workflows/ci.yml`) for this node, nothing else.

## Residual risk, disclosed
A first real run on GitHub's actual runner image could still fail for environment reasons this local check can't see (e.g. a registry/network hiccup during `npm ci`, a GitHub-hosted-runner Node version quirk). This is inherent to adding CI for the first time and isn't something further local verification can close — flagging it rather than overclaiming certainty.

**Verdict: SEAL.**
