<script setup lang="ts">
const props = defineProps<{
	title: string
	content: string
	type?: 'phone' | 'email' | ''
}>()
</script>

<template>
	<div class="flex items-start">
		<div class="shrink-0 relative">
			<div class="absolute inline-block rounded-md bg-sky-500 bg-opacity-20 p-4 w-10 h-10">
				<!-- <slot name="icon"></slot> -->
			</div>
		</div>
		<div class="grow z-10 ml-5 mt-2">
			<p class="text-xl font-bold tracking-wide">
				{{ title }}
			</p>
			<p class="">
				<template v-if="type === 'phone'">
					<a :href="`tel:${content}`">{{ content }}</a>
				</template>
				<template v-else-if="type === 'email'">
					<a :href="`mailto:${content}`">{{ content }}</a>
				</template>
				<template v-else>{{ content }}</template>
			</p>
		</div>
	</div>
</template>
