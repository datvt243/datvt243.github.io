import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { scriptCsp } from '@/server/utils/scriptCsp'

const sha = (s: string) => `'sha256-${createHash('sha256').update(s).digest('base64')}'`

describe('scriptCsp', () => {
  it('hashes inline scripts and importmaps, skips src scripts and JSON data', () => {
    const html = [
      '<script type="importmap">{"imports":{}}</script>',
      '<script>window.__NUXT__={}</script>',
      '<script type="module" src="/_nuxt/entry.js" crossorigin></script>',
      '<script type="application/json" id="__NUXT_DATA__">[1]</script>',
      '<script type="application/ld+json">{}</script>',
      '<script>window.__NUXT__={}</script>',
    ].join('')
    expect(scriptCsp(html)).toBe(
      `script-src 'self' ${sha('{"imports":{}}')} ${sha('window.__NUXT__={}')} 'unsafe-hashes' ${sha("this.setAttribute('data-error', 1)")} https://giscus.app; object-src 'none'; base-uri 'self'`,
    )
  })
})
