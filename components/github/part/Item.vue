<script setup lang="ts">
import type { GitRepos } from '@/types/github'
const props = defineProps<{
	modelValue: GitRepos
}>()

const obj: { field: keyof GitRepos; icon: string; class: string }[] = [
	{ field: 'homepage', icon: 'fe:globe', class: 'text-violet-500' },
	{ field: 'html_url', icon: 'fe:github', class: 'text-pink-500' },
	/* { field: 'git_url', icon: 'eye', class: 'text-green-500' }, */
]

const itemFooter: { field: keyof GitRepos; class?: string; icon?: string; fc?: () => {} }[] = [
	{ field: 'language', class: 'ont-opensans text-orange-300' },
	{ field: 'subscribers_count', class: '', icon: 'fe:star' },
	{
		field: 'updated_at',
		class: 'text-gray-500',
		icon: '',
		fc: () => `Last update: ${new Date(props.modelValue.updated_at).toLocaleDateString()}`,
	},
]

const getFieldValue = (field: keyof GitRepos): string => {
	return props.modelValue[field]
}
</script>

<template>
	<div class="git-repos-item">
		<div class="flex justify-between">
			<p class="space-x-3">
				<a
					:href="modelValue.url"
					class="text-green-500 font-jetbrains font-bold text-lg hover:text-sky-500 transition-all"
					>{{ modelValue.name }}</a
				>
				<span class="text-sm opacity-50 text-gray-300 font-barlow">{{ modelValue.visibility }}</span>
			</p>
			<div>
				<ul class="flex gap-2">
					<template v-for="el in obj">
						<li v-if="getFieldValue(el.field)" :key="el.field">
							<a
								:href="getFieldValue(el?.field) || '#'"
								:class="[el.class, 'hover:opacity-50 transition-all']"
								target="_blank"
							>
								<UIcon :name="`${el.icon}`" class="w-5 h-5" />
							</a>
						</li>
					</template>
				</ul>
			</div>
		</div>

		<p class="space-x-2 my-2">
			<span
				v-for="t in modelValue.topics"
				:key="t"
				class="inline-block px-3 py-0.5 border border-gray-500 rounded-full text-gray-500 text-sm leading-none text-nowrap"
				>{{ t }}</span
			>
		</p>
		<div class="text-gray-300">{{ modelValue.description }}</div>
		<div class="inline-flex items-center space-x-4 mt-3 text-sm">
			<ul class="flex items-center space-x-4">
				<template v-for="el in itemFooter">
					<li v-if="modelValue[el.field]" :key="el.field">
						<UIcon v-if="el.icon" :name="el.icon" class="w-5 h-5" />
						<span :class="el.class">
							<template v-if="el?.fc">
								{{ el.fc() }}
							</template>
							<template v-else>
								{{ modelValue[el.field] }}
							</template>
						</span>
					</li>
				</template>
			</ul>
		</div>
		<!-- <div v-if="modelValue.languages_url">
			<GithubPartLanguage v-if="modelValue.languages_url" :url="modelValue.languages_url" />
		</div> -->
	</div>
</template>
