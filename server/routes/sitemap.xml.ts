/**
 * @file sitemap.xml covering the static routes plus one <url> per
 * blog post, each in both locales with hreflang alternates, sourced from
 * the same cached post fetch as /api/blogs/posts.
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import type { PaginatedPosts } from '@/types'
import { cacheGetPosts } from '~/server/utils/cacheGetPost'
import { SITE_URL } from '~/server/utils/siteUrl'

const STATIC_ROUTES = ['/', '/projects', '/github', '/blogs', '/contact']

/** hreflang values match nuxt.config.ts's i18n `language` codes, the same ones the pages' alternate tags use. */
const LOCALES = [
  { hreflang: 'vi-VN', prefix: '' },
  { hreflang: 'en-US', prefix: '/en' },
]

/** One <url> per locale, each listing every locale as an alternate (Google's sitemap hreflang format). */
function localizedUrls(path: string, extra = ''): string[] {
  const hrefs = LOCALES.map(({ hreflang, prefix }) => ({ hreflang, loc: `${SITE_URL}${(prefix + path).replace(/\/$/, '') || '/'}` }))
  const alternates = hrefs.map(({ hreflang, loc }) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${loc}"/>`).join('\n')
  return hrefs.map(({ loc }) => `  <url>
    <loc>${loc}</loc>${extra}
${alternates}
  </url>`)
}

export default defineEventHandler(async (event) => {
  /**
   * Degrade to static-routes-only instead of a 504 if the blog API is cold
   * (see cacheGetPost.ts's timeout comment) - a sitemap missing post URLs
   * for one crawl is far better than the crawler getting no sitemap at all.
   */
  let posts: PaginatedPosts['data']
  try {
    posts = (await cacheGetPosts({ page: 1, perPage: 100 })).data
  } catch {
    posts = []
  }

  const staticUrls = STATIC_ROUTES.flatMap((path) => localizedUrls(path))

  const postUrls = posts.flatMap((post) => {
    const lastmod = new Date(post.updatedAt || post.createdAt).toISOString()
    return localizedUrls(`/blogs/${post._id}`, `\n    <lastmod>${lastmod}</lastmod>`)
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticUrls, ...postUrls].join('\n')}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=UTF-8')
  return xml
})
