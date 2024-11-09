<script setup lang="ts">/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */
import { ar } from 'cronstrue/dist/i18n/locales/ar'

const excerptLength = 50;

/* import { convertNumberToDate } from '@/utils/index'; */
import { formatDate } from '~/utils'
import type { Post } from '~/types'

const props = defineProps<{
	modelValue: Post
}>()

const getExcerpt = computed(() => {
	const arr = (props.modelValue.excerpt || '').split(' ');
	if (arr.length < excerptLength) return arr.join(' ');
	arr.length = excerptLength;
	return   arr.join(' ') + '...';
})
const getURL = computed(() => {
	return `blogs/${props.modelValue._id}`
})
</script>

<template>
	<article class="flex flex-col space-y-2 xl:space-y-0">
		<dl class="flex items-center text-base font-medium text-gray-500 dark:text-gray-400 mb-2">
			<dt class="pr-1"></dt>
			<dd class="leading-6">
				<time :datetime="formatDate(modelValue.createdAt)" class="text-sm">
					{{ formatDate(modelValue.createdAt) }}
				</time>
			</dd>
		</dl>
		<div class="space-y-3">
			<div class="clearfix">
				<p
					class="text-2xl mb-2 font-bold capitalize leading-8 tracking-tight"
				>
					<NuxtLink :to="getURL" class="text-sky-500 hover:text-pink-500 transition-all">
						{{ modelValue.title }}
					</NuxtLink>
				</p>
				<ul class="flex flex-wrap">
					<li v-for="(tag, i) in (modelValue.tags || [])" :key="`tag-${i}`">
						<NuxtLink
							:to="getURL"
							class="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-blue-500 text-pink-500 transition"
						>
							{{ tag }}
						</NuxtLink>
					</li>
				</ul>
			</div>
			<div class="prose max-w-none text-gray-500 dark:text-gray-400">
				{{ getExcerpt }}
			</div>
			<p>
				<NuxtLink :to="getURL" class="text-pink-500 text-sm">
					Read more ...
				</NuxtLink>
			</p>
		</div>
	</article>
</template>

<style scoped></style>
