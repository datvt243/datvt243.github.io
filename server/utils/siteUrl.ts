/**
 * Single source of truth for the site's canonical production origin — used
 * by sitemap.xml, rss.xml, and (via nuxt.config.ts's i18n.baseUrl) hreflang/
 * canonical tags, so all three can't drift out of sync with each other.
 * Override with the SITE_URL env var if the production domain changes.
 */
export const SITE_URL = process.env.SITE_URL || 'https://resume-nuxt-vert.vercel.app'
