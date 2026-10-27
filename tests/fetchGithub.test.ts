import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchGithub } from '@/server/utils/fetchGithub'

const fetchMock = vi.fn()
const githubError = (statusCode: number, remaining?: string) =>
  Object.assign(new Error(String(statusCode)), { statusCode, response: new Response(null, { status: statusCode, headers: remaining ? { 'x-ratelimit-remaining': remaining } : {} }) })

beforeEach(() => vi.stubGlobal('$fetch', fetchMock))
afterEach(() => {
  vi.unstubAllGlobals()
  fetchMock.mockReset()
})

describe('fetchGithub', () => {
  it('falls back to an unauthenticated call for a bad token', async () => {
    fetchMock.mockRejectedValueOnce(githubError(401)).mockResolvedValueOnce({ ok: 1 })
    await expect(fetchGithub('https://api.github.com/x', 'tok')).resolves.toEqual({ ok: 1 })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[1]![1]).toEqual({ retry: 0 })
  })

  it('does not fall back or retry when the quota is exhausted', async () => {
    fetchMock.mockRejectedValue(githubError(403, '0'))
    await expect(fetchGithub('https://api.github.com/x', 'tok')).rejects.toMatchObject({ statusCode: 403 })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]![1]).toMatchObject({ retry: 0 })
  })

  it('does not fall back on a 429', async () => {
    fetchMock.mockRejectedValue(githubError(429))
    await expect(fetchGithub('https://api.github.com/x', 'tok')).rejects.toMatchObject({ statusCode: 429 })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
