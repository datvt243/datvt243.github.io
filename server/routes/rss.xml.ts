/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description: RSS 2.0 feed for /blogs, sourced from the same cached
 * post fetch as /api/blogs/posts.
 */

import type { Post } from '@/types'
import { cacheGetPosts } from '~/server/utils/cacheGetPost'

const SITE_URL = 'https://datvt243.github.io'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  // `cacheGetPosts` is typed as returning `Post[]` but the real blog API
  // actually wraps it as `{ data: Post[], total, page, perPage }` (same
  // mismatch `themes/portfolio-dev/pages/blogs/Index.vue` already works
  // around via `?.data?.data`) - unwrap defensively rather than trust the
  // declared return type.
  const rawPosts = await cacheGetPosts({ page: 1, perPage: 20 })
  const posts: Post[] = Array.isArray(rawPosts) ? rawPosts : (rawPosts as unknown as { data: Post[] })?.data || []

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/blogs/${post._id}`
      const pubDate = new Date(post.updatedAt || post.createdAt).toUTCString()
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt || '')}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Đạt Võ - Blog</title>
    <link>${SITE_URL}/blogs</link>
    <description>Articles, tutorials, snippets, rants, and everything else.</description>
    <language>vi</language>
${items}
  </channel>
</rss>`

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=UTF-8')
  return xml
})
