# 2026-10-19 - hero-contact-to-page (verifier verdict: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `hero-contact-to-page` (`haven/diagrams/dev-loop.prime-mermaid.md`, issue #239 follow-up)
- Note graded: `evidence/implementer/2026-10-19/hero-contact-to-page-diff.md`, against the operator task "nút liên hệ hãy bỏ gửi mail , đổi thành nav qua page contact" and `git diff -- themes/portfolio-dev/pages/resumeObject/Hero.vue`
- New PM status: **SEALED** (row flipped in place, IN_PROGRESS → SEALED)

## Isolation proof
Same separate verifier subagent as `ui-review-239-seal.md` (batch of 2, spawn cost paid once). Task string: "You are the **verifier** worker … B) `hero-contact-to-page` — new node. Operator task verbatim: …". Not the implementer's task string. This context wrote no part of the diff. Verdict reached on this node's own evidence, independently of node A.

## Re-run
`partial`: build, lint, typecheck (shared run, see `ui-review-239-seal.md`: build exit 0 `✨ Build complete!`; lint exit 0, output only `> eslint .`; typecheck exit 0, 0 `error TS`) and my own browser checks. Reason: the implementer's command output for this node is cited as "same run" rather than quoted, and it shares a tree with a node that had hidden a lint warning.

## Diff read
`Hero.vue`: `<a :href="\`mailto:${contact.email}\`">` → `<NuxtLink :to="localePath('/contact')">`, same classes / `data-shortcut="c"` / label / `<ThemeKbd>c</ThemeKbd>`. `const { contact } = useAppConfig()` → `const localePath = useLocalePath()` (no dangling use of `contact`; typecheck + lint clean).

## Browser (own script)
`/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/verifier-239/v3-extra.cjs` (hero block), output in `run3.txt`; prod build `:3458`, fresh profile, 0 Vue/hydration warnings.

| Acceptance | Result |
|---|---|
| In-site link to localized contact | `/`: `{"tag":"A","href":"/contact","text":"Liên hệ c"}`. `/en`: `{"tag":"A","href":"/en/contact","text":"Contact me c"}` |
| Click navigates | `/` → `http://localhost:3458/contact`; `/en` → `http://localhost:3458/en/contact` |
| Key `c` navigates | `/` → `/contact`; `/en` → `/en/contact` (also `c -> http://localhost:3458/contact` in the regression block) |
| No mailto fired | No `mailto:` request seen on either locale |
| Badge kept | `ThemeKbd` `c` present (text ends in `c`) |
| `?` overlay | Lists "Liên hệ / c" (vi) and "Contact me / c" under "On this page" (en) |
| No mailto on `/` | `a[href^="mailto:"]` count 0 on `/` and `/en` |
| Email still reachable | `/contact` and `/en/contact` show a `mailto:` link whose text is the email |
| Unused destructure removed | Yes (diff) |
| comments per code-comments.md | Note: "No comments touched"; confirmed by the diff (the file's `@file` block is untouched and doesn't mention mailto) |
| build / lint / typecheck | Clean, quoted above |

## Forbidden states / gate / proportionality
`ADHOC_WORK`/`NO_EVIDENCE`/`CODE_IN_HAVEN`/`DIAGRAM_DRIFT`/`EDIT_UNVERIFIED`: none. Nothing outward-facing. Diff is one element swap + one line in setup, exactly the task. No "tests pass" claim.

## Doubts (non-blocking)
- `c` and `gc` now both go to `/contact` (redundant, harmless; operator informed by the implementer).
- The link keeps the `fe:mail` icon; fine for a "contact" button, but the operator may want a different icon now that it isn't an email action.
- The "no mailto fired" probe relies on Chrome request events; the hard proof is the `href` and the 0-mailto-link count.
