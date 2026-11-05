<!-- Diagram: dev-loop -->
<!-- Dev loop: plan - implement - verify - seal -->
DNA: 'smallest_diff / edit_x_read_back_proof_x_independent_verdict'
Auth: 65537 | Version: 1.0.0
Law: LAI-13 - monotonic ratchet (PENDING -> IN_PROGRESS -> SEALED, never demote)

> Every change to the repo's code enters here and leaves as SEALED or
> REOPENED — no state in between.

```mermaid
flowchart TD
    task[Task] --> pick[implementer: pick_next]
    pick --> exist{Node exists on diagram?}
    exist -- no --> draft[DRAFT node<br/>diagram-first: no node, no code]
    draft --> pick
    exist -- yes --> impl[implementer: implement<br/>smallest diff]
    impl --> outward{Touches outward-facing?}
    outward -- yes --> gate[SEAL GATE<br/>show diff, wait for approval]
    gate --> build
    outward -- no --> build[npm run build + lint + typecheck + test<br/>from doctrine/MEMORY.md]
    build --> visual{Changes visual/behavior?}
    visual -- yes --> cdp[Check real UI via Chrome CDP :9888]
    visual -- no --> readback
    cdp --> readback{Output actually<br/>read back?}
    readback -- no --> unverified[EDIT_UNVERIFIED]
    unverified --> impl
    readback -- yes --> evidence[Write evidence note]
    evidence --> verifier[verifier: verify_seal]
    verifier --> verdict{Meets every<br/>acceptance criterion?}
    verdict -- no --> reopen[REOPEN + specific reason]
    reopen --> impl
    verdict -- yes --> seal[SEAL<br/>update PM status]

    classDef gate fill:#f5c518,color:#000
    classDef bad fill:#e05555,color:#fff
    classDef good fill:#2fa84f,color:#fff
    class gate gate
    class unverified,reopen bad
    class seal good
```

## PM status
> Older SEALED nodes (2026-08-16 through 2026-08-19, then a 2nd pass
> 2026-08-31 covering 5 more nodes dated 2026-08-25/2026-08-29) moved to
> `haven/diagrams/dev-loop-archive.md` to keep this file small — every
> worker session reads this file in full. Nothing deleted: the archive
> has each row's full original text verbatim. The compact rows below
> point to it; open the archive only when you need the full story
> behind an old node. `pick_next` only needs non-archived rows. Run
> `/hub-tokens` periodically — if this file flags >15KB again, repeat
> this archiving pass for nodes older than the current work session.

| Node | State | Notes |
|---|---|---|




















Any regression must be a **new node** (LAI-13) — never edit an old node's
PM status directly to "undo" an existing SEAL.
| `resume-content-locale` | SEALED | 2026-10-27 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-10-27/resume-content-locale-seal.md`. |
| `vi-glyph-fallback` | SEALED | 2026-10-27 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-10-27/vi-glyph-fallback-seal.md`. |
| `pages-nojekyll` | SEALED | 2026-10-31 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-10-31/pages-nojekyll-seal.md`. |
| `skills-typo-map-drop` | SEALED | 2026-10-31 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-10-31/skills-typo-map-drop-seal.md`. |
| `pdf-two-pages` | SEALED | 2026-10-31 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-10-31/pdf-two-pages-seal.md`. |
| `blog-content-sanitize` | SEALED | 2026-10-31 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-10-31/blog-content-sanitize-seal.md`. |
| `script-csp-report-only` | SEALED | 2026-10-31 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-10-31/script-csp-report-only-seal.md`. |
| `projects-readable-mobile` | SEALED | 2026-11-01 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-01/projects-readable-mobile-seal.md`. |
| `seo-titles-og-image` | SEALED | 2026-11-01 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-01/seo-titles-og-image-seal.md`. |
| `remove-unused-deps-helpers` | SEALED | 2026-11-01 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-01/remove-unused-deps-helpers-seal.md`. |
| `upstream-no-retry-429` | SEALED | 2026-11-01 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-01/upstream-no-retry-429-seal.md`. |
| `sanitize-html-require-esm` | SEALED | 2026-11-01 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-01/sanitize-html-require-esm-seal.md`. |
| `resume-isr-allow-lang` | SEALED | 2026-11-01 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-01/resume-isr-allow-lang-seal.md`. |
| `resume-isr-allow-lang-live` | PENDING | 2026-11-01 — #361 follow-up, split from `resume-isr-allow-lang` (its acceptance 4 can't be proven before a deploy). Acceptance: on the Vercel preview of `bug/361` (or live after release), `/api/resume?lang=en` returns an introduction starting `Frontend Developer with 4+ years` and `?lang=vi` the VI one, with different etags — both quoted verbatim. Blocked on: push `bug/361` (operator-approved `/ship`). |
| `hero-main-familiar-api` | SEALED | 2026-11-02 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-02/hero-main-familiar-api-seal.md`. |
| `skills-file-tabs` | SEALED | 2026-11-02 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-02/skills-file-tabs-seal.md`. |
| `experience-pug-piped` | SEALED | 2026-11-02 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-02/experience-pug-piped-seal.md`. |
| `script-csp-enforce` | SEALED | 2026-11-05 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-05/script-csp-enforce-seal.md`. |
| `resume-plain-mappers` | SEALED | 2026-11-05 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-05/resume-plain-mappers-seal.md`. |
| `api-cache-revalidate` | SEALED | 2026-11-05 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-05/api-cache-revalidate-seal.md`. |
| `hero-greeting-whoami` | SEALED | 2026-11-05 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-05/hero-greeting-whoami-seal.md`. |
| `hero-about-me-intro` | SEALED | 2026-11-05 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-05/hero-about-me-intro-seal.md`. |
| `hero-avatar-inline` | SEALED | 2026-11-05 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-05/hero-avatar-inline-seal.md`. |
| `hero-intro-full-avatar-128` | SEALED | 2026-11-05 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-05/hero-intro-full-avatar-128-seal.md`. |
| `hero-avatar-img-tag` | SEALED | 2026-11-05 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-05/hero-avatar-img-tag-seal.md`. |
| `hero-avatar-img-tag-revert` | SEALED | 2026-11-05 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-11-05/hero-avatar-img-tag-revert-seal.md`. |
