<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { GitRepos, GitUser } from '~/types/github'

/* import { useGithub } from '@/stores/github'

const store = useGithub()
store.fetchDataUser()
store.fetchDataRepos()
const user = computed(() => store.getUser)
const repos = computed(() => store.getRepos) */

/* const { GITHUB_TOKEN, GITHUB_USER } = useRuntimeConfig().public */
const user: GitUser = await $fetch('https://api.github.com/users/datvt243', {
	/* headers: {
		Authorization: `token ${GITHUB_TOKEN}`,
	}, */
	retry: 3,
	retryDelay: 300,
})
const repos: GitRepos[] = await $fetch('https://api.github.com/users/datvt243/repos', {
	/* headers: {
		Authorization: `token ${GITHUB_TOKEN}`,
	}, */
	retry: 3,
	retryDelay: 300,
})
</script>

<template>
	<UContainer>
		<div class="block md:flex md:flex-row gap-8">
			<div class="hidden md:block md:basis-2/5 lg:basis-1/3">
				<GithubGitUser :user="user" />
			</div>
			<div class="md:basic-3/5 lg:basis-2/3">
				<GithubGitRepos :repos="repos" />
			</div>
		</div>
	</UContainer>
</template>
