# 2026-10-27 - vue-pin-no-override (plan)

- Worker: implementer · Version: 0.1.0
- Node: `vue-pin-no-override` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #294 (operator: "Làm" after the investigation comment), branch `feature/294` off `staging` ae783ff

## Hub bytes before: 80060

## Plan
`package.json`: `"vue": "latest"` → `"^3.5.44"` (the version the lockfile already pins and `nuxt@4.6` requires); remove the `overrides` block (only held `vue: latest`). `package-lock.json`: only the root `packages[""].dependencies.vue` spec line — a full `npm install --package-lock-only` also adds 6 unrelated bundled wasm entries, so it's not used.

## Acceptance criteria
1. `npm ci` accepts the lockfile; `npm ls` exits 0 with a single `vue@3.5.44`.
2. Built server bundles vue 3.5.44; pages render.
3. build/lint/typecheck/`npm test` clean.
