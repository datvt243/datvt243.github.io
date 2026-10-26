/**
 * Date: `01/09/2026`
 * @file Records a resume visit (count/timestamp/geo/IP, per
 * candidate) via the backend's dedicated `POST /api/me/:email/visit`
 * endpoint (see resume-nodejs-api's `add-visit-tracking` node).
 *
 * Client-only (`.client.ts` suffix, never runs during SSR/ISR render):
 * an SSR call would fire once per ISR cache window instead of once per
 * real visit. Goes through this app's own `/api/visit` relay, which
 * forwards the visitor's IP - the backend has no CORS for a direct
 * browser call. Fire-and-forget: a failed call must never block rendering
 * or throw - only logged.
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */
export default defineNuxtPlugin(() => {
  $fetch('/api/visit', { method: 'POST', retry: 0 }).catch((error) => {
    console.error('VISIT:TRACK -----', error)
  })
})
