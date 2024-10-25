/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { GitRepos, GitUser } from '@/types/github'

export const useGithub = defineStore('github', {
	state: () => ({
		user: {} as GitUser,
		repos: [] as GitRepos[],
		token: useRuntimeConfig().public.GITHUB_TOKEN,
		userName: useRuntimeConfig().public.GITHUB_USER,
	}),
	actions: {
		async fetchDataUser(): Promise<GitUser> {
			console.log({ token: this.token, u: this.userName })

			let data: GitUser = {} as GitUser
			if (!this.user || !Object.keys(this.user).length) {
				data = await $fetch<GitUser>(`https://api.github.com/users/${this.userName}`, {
					headers: {
						Authorization: `token ${this.token}`,
					},
				})
				this.user = data
			}
			return data
		},
		async fetchDataRepos(): Promise<GitRepos[]> {
			let data: GitRepos[] = []
			if (!this.repos.length) {
				data = await $fetch<GitRepos[]>(`https://api.github.com/users/${this.userName}/repos`, {
					headers: {
						Authorization: `token ${this.token}`,
					},
				})
				this.repos = data
			}
			return data
		},
	},
	getters: {
		getUser({ user }) {
			return user
		},
		getRepos({ repos }) {
			return repos
		},
	},
})
