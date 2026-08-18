/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description: sitemap.xml covering the static routes plus one <url> per
 * blog post, sourced from the same cached post fetch as /api/blogs/posts.
 */

import type { Post } from '@/types'
import { cacheGetPosts } from '~/server/utils/cacheGetPost'

const SITE_URL = 'https://datvt243.github.io'

const STATIC_ROUTES = ['/', '/projects', '/github', '/blogs', '/contact']

export default defineEventHandler(async (event) => {
  // `cacheGetPosts` is typed as returning `Post[]` but the real blog API
  // actually wraps it as `{ data: Post[], total, page, perPage }` (same
  // mismatch `themes/portfolio-dev/pages/blogs/Index.vue` already works
  // around via `?.data?.data`) - unwrap defensively rather than trust the
  // declared return type.
  const rawPosts = await cacheGetPosts({ page: 1, perPage: 100 })
  const posts: Post[] = Array.isArray(rawPosts) ? rawPosts : (rawPosts as unknown as { data: Post[] })?.data || []

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
