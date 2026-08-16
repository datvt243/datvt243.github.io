# doctrine/INDEX.md — map of the doctrine

> Doctrine is VERIFIED TRUTH. Guesses and half-formed ideas do NOT belong
> here — they belong in an `evidence/` note or a diagram note.

## Read in this order
| File | What it is | When you need it |
|---|---|---|
| `SOUL.md` | The hub agent's identity | Before deciding to change anything on your own |
| `MEMORY.md` | Exact paths, stack, commands | Every session, right at the start |
| `domains/PROJECT.md` | This project's own ground truth (including traps inherited from `agent-hub/histories/`) | Before implementing |
| `standards/edit-verification.md` | The rule against claiming things you haven't observed | Before reporting "done" |
| `standards/recipes.md` | What a recipe is, when to write one | When repeating a process for the 2nd time |

## The three kinds of knowledge here
| Kind | Home | Example |
|---|---|---|
| About the hub | `SOUL.md` / `MEMORY.md` | The exact build/lint command |
| About the domain/project | `domains/PROJECT.md` | This project's own invariants (never push to main, no test suite...) |
| About how to work | `standards/*.md` | The required recipe format |

A fact in the wrong drawer is a fact nobody trusts.

## Growing the doctrine
Only add a file/section when ALL 3 are true: (1) verified, (2) durable, (3)
NOT INFERABLE — an agent reading the code for 2 minutes couldn't figure it
out on their own. Fails (3)? Don't write it — doctrine that just echoes the
code goes stale silently and misleads readers.

## Correcting the doctrine
Fix the file, AND write "what I used to believe / what's actually true"
into the Corrections table in the relevant worker's `MEMORY.md`. Silently
deleting a wrong fact loses the lesson behind it too.

## Deliberately absent
No `laws/`, `architecture/`, `uplifts/`, `training/`. Only add these once
there's a real lesson that actually needs it — not preemptively.

## Migrated from `agent-hub/histories/`
`histories/2026-08-11.md` and `histories/2026-08-13.md` are the old
work-log (the convention before this hub existed) — KEPT AS-IS, not
deleted, still valuable as detailed narrative reference. Every durable
trap/decision in them has been distilled and written into
`domains/PROJECT.md`. From 2026-08-16 onward, the new audit trail goes into
`evidence/`, not `histories/` anymore.
