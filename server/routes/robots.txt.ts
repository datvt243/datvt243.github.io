/**
 * @file robots.txt - previously an empty static file in public/;
 * moved to a server route so it can point crawlers at /sitemap.xml using
 * the same SITE_URL constant as sitemap.xml.ts/rss.xml.ts instead of a
 * 4th hardcoded copy of the production domain.
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import { SITE_URL } from '~/server/utils/siteUrl'

export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=UTF-8')
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
})
