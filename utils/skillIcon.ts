/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

/**
 * Only maps to logos actually present under public/svg/ — skill names come
 * from the API as free text, so unmatched skills just render without an icon
 * rather than guessing/faking one.
 */
const SKILL_ICONS: Record<string, string> = {
  javascript: 'js',
  typescript: 'typescript',
  vuejs: 'vue-js',
  vue: 'vue-js',
  nuxtjs: 'nuxt-js',
  nuxt: 'nuxt-js',
  reactjs: 'react-js',
  react: 'react-js',
  nextjs: 'next-js',
  next: 'next-js',
  nodejs: 'node-js',
  node: 'node-js',
  mongodb: 'mongodb',
  mongo: 'mongodb',
  bootstrap: 'bootstrap',
  tailwindcss: 'tailwindcss',
  tailwind: 'tailwindcss',
  git: 'git',
  sapui5: 'sapui5',
  pinia: 'pinia',
  gitlab: 'gitlab',
  github: 'github',
  sourcetree: 'sourcetree',
  mysql: 'mysql',
  postman: 'postman',
  html: 'html',
  htmlscss: 'html',
  html5scss: 'html',
  scss: 'sass',
  sass: 'sass',
  // Vuex and Vue Router ship under the Vue logo, React Hooks under React's
  vuex: 'vue-js',
  vuerouter: 'vue-js',
  reacthooks: 'react-js',
  expressjs: 'express',
  express: 'express',
  jest: 'jest',
  jira: 'jira',
  eslint: 'eslint',
  prettier: 'prettier',
  axios: 'axios',
  chatgpt: 'openai',
  openai: 'openai',
  claude: 'claude',
  css: 'css',
  docker: 'docker',
  redis: 'redis',
  postgresql: 'postgresql',
  postgres: 'postgresql',
  vitest: 'vitest',
  figma: 'figma',
  linux: 'linux',
  vscode: 'vscode',
  visualstudiocode: 'vscode',
  jquery: 'jquery',
  vite: 'vite',
  vitejs: 'vite',
  webpack: 'webpack',
  npm: 'npm',
}

/**
 * Icon file name under public/svg/ for a free-text skill name. Ignores a
 * parenthesized note and, as a fallback, a trailing version
 * ("JavaScript (ES6+)", "Vue.js 2 & 3"), but tries the exact key first so
 * "SAPUI5" keeps its digit.
 */
export function skillIcon(name: string): string | undefined {
  const key = name.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '')
  return SKILL_ICONS[key] ?? SKILL_ICONS[key.replace(/\d+$/, '')]
}
