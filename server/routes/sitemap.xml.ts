/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description: sitemap.xml covering the static routes plus one <url> per
 * blog post, sourced from the same cached post fetch as /api/blogs/posts.
 */

import type { PaginatedPosts } from '@/types'
import { cacheGetPosts } from '~/server/utils/cacheGetPost'
import { SITE_URL } from '~/server/utils/siteUrl'

const STATIC_ROUTES = ['/', '/projects', '/github', '/blogs', '/contact']

export default defineEventHandler(async (event) => {
  // Degrade to static-routes-only instead of a 504 if the blog API is cold
  // (see cacheGetPost.ts's timeout comment) - a sitemap missing post URLs
  // for one crawl is far better than the crawler getting no sitemap at all.
  let posts: PaginatedPosts['data']
  try {
    posts = (await cacheGetPosts({ page: 1, perPage: 100 })).data
  } catch {
    posts = []
  }

  const staticUrls = STATIC_ROUTES.map(
    (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
  </url>`,
  )

  const postUrls = posts.map((post) => {
    const lastmod = new Date(post.updatedAt || post.createdAt).toISOString()
    return `  <url>
    <loc>${SITE_URL}/blogs/${post._id}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...postUrls].join('\n')}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=UTF-8')
  return xml
})
