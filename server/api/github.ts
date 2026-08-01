/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { GitRepos, GitUser } from '@/types/github'

// GitHub returns 401/403 for an invalid or expired token; fall back to an
// unauthenticated request rather than failing the whole page in that case.
async function fetchGithub<T>(url: string, token?: string): Promise<T> {
  if (!token) return (await $fetch(url)) as T
  try {
    return (await $fetch(url, { headers: { Authorization: `token ${token}` } })) as T
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode
    if (statusCode === 401 || statusCode === 403) return (await $fetch(url)) as T
    throw error
  }
}

export default defineCachedEventHandler(
  async () => {
    const {
      GITHUB_TOKEN,
      public: { GITHUB_USER },
    } = useRuntimeConfig()

    const [user, repos] = await Promise.all([
      fetchGithub<GitUser>(`https://api.github.com/users/${GITHUB_USER}`, GITHUB_TOKEN),
      fetchGithub<GitRepos[]>(`https://api.github.com/users/${GITHUB_USER}/repos`, GITHUB_TOKEN),
    ])

    return {
      data: {
        user,
        repos,
      },
    }
  },
  {
    name: 'github-api',
    getKey() {
      const user = useRuntimeConfig().public.GITHUB_USER
      return `api-resume-${user}`
    },
    maxAge: 60 * 60 * 24 * 12,
  },
)
