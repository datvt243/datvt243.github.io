import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchResume } from '@/server/utils/fetchResume'

const fetchMock = vi.fn()

beforeEach(() => {
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { NODE_API: 'https://api.test', MY_EMAIL: 'me@test' } }))
  vi.stubGlobal('$fetch', fetchMock)
  vi.stubGlobal('createError', (input: { statusCode: number }) => Object.assign(new Error('createError'), input))
})
afterEach(() => {
  vi.unstubAllGlobals()
  fetchMock.mockReset()
})

describe('fetchResume', () => {
  it('returns only public fields, including inside generalInformation', async () => {
    fetchMock.mockResolvedValue({
      success: true,
      data: {
        firstName: 'Dat',
        email: 'me@test',
        salary: 1000,
        birthday: 1,
        gender: 'x',
        generalInformation: [{ positionDesired: 'Frontend', maritalStatus: 'single', expectedSalary: 9 }],
      },
    })
    const data = await fetchResume()
    expect(data).toEqual({ firstName: 'Dat', email: 'me@test', generalInformation: [{ positionDesired: 'Frontend' }] })
  })

  it('asks the upstream for the requested language, vi by default', async () => {
    fetchMock.mockResolvedValue({ success: true, data: {} })
    await fetchResume('en')
    await fetchResume()
    expect(fetchMock.mock.calls.map((call) => call[1].query)).toEqual([{ lang: 'en' }, { lang: 'vi' }])
  })

  it('never retries the rate-limited upstream and fails as a 502', async () => {
    fetchMock.mockRejectedValue(new Error('429'))
    await expect(fetchResume()).rejects.toMatchObject({ statusCode: 502 })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]![1]).toMatchObject({ retry: 0 })
  })
})
