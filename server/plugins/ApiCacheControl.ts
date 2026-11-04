/**
 * defineCachedEventHandler sends its server-side maxAge (12 days) to browsers
 * as `max-age`, so a client-side fetch (e.g. a language switch) can reuse a
 * copy older than the data. Browsers revalidate instead; the server cache and
 * its etag make that a cheap 304. Rewriting setHeader is the one place that
 * catches both paths: a routeRules header is overwritten by the handler, and
 * the 304 is ended inside the handler before `beforeResponse` runs.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    if (!event.path.startsWith('/api/')) return
    const res = event.node.res
    const setHeader = res.setHeader.bind(res)
    res.setHeader = (name, value) => setHeader(name, name.toLowerCase() === 'cache-control' ? 'no-cache' : value)
  })
})
