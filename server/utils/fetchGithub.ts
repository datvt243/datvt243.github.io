/**
 * An invalid or expired token (401, or a 403 that isn't a rate limit) falls
 * back to an unauthenticated request rather than failing the whole page.
 * A 403 with `x-ratelimit-remaining: 0` is the quota running out: the
 * unauthenticated quota is smaller, so falling back would only add a call.
 * No retries for the same reason - ofetch otherwise repeats a 429/5xx once.
 */
export async function fetchGithub<T>(url: string, token?: string): Promise<T> {
  if (!token) return (await $fetch(url, { retry: 0 })) as T
  try {
    return (await $fetch(url, { headers: { Authorization: `token ${token}` }, retry: 0 })) as T
  } catch (error: unknown) {
    const { statusCode, response } = error as { statusCode?: number; response?: Response }
    const rateLimited = response?.headers.get('x-ratelimit-remaining') === '0'
    if (statusCode === 401 || (statusCode === 403 && !rateLimited)) return (await $fetch(url, { retry: 0 })) as T
    throw error
  }
}
