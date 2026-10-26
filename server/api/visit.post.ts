/**
 * Same-origin relay for `plugins/VisitTracker.client.ts`. The backend sends
 * no CORS headers, so a direct browser POST logged a console error on every
 * page; server-to-server has no CORS. The visitor's IP goes along as
 * `X-Forwarded-For`, since the backend would otherwise see this server's.
 * Always 204: tracking is best-effort and must never surface to the visitor.
 */
export default defineEventHandler(async (event) => {
  const { NODE_API, MY_EMAIL } = useRuntimeConfig().public
  const ip = getRequestIP(event, { xForwardedFor: true })

  // No retry: every call counts against the backend's shared rate limit.
  await $fetch(`${NODE_API}/api/me/${MY_EMAIL}/visit`, {
    method: 'POST',
    headers: ip ? { 'x-forwarded-for': ip } : {},
    timeout: 5000,
    retry: 0,
  }).catch((error) => console.error('VISIT:TRACK -----', error))

  setResponseStatus(event, 204)
  return null
})
