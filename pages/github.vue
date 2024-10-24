<script lang="ts" setup>
//
definePageMeta({
	layout: 'default',
})
useSeoMeta({
	title: 'Github',
	ogTitle: 'Github',
	description: '',
	ogDescription: '',
})
</script>

<template>
	<UContainer>
		<div class="block md:flex md:flex-row gap-8">
			<div class="hidden md:block md:basis-2/5 lg:basis-1/3">
				<GithubGitUser />
			</div>
			<div class="md:basic-3/5 lg:basis-2/3">
				<GithubGitRepos />
			</div>
		</div>
	</UContainer>
</template>
