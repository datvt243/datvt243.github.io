<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

/* import { convertNumberToDate } from '@/utils/index'; */
import type { Post } from '@/types/index'

const props = defineProps<{
	modelValue: Post
}>()

const formatDate = computed<string>(() => {
	const _date = new Date(props.modelValue.createdAt)
	let _d: string | number = _date.getDate(),
		_m: string | number = _date.getMonth() + 1
	_d = _d < 10 ? `0${_d}` : _d
	_m = _m < 10 ? `0${_m}` : _m
	return `${_d}/${_m}/${_date.getFullYear()}`
})
</script>

<template>
	<article class="flex flex-col space-y-2 xl:space-y-0">
		<dl class="flex items-center text-base font-medium text-gray-500 dark:text-gray-400 mb-2">
			<dt class="pr-1"></dt>
			<dd class="leading-6">
				<time :datetime="formatDate">
					{{ formatDate }}
				</time>
			</dd>
		</dl>
		<div class="space-y-3">
			<div class="clearfix">
				<p
					class="text-2xl mb-2 font-bold capitalize leading-8 tracking-tight hover:text-pink-500 transition-colors"
				>
					<NuxtLink :to="`blogs/${modelValue._id}`">
						{{ modelValue.title }}
					</NuxtLink>
				</p>
				<ul class="flex flex-wrap">
					<li v-for="(tag, i) in ['tag', 'tag', 'tag']" :key="`tag-${i}`">
						<NuxtLink
							:to="`blogs/${modelValue._id}`"
							class="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-blue-500 text-pink-500 transition"
						>
							{{ tag }}
						</NuxtLink>
					</li>
				</ul>
			</div>
			<div class="prose max-w-none text-gray-500 dark:text-gray-400">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, quia? Lorem ipsum dolor sit amet
				consectetur adipisicing elit. Iure, quia?
			</div>
		</div>
	</article>
</template>

<style scoped></style>
