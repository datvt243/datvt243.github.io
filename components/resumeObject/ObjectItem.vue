<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { convertNumberToDate } from '@/utils/index'

const props = defineProps<{
	title: string
	position: string
	prefixPosition?: string
	iconPosition?: string
	startDate: number
	endDate: number
	isCurrent: boolean
	description: string
}>()

const getDate = computed(() => {
	const _s = convertNumberToDate(props.startDate)
	const _e = convertNumberToDate(props.endDate)
	return `${_s} - ${_e}`
})
const getPosition = computed(() => {
	let _str = ''
	props.prefixPosition && (_str += `${props.prefixPosition}: `)
	return `<span class="text-sm">${_str}</span> <span class="font-bold tracking-widest">${props.position.toUpperCase()}</span>`
})
</script>

<template>
	<div class="block-item space-y-2 md:space-y-3">
		<ResumeObjectLayout :title="`${title}`" title-color="text-orange-500" size="lg">
			<template v-if="$slots.body">
				<slot name="body"></slot>
			</template>
			<div v-else class="block sm:flex items-center space-y-2 sm:space-x-4 mb-4">
				<p class="text-sm md:text-lg" :class="{ 'flex items-center space-x-2': !!iconPosition }">
					<UIcon v-if="iconPosition" :name="iconPosition" class="w-5 h-5" />
					<span v-if="prefixPosition">{{ `${prefixPosition}: ` }}</span>
					<span class="font-bold text-violet-400">{{ position }}</span>
				</p>
				<p class="text-sm font-italic tracking-widest !mt-0">
					<span class="flex items-center space-x-2 leading-normal">
						<UIcon name="fe:clock" class="w-5 h-5" />
						<span>{{ getDate }}</span>
					</span>
				</p>
			</div>
			<div class="description" v-html="description"></div>
		</ResumeObjectLayout>
	</div>
</template>

<style scoped lang="scss">
.description {
	position: relative;

	:deep(> *) {
		margin-bottom: 1rem;
	}

	:deep(> ul, > ol) {
		list-style-type: disc;
		padding-left: 1rem;
		line-height: 1.5em;

		> li {
			margin-bottom: 0.5rem;
		}

		ul,
		ol {
			list-style-type: disc;
			padding-left: 1rem;
			line-height: 1.5em;
		}
	}
}
</style>
