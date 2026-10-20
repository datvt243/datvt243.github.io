# 2026-10-20 - experience-career-break (plan)

- Worker: implementer · Version: 0.1.0
- Node: `experience-career-break` (`haven/diagrams/dev-loop.prime-mermaid.md`, new row appended, PENDING)
- Task (verbatim): `/todo #243, file api-standand.md là tôi thêm vào, hãy tính luôn nó khi ship` → issue #243 "feat(experience): hiển thị career break như LinkedIn"
- Branch: `feature/243` off freshly pulled `staging`

## Hub bytes before: 156912

## Code anchors (grep-confirmed)
- `types/resume-document.ts` `Experience` (raw API shape)
- `models/Experience.ts` `ExperienceModel`
- `utils/ResumeAdapter.ts` `toExperience`
- `themes/portfolio-dev/pages/resumeObject/Experiences.vue` (renders position/company)
- `themes/portfolio-dev/pages/resumeObject/Hero.vue` (`currentExperience.company` in summary)
- `server/utils/createPDFAts.ts` (ATS CV: `${position} — ${company}`)
- `i18n/locales/{vi,en}.json`

## Labels source
`../resume-nodejs-api` branch `origin/267-phn-experience-b-sung`, `src/locales/{vi,en}.ts` → `cv.careerBreak`, `cv.careerBreakTypes.*` (12 keys) — copied verbatim.

## Blockers
None. Env vars in `.env`: MY_EMAIL, NODE_API, GITHUB_TOKEN, GITHUB_USER set; PUPPETEER_EXECUTABLE_PATH not needed for this node unless PDF is exercised live.
Backend branch not yet released → live API has no career-break entry; browser check will need a mocked entry.
