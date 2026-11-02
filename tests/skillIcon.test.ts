import { describe, expect, it } from 'vitest'
import { skillIcon } from '@/utils/skillIcon'

describe('skillIcon', () => {
  it('matches API names that carry a note or a version', () => {
    expect(['JavaScript (ES6+)', 'TypeScript', 'Vue.js 2 & 3', 'SAPUI5', 'Git', 'Nuxt 3'].map(skillIcon)).toEqual([
      'js',
      'typescript',
      'vue-js',
      'sapui5',
      'git',
      'nuxt-js',
    ])
  })

  it('returns undefined for a name without a logo', () => {
    expect(skillIcon('Composition API')).toBeUndefined()
  })
})
