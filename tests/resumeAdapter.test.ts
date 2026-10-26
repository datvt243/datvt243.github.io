import { describe, expect, it } from 'vitest'
import { resumeAdapter } from '@/utils/ResumeAdapter'

describe('resumeAdapter', () => {
  it('gives a skill without a group the Other group', () => {
    expect(resumeAdapter.toSkill({ name: 'Git', exp: 3 })).toMatchObject({ name: 'Git', yearsOfExperience: 3, group: 'Other' })
  })

  it('turns timestamps into dates and missing ones into null', () => {
    const experience = resumeAdapter.toExperience({ company: 'ACME', startDate: Date.UTC(2024, 0, 1) })
    expect(experience.startDate).toEqual(new Date(Date.UTC(2024, 0, 1)))
    expect(experience.endDate).toBeNull()
  })
})
