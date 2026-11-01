import { createHash } from 'node:crypto'

// Scripts with a src, and JSON data blocks (never executed), need no hash.
const INLINE_SCRIPT = /<script\b(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi
const DATA_BLOCK = /\btype=["']?application\/(?:ld\+)?json/i
// The one inline handler we emit: NuxtImg's SSR `onerror` (@nuxt/image NuxtImg.vue), allowed by exact hash only.
const NUXT_IMG_ONERROR = `'sha256-${createHash('sha256').update("this.setAttribute('data-error', 1)").digest('base64')}'`

/**
 * script-src for one rendered page: 'self', Giscus, and a sha256 for each
 * inline script in that exact HTML. Hashing the response itself (instead of
 * at build time) keeps it right when runtime config changes the inline
 * config script, and ISR caches the header with the body it was made from.
 */
export const scriptCsp = (html: string): string => {
  const hashes = new Set<string>()
  for (const [, attrs, body] of html.matchAll(INLINE_SCRIPT)) {
    if (DATA_BLOCK.test(attrs!) || !body) continue
    hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`)
  }
  return ["script-src 'self'", ...hashes, "'unsafe-hashes'", NUXT_IMG_ONERROR, 'https://giscus.app'].join(' ') + "; object-src 'none'; base-uri 'self'"
}
