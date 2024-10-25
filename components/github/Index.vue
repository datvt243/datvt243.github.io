<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { useGithub } from '@/stores/github'
const store = useGithub()
store.fetchDataUser()
store.fetchDataRepos()

const user = computed(() => store.getUser)
const repos = computed(() => store.getRepos)

//const data = await $fetch('/api/github')
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
