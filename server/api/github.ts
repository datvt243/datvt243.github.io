/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { GitRepos, GitUser } from '@/types/github'
export default defineCachedEventHandler(
	async () => {
		/* const user: GitUser | null = null
		const repos: GitRepos[] = [] */

		/* const { GITHUB_TOKEN, GITHUB_USER } = useRuntimeConfig().public */

		/* console.log({
			GITHUB_TOKEN,
			GITHUB_USER,
		}) */

		const GITHUB_USER = 'datvt243'

		const [user, repos]: [user: GitUser | unknown, repos: GitRepos[] | unknown] = await Promise.all([
			fetch(`https://api.github.com/users/datvt243`, {
				/* headers: {
					Authorization: `token ${GITHUB_TOKEN}`,
				}, */
			}),
			fetch(`https://api.github.com/users/datvt243/repos`, {
				/* headers: {
					Authorization: `token ${GITHUB_TOKEN}`,
				}, */
			}),
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
