import { existsSync } from 'node:fs'
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

  it('matches the remaining resume skills that have a logo', () => {
    expect(
      ['HTML5/SCSS', 'Express.js', 'Jest', 'Jira', 'ESLint', 'Prettier', 'Axios', 'ChatGPT', 'Claude', 'Vuex', 'Vue Router', 'React Hooks'].map(
        skillIcon,
      ),
    ).toEqual(['html', 'express', 'jest', 'jira', 'eslint', 'prettier', 'axios', 'openai', 'claude', 'vue-js', 'vue-js', 'react-js'])
  })

  it('matches common skills not in the resume yet', () => {
    expect(
      ['CSS3', 'Docker', 'Redis', 'PostgreSQL', 'Vitest', 'Figma', 'Linux', 'VS Code', 'jQuery', 'Vite', 'Webpack', 'npm'].map(skillIcon),
    ).toEqual(['css', 'docker', 'redis', 'postgresql', 'vitest', 'figma', 'linux', 'vscode', 'jquery', 'vite', 'webpack', 'npm'])
  })

  it('returns undefined for a name without a logo', () => {
    expect(['Composition API', 'SAP Fiori', 'i18n'].map(skillIcon)).toEqual([undefined, undefined, undefined])
  })

  it('only maps to files present under public/svg/', () => {
    const names = ['Express.js', 'ChatGPT', 'CSS', 'Docker', 'Redis', 'PostgreSQL', 'Vitest', 'Figma', 'Linux', 'VS Code', 'jQuery', 'Vite', 'Webpack', 'npm', 'Jest', 'Jira', 'ESLint', 'Prettier', 'Axios', 'Claude']
    for (const name of names) expect(existsSync(`public/svg/${skillIcon(name)}.svg`), name).toBe(true)
  })
})
