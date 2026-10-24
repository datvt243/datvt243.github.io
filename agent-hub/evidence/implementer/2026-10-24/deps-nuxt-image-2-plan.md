# 2026-10-24 - deps-nuxt-image-2 (plan)

- Worker: implementer · Version: 0.1.0
- Node: `deps-nuxt-image-2` (new row appended; slug grepped in both diagram files → 0 hits)
- Task: `/todo` "xử lý nhóm A" → issue #259 "chore(deps): Phase 3.2 — @nuxt/image 1→2" (https://github.com/datvt243/datvt243.github.io/issues/259), branch `feature/259` off `staging` @ `603f1e1`, worked in a separate git worktree (main checkout holds uncommitted #265 work).

## Hub bytes before: 76703

## Live re-verify
- `npm view "@nuxt/image@^2" version` → `@nuxt/image@2.2.0 '2.2.0'`; module meta `compatibility.nuxt: ">=3.1.0"`.
- v2.0.0 release notes (`gh api repos/nuxt/image/releases/tags/v2.0.0`) breaking changes: custom provider API (`defineProvider`), removed `layer0`/`edgio` providers, `joinWith` formatters, default screens drop `xs`/`xxl`, removed internal utils. "Most apps can upgrade with no code changes."
- Repo usage: no `image:` key in `nuxt.config.ts`, no custom provider, no `sizes=`/`densities`; 6 `<NuxtImg>` (`error.vue:41`, `github/GitUser.vue:27`, `projects/Index.vue:62`, `resumeObject/Hero.vue:90,101,109`) → none of the breaking changes apply.

## Baseline (v1.11.0, prod build, port 4001, `scratchpad/cdp-img.cjs`)
- build rc=0, `[@nuxt/image]  WARN  sharp binaries for darwin-arm64 cannot be found.`; typecheck rc=0; eslint 0 problems; audit 60
- `/` 14/14 ok (`/_ipx/s_24x24/svg/js.svg` ...), `/github` 1/1 (remote avatar), `/projects` 2/2 (`/_ipx/_/images/projects/simplemdg.svg`), 404 page 1/1 (`/_ipx/_/error.png`), `/github` via click 1/1; img responses ≥400: none; hydration 0; console issues: none

## Blockers
none
