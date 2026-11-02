import { beforeEach, describe, expect, it, vi } from 'vitest'
import { escapeHtml } from '@/utils/escapeHtml'
import { buildSkillGroupTsLines, buildSkillsTsLines } from '@/utils/tsCodeLines'

const text = (lines: { html: string }[]) => lines.map((l) => l.html.replace(/<[^>]+>/g, ''))
const groups = [
  { label: 'Languages', skills: [{ name: 'TypeScript' }] },
  { label: 'Vue ecosystem', skills: [{ name: 'Nuxt' }] },
]

beforeEach(() => vi.stubGlobal('escapeHtml', escapeHtml))

describe('skills.ts / skill-group.ts lines', () => {
  it('skills.ts imports SkillGroup instead of declaring it', () => {
    const lines = text(buildSkillsTsLines(groups))
    expect(lines[0]).toBe("import { SkillGroup } from './skill-group'")
    expect(lines.some((l) => l.includes('enum'))).toBe(false)
    expect(lines).toContain('[SkillGroup.VueEcosystem]: [')
  })

  it('skill-group.ts exports the enum with every group', () => {
    expect(text(buildSkillGroupTsLines(groups))).toEqual([
      'export enum SkillGroup {',
      "Languages = 'Languages',",
      "VueEcosystem = 'Vue ecosystem',",
      '}',
    ])
  })
})
