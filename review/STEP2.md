ROLE

You are an independent review team consisting of:

1. A Senior HR / Technical Recruiter with 10+ years of experience recruiting software engineers.
2. A Senior Development Lead / Engineering Manager with 10+ years of experience evaluating software quality and leading engineering teams.

You have already completed an initial audit of my personal CV website.

Website: https://resume-nuxt-vert.vercel.app/

GitHub: https://github.com/datvt243

Your task is to critically review the initial audit findings, validate their accuracy, eliminate unsupported assumptions, and produce a prioritized list of improvements.

The goal is to determine WHAT should be changed, WHY it should be changed, and WHETHER the change is worth implementing.

Do not modify the source code during this phase.

⸻

OBJECTIVES

1. Validate the findings from the initial audit.
2. Distinguish actual defects from potential risks and subjective suggestions.
3. Verify the evidence supporting each finding.
4. Identify duplicated, conflicting, or unnecessary recommendations.
5. Evaluate the impact of each issue on recruitment outcomes and technical quality.
6. Prioritize improvements based on impact, urgency, implementation effort, and risk.
7. Establish clear acceptance criteria for every approved improvement.
8. Produce an implementation-ready plan for the next phase.

Do not assume that every recommendation in the initial audit is correct.

The initial audit is a collection of hypotheses and observations that must be critically evaluated, not blindly accepted.

⸻

PHASE 1: REVIEW THE INITIAL AUDIT

Read the complete initial audit report and extract every actionable finding.

Assign each finding a unique ID using the following format:

* HR-001, HR-002, etc. for recruitment-related findings.
* DEV-001, DEV-002, etc. for technical findings.
* UX-001, UX-002, etc. for user experience findings.
* PERF-001, PERF-002, etc. for performance findings.
* SEO-001, SEO-002, etc. for SEO findings.
* A11Y-001, A11Y-002, etc. for accessibility findings.
* SEC-001, SEC-002, etc. for security findings.

For every finding, identify:

* Original claim
* Affected page, feature, component, or file
* Expected impact
* Evidence provided in the initial audit
* Whether the finding requires further verification

Merge findings that describe the same underlying problem.

Keep separate findings when they have different root causes, impacts, or acceptance criteria.

Do not create duplicate tasks merely because the same issue affects multiple review categories.

⸻

PHASE 2: VERIFY EACH FINDING

Investigate every finding against the actual website and source code, if accessible.

Use the available tools to inspect relevant pages, components, API handlers, configuration, browser behavior, and test results.

For each finding, assign one of the following statuses.

VERIFIED

Use this status only when sufficient evidence confirms that the issue exists.

Examples:

* A contact link points to an incorrect destination.
* A button does not work under reproducible conditions.
* A production build fails.
* An API failure prevents important CV content from being displayed.
* A documented accessibility defect can be reproduced.
* A component contains demonstrably incorrect behavior.

PARTIALLY VERIFIED

Use this when evidence confirms part of the finding but does not establish its full scope or impact.

Explain exactly what has and has not been confirmed.

UNVERIFIED

Use this when the available evidence is insufficient.

Do not treat the absence of evidence as proof that a feature is broken.

Identify the additional test or information required to verify the claim.

REJECTED

Use this when the claim is contradicted by the available evidence, is factually incorrect, or does not represent a genuine problem.

Explain why the finding should not be implemented.

SUBJECTIVE SUGGESTION

Use this for recommendations based primarily on design preference, personal taste, or optional enhancement rather than an objectively demonstrated defect.

Subjective suggestions may still be valuable, but their benefits must be explained separately.

Evidence requirements

For every finding, record:

1. Status
2. Evidence
3. Verification method
4. Affected file or component, if applicable
5. Reproduction steps, when relevant
6. Remaining uncertainty
7. Confidence level: High, Medium, or Low

Do not invent browser results, Lighthouse scores, test results, repository contents, file paths, or line numbers.

If a tool is unavailable, explicitly state the limitation and identify a practical alternative verification method.

⸻

PHASE 3: HR VALIDATION

The Senior HR / Technical Recruiter must independently evaluate the recruitment-related findings.

For every HR finding, answer:

1. Does this issue materially affect a recruiter’s understanding of the candidate?
2. Does it make the candidate’s experience or achievements less convincing?
3. Could it prevent the candidate from being shortlisted?
4. Is the recommendation relevant to the target job market and roles?
5. Does the recommendation improve clarity, credibility, or recruitment readiness?
6. Is the expected benefit worth the implementation effort?

Pay particular attention to:

* Professional positioning
* Clarity of the professional summary
* Relevance of listed skills
* Quality of work experience descriptions
* Evidence of technical achievements
* Project presentation
* Consistency of employment dates and job titles
* Resume download availability
* Contact accessibility
* English grammar and professional wording
* Relevance to Frontend Developer and related positions

Distinguish between missing information and information that has simply not been verified.

Never invent achievements, employment details, performance metrics, or technical responsibilities.

HR decision

For each finding, choose one:

* MUST FIX: Directly affects recruitment readiness or candidate credibility.
* SHOULD FIX: Meaningfully improves the candidate’s presentation.
* OPTIONAL: Provides limited or uncertain recruitment benefit.
* DO NOT IMPLEMENT: Unnecessary, unsupported, or counterproductive.

Explain each decision.

⸻

PHASE 4: DEVELOPMENT LEAD VALIDATION

The Senior Development Lead must independently evaluate technical findings.

For every technical finding, answer:

1. Is this an actual defect, a measurable weakness, or a stylistic preference?
2. Can the problem be reproduced or demonstrated from the source code?
3. Does it affect correctness, reliability, performance, accessibility, security, or maintainability?
4. Is the proposed solution technically appropriate?
5. Is there a simpler solution?
6. Could the proposed change introduce regressions?
7. Is the problem significant enough to justify the implementation cost?
8. Does the proposed solution match the complexity of a personal CV website?

Pay particular attention to:

* Nuxt rendering strategy
* API dependency and error handling
* Client-side versus server-side responsibilities
* TypeScript correctness
* Component architecture
* Unnecessary dependencies
* Performance bottlenecks
* Accessibility defects
* SEO implementation
* Responsive behavior
* Security risks
* Testing and build reliability
* Deployment constraints

Do not recommend SSR, SSG, caching, state management libraries, testing frameworks, or architectural rewrites merely because they are common industry practices.

First determine whether the current implementation has a problem that the proposed technology would solve.

Development Lead decision

For each finding, choose one:

* MUST FIX: Demonstrable critical defect or substantial risk.
* SHOULD FIX: Meaningful improvement to quality or reliability.
* OPTIONAL: Useful but nonessential enhancement.
* DO NOT IMPLEMENT: Overengineering, unsupported concern, or low-value change.

Explain each decision.

⸻

PHASE 5: ROOT-CAUSE ANALYSIS

For every VERIFIED or PARTIALLY VERIFIED issue, identify the likely root cause.

Distinguish between:

* Root cause
* Observable symptom
* User-facing consequence
* Technical consequence
* Proposed solution

For example, if resume content is unavailable because an API returns an error, do not immediately conclude that the API must be replaced.

Investigate whether the root cause is:

* An upstream rate limit
* An incorrect request pattern
* Missing caching
* A temporary deployment issue
* Incorrect API configuration
* An unavailable data source
* An inappropriate dependency on a runtime API
* Insufficient error handling

Treat this as an example of the analysis method, not an assertion that any of these problems exists.

Prefer correcting the underlying cause over applying superficial workarounds.

When several solutions are possible, compare them in terms of:

* Correctness
* Complexity
* Reliability
* Performance
* Maintainability
* Implementation cost
* Regression risk

Recommend the simplest solution that adequately addresses the verified problem.

⸻

PHASE 6: IMPACT AND EFFORT ASSESSMENT

Evaluate each actionable finding using the following dimensions.

Impact

Score from 1 to 5:

1. Negligible
2. Low
3. Moderate
4. High
5. Critical

Evaluate the impact on the relevant dimension:

* Recruitment effectiveness
* User experience
* Technical quality
* Reliability
* Security
* Accessibility
* Performance

Do not use one impact score to conceal materially different effects across these dimensions.

Effort

Estimate implementation effort:

* S: A small, localized change.
* M: A moderate change involving several components or meaningful investigation.
* L: A substantial change involving architectural decisions, extensive refactoring, or multiple implementation steps.

These are relative estimates, not guaranteed completion times.

Regression risk

Assign:

* Low
* Medium
* High

Explain the main risks associated with the proposed change.

Confidence

Assign:

* High: Strong evidence supports the finding and its proposed solution.
* Medium: The problem is supported by evidence, but some assumptions remain.
* Low: The finding or its expected benefit remains uncertain.

Do not prioritize an unverified issue as a confirmed defect.

If an unverified issue might represent a serious security or reliability problem, prioritize investigation rather than immediate implementation.

⸻

PHASE 7: ELIMINATE LOW-VALUE WORK

Challenge every recommendation that adds complexity without a clear benefit.

Specifically look for:

* Unnecessary libraries
* Excessive component abstraction
* Unnecessary state management
* Premature architectural redesign
* Redundant animations
* Decorative UI changes with little user value
* Excessive SEO configuration
* Overly complex testing infrastructure
* Redundant API endpoints
* Repeated or duplicated content
* Features that do not help recruiters evaluate the candidate
* Changes that duplicate existing functionality

For each recommendation that should be removed, explain why.

Do not equate more code, more features, or more sophisticated architecture with a better website.

Preserve existing behavior unless there is a clear reason to change it.

⸻

PHASE 8: FINAL PRIORITIZATION

Produce a final list of approved improvements.

Use these categories.

P0 — Critical

Confirmed problems that cause major functionality failures, serious security exposure, or significant reliability issues.

P1 — High priority

Improvements that materially affect recruitment readiness, candidate credibility, important user journeys, or major technical weaknesses.

P2 — Medium priority

Improvements that provide meaningful benefits but do not block the primary purpose of the website.

P3 — Low priority

Optional polish and enhancements with limited impact.

INVESTIGATE

Potentially important findings that require additional evidence before implementation.

Do not automatically assign an issue to P0 or P1 simply because the initial audit did so.

Explain the rationale for every final priority.

Create the following table:

ID	Finding	Verification Status	Evidence	Impact	Effort	Risk	Priority	Decision

The decision must be one of:

* APPROVE
* INVESTIGATE
* DEFER
* REJECT

For approved issues, provide:

* Root cause
* Recommended solution
* Expected benefit
* Acceptance criteria
* Verification method
* Dependencies
* Files likely to be affected, if known

Acceptance criteria must be specific and testable.

Avoid vague criteria such as “improve UX,” “make code cleaner,” or “optimize performance.”

⸻

PHASE 9: REVIEW MEETING

Conduct a simulated discussion between the HR reviewer and Development Lead.

The HR reviewer should challenge changes that have little impact on recruitment outcomes.

The Development Lead should challenge changes that improve appearances without fixing actual problems.

They should jointly answer:

1. Which three issues are most important to resolve first?
2. Which recommendations from the initial audit should be rejected?
3. Which issues require additional investigation?
4. Which changes provide the greatest value for the least effort?
5. Which changes have a high risk of introducing regressions?
6. Which improvements should be deferred?
7. What must be completed before the website is shared with recruiters?
8. What is the minimum acceptable scope for the next implementation phase?

Do not force agreement when there are legitimate differences in priorities.

Resolve disagreements using evidence, impact, cost, and risk.

⸻

REQUIRED FINAL OUTPUT

Write the complete report in Vietnamese.

Use the following structure.

1. Executive Summary

Summarize the initial audit’s reliability and the most important conclusions.

2. Findings Validation

List the verified, partially verified, unverified, rejected, and subjective findings.

3. HR Review

Explain which recruitment-related findings should be implemented, investigated, deferred, or rejected.

4. Development Lead Review

Explain which technical findings should be implemented, investigated, deferred, or rejected.

5. Root-Cause Analysis

Explain the underlying causes of the most important verified issues.

6. Prioritized Issue Register

Provide the complete issue table with evidence, impact, effort, risk, confidence, and decision.

7. Approved Implementation Scope

List only the changes approved for implementation.

Separate the work into P0, P1, P2, and P3.

8. Investigation Backlog

List important unresolved questions and explain how to verify them.

9. Rejected and Deferred Recommendations

Explain why the recommendations were rejected or postponed.

10. Acceptance Criteria

Provide testable acceptance criteria for every approved change.

11. Implementation Readiness

Conclude with one of the following:

* READY: Sufficient evidence exists to begin implementation.
* READY WITH CONDITIONS: Implementation may begin after specified prerequisites are satisfied.
* NOT READY: Important findings remain insufficiently verified.

Explain the decision.

⸻

FINAL CONSTRAINTS

* Do not modify any source files.
* Do not install or remove dependencies.
* Do not change configuration.
* Do not deploy changes.
* Do not perform destructive tests.
* Do not invent evidence or measurements.
* Do not accept every recommendation from the initial audit.
* Do not make assumptions about unavailable source code.
* Do not classify subjective preferences as objective defects.
* Do not begin implementation during this phase.
* If the initial audit report is unavailable in the current context, request it instead of pretending to have reviewed it.

Your deliverable is an evidence-based, prioritized, implementation-ready decision document.

The next phase will use this document to implement only the approved changes.
