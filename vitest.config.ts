import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = fileURLToPath(new URL('.', import.meta.url))

// Plain Vitest, no Nuxt runtime: the tested code is pure, and the few Nitro globals it uses are stubbed per test.
export default defineConfig({
  resolve: { alias: { '@': root, '~': root } },
  test: { include: ['tests/**/*.test.ts'] },
})
