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
    outward -- no --> build[npm run build + npm run lint<br/>from doctrine/MEMORY.md]
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

















| `fix-generate-pdf-vercel-chromium` | SEALED | 2026-09-20 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-09-20/fix-generate-pdf-vercel-chromium-seal.md`. |

| `cv-download-toast` | SEALED | 2026-09-20 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-09-20/cv-download-toast-seal.md`. |

| `github-updated-date-tz` | SEALED | 2026-09-20 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-09-20/github-updated-date-tz-seal.md`. |
| `ats-cv-template-local` | SEALED | 2026-10-04 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-10-04/ats-cv-template-local-seal.md`. |
| `comment-cleanup-standardize` | SEALED | 2026-10-04 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-10-04/comment-cleanup-standardize-seal.md`. |
| `comment-style-followup` | SEALED | 2026-10-04 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-10-04/comment-style-followup-seal.md`. |
| `author-github-see-line` | SEALED | 2026-10-04 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-10-04/author-github-see-line-seal.md`. |
| `object-parameter-rule` | SEALED | 2026-10-04 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/verifier/2026-10-04/object-parameter-rule-seal.md`. |
| `vim-key-nav` | SEALED | 2026-10-18 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-10-18/vim-key-nav-{plan,diff}.md`. |
| `vim-key-nav-hint` | SEALED | 2026-10-18 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-10-18/vim-key-nav-hint-{plan,diff}.md`. |
| `vim-key-nav-extension-note` | SEALED | 2026-10-18 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-10-18/vim-key-nav-extension-note-{plan,diff}.md`. |
| `vim-key-nav-tab-badges` | SEALED | 2026-10-18 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-10-18/vim-key-nav-tab-badges-{plan,diff}.md`. |
| `vim-key-nav-page-shortcuts` | SEALED | 2026-10-18 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-10-18/vim-key-nav-page-shortcuts-{plan,diff}.md`. |

Any regression must be a **new node** (LAI-13) — never edit an old node's
PM status directly to "undo" an existing SEAL.
| `vim-key-nav-github-search` | SEALED | 2026-10-19 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-10-19/vim-key-nav-github-search-diff.md`. |
| `header-drop-brand-desktop` | SEALED | 2026-10-19 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-10-19/header-drop-brand-desktop-diff.md`. |
| `resume-tab-autoscroll` | SEALED | 2026-10-19 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-10-19/resume-tab-autoscroll-diff.md`. |
| `ui-review-239` | SEALED | 2026-10-19 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-10-19/ui-review-239-diff.md`. |
| `hero-contact-to-page` | SEALED | 2026-10-19 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-10-19/hero-contact-to-page-diff.md`. |
| `experience-career-break` | SEALED | 2026-10-20 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-10-20/experience-career-break-{plan,diff}.md`. |
| `resume-api-error-standard` | SEALED | 2026-10-21 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-10-21/resume-api-error-standard-{plan,diff}.md`. |
