<script lang="ts" setup>
//

const data = await $fetch<Record<string, any>>('https://api.github.com/users/datvt243')
</script>

<template>
	<UContainer>
		<div class="block md:flex md:flex-row gap-8">
			<div class="basis-1/3">
				<GithubGitUser />
			</div>
			<div class="basic-2/3">
				<GithubGitRepos />
			</div>
		</div>
	</UContainer>
</template>
