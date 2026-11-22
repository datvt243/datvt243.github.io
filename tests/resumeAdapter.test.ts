import { describe, expect, it } from 'vitest'
import { toAward, toCertificate, toEducation, toExperience, toHero, toProject, toSkill, toSocialMedia } from '@/utils/ResumeAdapter'

// Mid-month, so the local-time month label is the same in every timezone.
const jan2024 = Date.UTC(2024, 0, 15)
const mar2025 = Date.UTC(2025, 2, 15)

describe('ResumeAdapter mappers', () => {
  it('gives a skill without a group the Other group', () => {
    expect(toSkill({ name: 'Git', exp: 3 })).toEqual({ name: 'Git', yearsOfExperience: 3, group: 'Other' })
  })

  it('turns timestamps into dates and missing ones into null', () => {
    const experience = toExperience({ company: 'ACME', startDate: jan2024 })
    expect(experience.startDate).toEqual(new Date(jan2024))
    expect(experience.endDate).toBeNull()
    expect(experience.dateRangeLabel).toBe('01/2024 - --/--')
  })

  it('computes the derived labels', () => {
    const experience = toExperience({ startDate: jan2024, isCurrent: true, description: '<ul><li>One</li><li>Two</li></ul>' })
    expect(experience.dateRangeLabel).toBe('01/2024 - present')
    expect(experience.descriptionItems).toEqual(['One', 'Two'])

    const education = toEducation({ startDate: jan2024, endDate: mar2025, description: '<p>IT </p>' })
    expect([education.startDateLabel, education.endDateLabel, education.descriptionText]).toEqual(['01/2024', '03/2025', 'IT'])

    const project = toProject({ name: 'My Cool App', startDate: jan2024, endDate: mar2025, description: '<b>Text</b>' })
    expect([project.slug, project.dateRangeLabel, project.descriptionText]).toEqual(['my-cool-app', '01/2024 - 03/2025', 'Text'])

    expect(toHero({ firstName: 'Dat', lastName: 'Vo' }, {}).fullName).toBe('Dat Vo')
  })

  it('labels certificates and awards, with "present" for a certificate that never expires', () => {
    expect(toCertificate({ name: 'C', startDate: jan2024, endDate: mar2025, description: '<b>x</b>' })).toEqual({
      name: 'C',
      organization: '',
      startDateLabel: '01/2024',
      endDateLabel: '03/2025',
      descriptionText: 'x',
    })
    expect(toCertificate({ startDate: jan2024, endDate: mar2025, isNoExpiration: true }).endDateLabel).toBe('present')
    expect(toAward({ name: 'A', issueDate: mar2025 })).toEqual({ name: 'A', organization: '', issueDateLabel: '03/2025', descriptionText: '' })
  })

  it('hides a blank career or one that repeats the position', () => {
    expect(toHero({}, { positionDesired: 'Dev', career: ' IT ' }).career).toBe('IT')
    expect(toHero({}, { positionDesired: 'Dev', career: ' Dev ' }).career).toBe('')
    expect(toHero({}, { career: '   ' }).career).toBe('')
  })

  it('lists only the non-empty social links, in field order', () => {
    expect(toSocialMedia({ website: 'https://w.example', github: 'https://g.example' }).links).toEqual([
      { name: 'github', url: 'https://g.example' },
      { name: 'website', url: 'https://w.example' },
    ])
  })
})
