/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import type { GitRepos, GitUser } from '@/types/github'

export default defineCachedEventHandler(
  async () => {
    const {
      GITHUB_TOKEN,
      public: { GITHUB_USER },
    } = useRuntimeConfig()

    const [user, repos] = await Promise.all([
      fetchGithub<GitUser>(`https://api.github.com/users/${GITHUB_USER}`, GITHUB_TOKEN),
      fetchGithub<GitRepos[]>(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=100`, GITHUB_TOKEN),
    ])

    return {
      data: {
        user,
        // Recent own work first; forks are someone else's code and only crowd it out.
        repos: repos.filter((repo) => !repo.fork),
      },
    }
  },
  {
    name: 'github-api',
    getKey() {
      const user = useRuntimeConfig().public.GITHUB_USER
      return `api-github-${user}`
    },
    maxAge: 60 * 60 * 24 * 12,
  },
)
