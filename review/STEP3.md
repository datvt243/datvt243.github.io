Based on the completed CV website audit, implement the approved improvements in the existing repository.

Objectives

Improve the website’s recruitment effectiveness, content clarity, UX, accessibility, performance, reliability, and code maintainability.

Implementation Rules

1. Use the approved audit report as the source of truth.
2. Address verified P0 issues first, followed by high-impact P1 issues.
3. Do not implement every suggestion automatically.
4. Prioritize improvements that provide measurable user value.
5. Preserve the existing technology stack unless a change is justified by clear evidence.
6. Avoid unnecessary dependencies, abstractions, and architectural rewrites.
7. Preserve accurate resume information and professional achievements.
8. Never invent work experience, metrics, qualifications, or project outcomes.
9. Preserve existing functionality unless the approved plan explicitly requires a change.
10. Do not expose secrets or sensitive information.
11. Do not introduce breaking changes without explaining their impact.
12. Do not claim that a fix works until it has been verified.

Workflow

Step 1: Establish a baseline

Inspect the current repository and identify the files affected by the approved improvements.

Check the existing build, linting, type checking, and tests where available.

Do not overwrite unrelated changes in the working tree.

Step 2: Create an implementation plan

Group the approved issues into small, logical batches.

For each batch, identify:

* Target files
* Intended changes
* Expected benefits
* Potential risks
* Verification criteria

Step 3: Implement incrementally

Make focused changes instead of rewriting the entire project.

After each logical batch:

* Inspect the diff.
* Check for regressions.
* Run relevant tests and validation commands.
* Verify the intended behavior.
* Update the issue register.

If a proposed fix requires information that is unavailable, stop and ask for clarification rather than inventing details.

Step 4: Verify the results

Where appropriate, verify:

* Production build
* Type checking
* Linting
* Automated tests
* Responsive behavior
* Keyboard navigation
* Accessibility
* SEO metadata
* Loading and error states
* API failure handling
* External links
* Resume download
* Performance measurements

Report only checks that were actually performed.

Step 5: Final report

Provide:

1. Summary of implemented changes.
2. Files modified and the purpose of each change.
3. Audit issue IDs resolved.
4. Verification commands and actual results.
5. Remaining issues.
6. Known limitations.
7. Potential regressions or risks.
8. Recommended next steps.

Do not mark an issue as resolved unless its acceptance criteria have been satisfied.

The goal is a demonstrably better website, not simply a larger code diff.
