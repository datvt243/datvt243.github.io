/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description: RSS 2.0 feed for /blogs, sourced from the same cached
 * post fetch as /api/blogs/posts.
 */

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
  const { data: posts } = await cacheGetPosts({ page: 1, perPage: 20 })

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
