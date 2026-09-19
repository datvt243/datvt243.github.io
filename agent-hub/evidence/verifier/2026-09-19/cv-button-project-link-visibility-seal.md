# 2026-09-19 — cv-button-project-link-visibility (verifier)

- Worker: verifier
- Node: `cv-button-project-link-visibility`
- Independent pass, fresh CDP script/port (4014).

## Independent checks
- `git diff -- themes/portfolio-dev/pages/resumeObject/AboutMe.vue
  themes/portfolio-dev/pages/projects/Index.vue i18n/locales/vi.json
  i18n/locales/en.json` read directly off disk: matches the implementer
  diff note exactly.
- Independently confirmed the reused button pattern actually matches
  `Detail.vue:67-76` by re-reading that file directly: same
  `border-theme-accent border rounded-md ... hover:bg-theme-accent
  hover:text-theme-accent-contrast transition-all` class set, same
  icon+label flex layout — not just asserted, byte-compared.
- Fresh CDP script (independent of the implementer's, different port 4014):
  - CV button: `border-width: 1px`, real `border-color` (Dracula-scope
    purple, confirmed via `getComputedStyle`), confirming real chrome vs.
    the old plain-text rendering.
  - Inspected the button's raw `innerHTML` directly (not just a boolean
    icon check): `<span class="iconify i-fe:download w-5 h-5"
    aria-hidden="true">` — confirms `@nuxt/icon`'s local-bundle CSS-mask
    rendering mode (a `<span class="iconify ...">`, not an inline `<svg>`)
    is genuinely present, resolving an initial false-negative from a
    too-strict `querySelector('svg')` check during this same verification
    pass (corrected to check for `.iconify` too, matching how this
    project's icons actually render everywhere else).
  - Project cards: card 1 (no `link`) renders no extra element; card 2
    (`link: "http://demo.com"`) renders a real `<a target="_blank">` — both
    independently re-confirmed on a fresh page load.
  - 0 console/page errors on either `/` or `/projects`.

## Acceptance re-check
| # | Criterion | Independent evidence | Met? |
|---|---|---|---|
| 1 | CV button has real visible chrome | `border-width: 1px`, real color, icon confirmed via `innerHTML` | ✅ |
| 2 | Reused existing pattern, not invented | Byte-compared against `Detail.vue` | ✅ |
| 3 | Project link renders conditionally, correctly | Card-by-card recheck, fresh script | ✅ |
| 4 | i18n label added both locales | `git diff` on both locale files | ✅ |
| 5 | Build clean | Independently re-run | ✅ |
| 6 | Lint clean | Independently re-run, baseline match | ✅ |

## Verdict: SEAL
