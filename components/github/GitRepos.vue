<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { debouncedRef } from '@/customs/refs/debounceRef'
import type { GitRepos } from '@/types/github'

const props = defineProps<{
	repos: GitRepos[]
}>()

// Filter
const search = debouncedRef<string>('', 500)
const language = debouncedRef<string>('', 500)

const getLanguages = computed(() => {
	return new Set(
		toValue(props.repos)
			.filter((e: { language: string }) => !!e.language)
			.map((e: { language: string }) => e.language),
	)
})
const getRepos = computed(() => {
	let resule = toValue(props.repos)

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
		<div class="flex items-center justify-between">
			<div>
				<ul class="list inline-flex items-center space-x-3 mb-2">
					<li v-for="lang in getLanguages" :key="lang">
						<a
							@click="
						() => {
							language === lang ? (language = '') : (language = lang)
						}
					"
							href="javascript:void(0)"
						>
							<UBadge :label="lang" :variant="language === lang ? 'solid' : 'outline'" />
						</a>
					</li>
				</ul>
			</div>
			<div>
				<span v-if="language" @click="() => language = ''">
					<UTooltip text="Clear filter">
						<UIcon name="fe:close" class="w-5 h-5 text-red-500" />
					</UTooltip>
				</span>
			</div>
		</div>
		<div class="search">
			<UInput
				v-model="search"
				size="xl"
				icon="fe:search"
				color="primary"
				variant="outline"
				placeholder="Search repos name..."
			/>
		</div>
		<UDivider class="border-violet-500" />
		<div v-if="props.repos" class="clearfix overflow-hidden">
			<TransitionGroup name="transition-group" tag="ul" class="list">
				<li v-for="res in getRepos" :key="res.id" class="border-b border-violet-500 py-4">
					<GithubPartItem :model-value="res" />
				</li>
			</TransitionGroup>
		</div>
	</div>
</template>
