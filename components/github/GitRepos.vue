<script setup lang="ts">
import { debouncedRef } from '@/customs/refs/debounceRef'
import type { GitRepos } from '@/types/github'
const { github } = useAppConfig()

const { data, status } = await useGithubAPI<GitRepos[]>({
	user: github.user,
	token: github.personalAccessTokens,
	type: 'repos',
})

/* const data = await $fetch<GitRepos[]>(`https://api.github.com/users/${github.user}/repos`, {
	headers: {
		Authorization: github.personalAccessTokens,
	},
}) */

const search = debouncedRef<string>('', 500)
const language = debouncedRef<string>('', 500)

const getLanguages = computed(() => {
	return new Set(
		toValue(data)
			.filter((e: { language: string }) => !!e.language)
			.map((e: { language: string }) => e.language),
	)
})
const getRepos = computed(() => {
	let resule = toValue(data)

	if (search.value) {
		resule = resule.filter((e: GitRepos) => e?.name.includes(search.value))
	}
	if (language.value) {
		resule = resule.filter((e: GitRepos) => e.language === language.value)
	}

	return resule
})
</script>

<template>
	<div class="git-repos">
		<ul class="list inline-flex items-center space-x-3 mb-2">
			<li v-for="lang in getLanguages" :key="lang">
				<a
					@click="
						() => {
							language ? (language = '') : (language = lang)
						}
					"
					href="javascript:void(0)"
				>
					<UBadge :label="lang" :variant="language === lang ? 'solid' : 'outline'" />
				</a>
			</li>
		</ul>
		<div class="search">
			<UInput
				v-model="search"
				size="xl"
				icon="fe:search"
				color="primary"
				variant="outline"
				placeholder="Search..."
			/>
		</div>
		<UDivider class="border-violet-500" />
		<div v-if="data" class="clearfix overflow-hidden">
			<TransitionGroup name="transition-group" tag="ul" class="list">
				<li v-for="res in getRepos" :key="res.id" class="border-b border-violet-500 py-4">
					<GithubPartItem :model-value="res" />
				</li>
			</TransitionGroup>

			<!-- <div class="w-100 overflow-hidden">
				<pre>{{ data[1] }}</pre>
			</div> -->
		</div>
	</div>
</template>
