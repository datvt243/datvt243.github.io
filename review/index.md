CV Website Review & Improvement Workflow

1. Purpose

This document is the central entry point for reviewing, improving, and validating my personal CV website.

The workflow consists of four sequential steps:

Step	File	Purpose
Step 1	STEP1.md	Initial audit from HR and Development Lead perspectives
Step 2	STEP2.md	Validate findings, identify root causes, and prioritize improvements
Step 3	STEP3.md	Implement approved improvements
Step 4	STEP4.md	QA, regression testing, and final acceptance review

The objective is to build a professional, reliable, accessible, maintainable, and recruiter-friendly CV website.

The goal is not simply to improve visual appearance. Every change should have a clear justification based on recruitment effectiveness, user experience, or engineering quality.

⸻

2. Role

Act as an independent review and implementation team consisting of:

* Senior HR / Technical Recruiter: Evaluates professional positioning, experience, achievements, and recruitment readiness.
* Senior Development Lead / Engineering Manager: Evaluates architecture, code quality, performance, maintainability, and engineering practices.
* Senior QA Engineer: Evaluates functionality, accessibility, responsiveness, reliability, and regressions.

Apply the appropriate role or combination of roles at each step.

Be objective, evidence-driven, and critical. Do not approve a recommendation simply because it was suggested by an AI agent.

⸻

3. Workflow Rules

3.1 Follow the prescribed order

Execute the steps in this order:

1. STEP1.md
2. STEP2.md
3. STEP3.md
4. STEP4.md

Do not skip a step or change the order unless explicitly authorized.

Each step must use the outputs of the previous step where applicable.

3.2 Read each step before execution

Before starting a step:

1. Read the complete contents of its corresponding Markdown file.
2. Understand its objectives, instructions, constraints, and expected outputs.
3. Identify required inputs and dependencies.
4. Execute the step according to its instructions.

Do not assume that the filename alone describes all requirements.

Do not replace a step’s detailed instructions with this index document.

3.3 Preserve traceability

Maintain a clear connection between:

* Original findings
* Verified issues
* Approved recommendations
* Implemented changes
* Test results
* Final acceptance decisions

Assign and preserve unique issue IDs whenever possible.

Do not silently remove, rename, or mark an issue as resolved without supporting evidence.

3.4 Evidence over assumptions

All important findings must be supported by available evidence.

Distinguish between:

* Verified findings
* Partially verified findings
* Unverified hypotheses
* Rejected findings
* Optional suggestions

Never fabricate test results, performance measurements, file paths, line numbers, personal achievements, or technical findings.

If evidence is unavailable, document the limitation and explain how the issue could be verified.

3.5 Minimize unnecessary changes

Prioritize improvements that provide meaningful value.

Avoid:

* Unnecessary architectural rewrites
* Unnecessary dependencies
* Overengineering
* Cosmetic changes without a clear benefit
* Unrelated refactoring
* Changes that duplicate existing functionality

Preserve existing behavior unless there is a justified reason to change it.

3.6 Protect existing work

Before making changes:

* Inspect the current Git branch and working tree.
* Identify existing uncommitted changes.
* Understand which files are relevant to the current task.
* Avoid overwriting unrelated user changes.
* Review the diff after implementation.

Do not discard changes, reset branches, force-push, or perform destructive Git operations without explicit authorization.

Do not deploy changes unless explicitly authorized.

⸻

4. Step Execution and Transition Rules

Step 1 — Initial Audit

Read and execute STEP1.md.

Expected output:

* Initial HR assessment
* Initial Development Lead assessment
* UX and visual design findings
* Technical findings
* Preliminary scores
* Evidence-backed recommendations
* Initial improvement roadmap

Transition condition:

The initial audit report must be available before proceeding to Step 2.

If website or repository access is limited, document the limitation rather than inventing findings.

Step 2 — Validate and Prioritize

Read and execute STEP2.md.

Use the initial audit from Step 1 as the primary input.

Expected output:

* Validated findings
* Root-cause analysis
* Rejected or deferred recommendations
* Prioritized issue register
* Approved implementation scope
* Testable acceptance criteria

Transition condition:

The implementation scope must be sufficiently clear to determine what should be changed and how success will be verified.

If a high-impact decision requires information from the website owner, ask for clarification instead of inventing an answer.

Do not begin implementation until the requirements are sufficiently clear and any required user approvals have been obtained.

Step 3 — Implement Approved Changes

Read and execute STEP3.md.

Use the approved implementation scope from Step 2.

Expected output:

* Implemented changes
* Files modified
* Issues addressed
* Tests and validation performed
* Known limitations
* Implementation summary

Transition condition:

The implementation report must identify what changed and which acceptance criteria remain unverified.

Do not claim completion merely because the source code has been modified.

Do not deploy without authorization.

Step 4 — QA and Final Acceptance

Read and execute STEP4.md.

Use the approved issue register and implementation report as the testing baseline.

Expected output:

* Acceptance criteria results
* Functional test results
* Regression findings
* Responsive and accessibility results
* Performance and reliability findings
* HR review
* Development Lead review
* Final defect register
* Release recommendation

Transition condition:

Every approved issue must have a documented final status.

The final report must distinguish between passed tests, failed tests, blocked tests, and untested behavior.

⸻

5. Handling Failures and Blockers

If a step cannot be completed:

1. Identify the blocker.
2. Explain its impact.
3. Record what has already been completed.
4. Identify the missing information, tool, permission, or prerequisite.
5. Recommend the smallest action required to unblock progress.

Do not silently skip the step.

Do not proceed as if the step had passed.

If a blocking issue requires a decision from me, stop at the relevant decision point and ask for that decision.

If only part of a step is blocked, complete the independent work that can be performed safely and accurately.

⸻

6. Execution Modes

Support two execution modes.

Mode A — Single-Step Execution

Execute only the requested step.

Examples:

* Run Step 1.
* Validate the findings from Step 1.
* Implement the approved changes from Step 2.
* Run the final QA review.

Do not execute subsequent steps automatically unless explicitly requested.

Mode B — Full Workflow

When I explicitly request the complete workflow, execute Steps 1 through 4 in sequence.

For each step:

1. Read its instructions.
2. Verify its prerequisites.
3. Execute the work.
4. Produce and preserve the required output.
5. Check the transition conditions.
6. Continue only when the next step is authorized and its prerequisites are satisfied.

If user approval is required, stop and request it.

Do not interpret a request to run the full workflow as permission to deploy to production.

⸻

7. Progress Tracking

Maintain a workflow status table in the final report and, when useful, in a dedicated progress document.

Use the following statuses:

* NOT STARTED
* IN PROGRESS
* BLOCKED
* NEEDS REVIEW
* COMPLETED

Example:

Step	Status	Main Output	Remaining Blockers
Step 1	NOT STARTED	Initial audit report	None identified
Step 2	NOT STARTED	Validated issue register	Depends on Step 1
Step 3	NOT STARTED	Implementation report	Depends on approved Step 2 scope
Step 4	NOT STARTED	QA and release report	Depends on Step 3

Update the table based on actual progress.

Never mark a step COMPLETED if its required outputs are missing or its completion criteria have not been met.

Do not create duplicate progress documents unnecessarily.

⸻

8. Final Deliverables

After the complete workflow has been executed, provide a consolidated report containing:

A. Executive Summary

Summarize the initial state of the website, the major improvements made, and the remaining risks.

B. Audit Findings

Summarize the most important HR, engineering, UX, and reliability findings.

C. Implementation Summary

List the significant changes and the issue IDs they address.

D. Verification Results

Summarize the tests performed, their actual results, and any limitations.

E. Remaining Issues

List unresolved defects, deferred recommendations, and items requiring further investigation.

F. Final Assessment

Provide separate conclusions from:

* HR / Technical Recruiter
* Development Lead / Engineering Manager
* QA Engineer

G. Release Recommendation

Choose one:

* READY FOR RELEASE
* READY WITH KNOWN LIMITATIONS
* NOT READY FOR RELEASE
* INSUFFICIENT EVIDENCE

Explain the decision based on the available evidence.

⸻

9. Definition of Success

The workflow is successful when:

1. The website’s important weaknesses have been investigated.
2. Findings have been validated instead of blindly accepted.
3. Changes have been limited to justified, approved improvements.
4. Implementation decisions are traceable to identified issues.
5. Acceptance criteria have been tested where possible.
6. Regressions and remaining defects have been documented.
7. HR can understand the candidate’s professional value clearly.
8. The implementation demonstrates sound engineering judgment.
9. The website is usable, reliable, and appropriate for its intended recruitment purpose.
10. The final release recommendation reflects actual evidence rather than assumptions.

A successful build alone does not establish that the website is ready for recruiters.

⸻

10. Final Instruction

Use this file as the central workflow coordinator.

For every requested operation:

1. Determine which step applies.
2. Read the corresponding STEPn.md file.
3. Follow its complete instructions.
4. Check the relevant prerequisites and transition conditions.
5. Preserve evidence and issue traceability.
6. Report the actual result.

Do not execute all four steps merely because this index file exists.

Execute only the step or workflow that I explicitly request.

When I request the full workflow, follow the four steps in order and respect all approval gates.

The quality of the final result matters more than the speed of execution.
