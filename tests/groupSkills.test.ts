import { describe, expect, it } from 'vitest'
import { groupSkills } from '@/utils/groupSkills'

const skill = (name: string, group?: string) => ({ name, group })

describe('groupSkills', () => {
  it('derives groups from the skills when the listed groups are empty', () => {
    const groups = groupSkills([], [skill('Vue', 'Framework'), skill('TS', 'Languages'), skill('Nuxt', 'Framework')])
    expect(groups).toEqual([
      { label: 'Framework', skills: [skill('Vue', 'Framework'), skill('Nuxt', 'Framework')] },
      { label: 'Languages', skills: [skill('TS', 'Languages')] },
    ])
  })

  it('keeps listed groups first, then unlisted ones, and Other last', () => {
    const labels = groupSkills(['Languages'], [skill('Jest', 'Other'), skill('Vue', 'Framework'), skill('TS', 'Languages')]).map((g) => g.label)
    expect(labels).toEqual(['Languages', 'Framework', 'Other'])
  })

  it('puts a skill without a group under Other and drops empty groups', () => {
    const groups = groupSkills(['Database'], [skill('Git')])
    expect(groups).toEqual([{ label: 'Other', skills: [skill('Git')] }])
  })
})
