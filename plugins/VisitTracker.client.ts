/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `01/09/2026`
 * Description: Records a resume visit (count/timestamp/geo/IP, per
 * candidate) via the backend's dedicated `POST /api/me/:email/visit`
 * endpoint (see resume-nodejs-api's `add-visit-tracking` node).
 *
 * Client-only (`.client.ts` suffix, never runs during SSR/ISR render):
 * the backend resolves the visitor's IP/location from the request that
 * reaches it, so this must fire from the real visitor's browser, not from
 * this app's own Nitro server (which would report the server's own IP,
 * and would only fire once per ISR cache window instead of once per real
 * visit). Fire-and-forget: a failed/unreachable call must never block
 * rendering or throw - only logged.
 */
export default defineNuxtPlugin(() => {
  const { public: { NODE_API, MY_EMAIL } } = useRuntimeConfig()
  if (!NODE_API || !MY_EMAIL) return

  $fetch(`${NODE_API}/api/me/${MY_EMAIL}/visit`, { method: 'POST' }).catch((error) => {
    console.error('VISIT:TRACK -----', error)
  })
})
