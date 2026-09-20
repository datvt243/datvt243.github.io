# 2026-09-20 — p3-nice-to-have-fixes (diff)

**Worker:** implementer
**Node:** `p3-nice-to-have-fixes`

## Diff

| File | Why |
|---|---|
| `themes/portfolio-dev/pages/contact/Index.vue` | Added a small `<p>` under the submit button: `{{ t('contact.mailFallback', { email: contact.email }) }}` - a visible, always-present fallback for visitors whose OS has no mail client configured, naming the real (already-displayed-elsewhere) email. |
| `i18n/locales/vi.json`, `i18n/locales/en.json` | New `contact.mailFallback` key, `{email}` named interpolation (same style as the existing `contact.seoDescription` key). |
| `assets/css/styles.scss` | Added a `@media (prefers-reduced-motion: reduce)` block that drops `.transition-opacity-enter-active`/`-leave-active`'s `transition-duration` to `0.01ms !important` (not `transition: none`). **Reasoning, not just following the issue's suggestion blindly**: Vue's `<Transition>` component waits for a real `transitionend` DOM event to remove its enter/leave classes and complete the transition; setting `transition: none` would prevent that event from ever firing, potentially leaving the page stuck mid-transition (invisible/blurred) for reduced-motion users specifically - the opposite of the intended accessibility improvement. A near-zero duration still fires `transitionend` almost immediately while being visually imperceptible. |

## Scope note (see plan's "Scope decision")
Items 3 (tab-gated resume) and 4 (test suite) from issue #181 are **deliberately not touched** in this diff - both are explicitly framed by the issue itself as judgment calls / "candidate's own call," not concrete bugs. See the plan note for the full reasoning.

## Command
```
npm run build
npm run lint
```

## Output

`npm run build` (verbatim tail):
```
[@nuxt/image]  WARN  sharp binaries for darwin-arm64 cannot be found. Please report this as a bug with a reproduction at https://github.com/nuxt/image.

[nitro] ✔ You can preview this build using node .output/server/index.mjs
│
└  ✨ Build complete!
```

`npm run lint` (verbatim):
```
✖ 13 problems (0 errors, 13 warnings)
```
Exact match to the current baseline (13 warnings, unchanged - none in any file touched by this diff).

## Browser verification
Checked via Chrome CDP (port 9888, `puppeteer-core`) against a real `npm run dev` instance (port 4177).

**Infrastructure note**: the shared debuggable Chrome instance had degraded partway through this session (a `Network.enable timed out` / `ProtocolError` on new-page creation, after many hours of repeated connect/disconnect cycles across this session's earlier nodes) - not an app bug. Killed the stale Chrome process and relaunched a fresh instance with a clean `--user-data-dir` profile per the `/browser` skill's exact steps before re-attempting verification, which then worked cleanly.

- **Contact fallback**: `hasFallback: true`, real snippet captured: `"...liên hệ trực tiếp qua votan.it@gmail.com."` - the actual configured email, not a placeholder.
- **Reduced motion, the core technical claim**: used `page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])`, then read the real computed `transitionDuration` of a `.transition-opacity-enter-active` element via `getComputedStyle` - result: `1e-05s` (0.01ms, exactly as coded). Re-checked with `prefers-reduced-motion: no-preference` after reloading - result: `0.4s` (the original, unmodified duration). Confirms the media query correctly gates on the *media feature*, not applied unconditionally.
- **Console errors**: `[]` (empty) on both checks.

Script: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/3010f9ae-4713-4cd2-8a1a-3217fd3407e6/scratchpad/verify-181.cjs` (scratch, not committed).

## Acceptance

| Criterion | Evidence |
|---|---|
| Visible mailto fallback with real email | CDP: `hasFallback: true`, real email in the captured snippet |
| Reduced-motion guard works without breaking Vue's transition completion | CDP: `1e-05s` under `reduce` vs `0.4s` under `no-preference` - a real, non-zero duration confirmed both ways, not `none` |
| Build clean | `npm run build` tail: `✨ Build complete!`, only the pre-existing `sharp` warning |
| Lint clean, baseline unchanged | `npm run lint`: `✖ 13 problems (0 errors, 13 warnings)` |
| Real UI verified, 0 console errors | CDP script above |

## Noticed, not done
- Items 3 (tab-gated resume single-scroll alternative) and 4 (test suite) from issue #181 - both explicitly scoped out by the issue's own text as judgment calls / operator decisions, not implemented here. See plan note.
- The Chrome debug instance degradation encountered mid-session (not a code bug, an environment/tooling issue) is worth a mental note for future long sessions: if CDP verification starts timing out unexpectedly, check `curl -s http://localhost:9888/json/version` first and consider a clean relaunch before assuming the app itself is broken.

## Seal gate
None — no outward-facing action taken (no commit/push/PR). Working tree has the diff on branch `181-fix-4-p3-nice-to-have`, uncommitted, awaiting verifier then operator's own `/ship` step.
