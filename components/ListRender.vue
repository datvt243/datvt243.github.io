<script setup lang="ts">
const props = defineProps<{
	status: 'idle' | 'pending' | 'success' | 'error'
	data: Record<string, any>[] | null
	message?: string
}>()

const isLoading = ref(false)
const loadingAfterMillisecond = 500
watch(
	isLoading,
	() => {
		setTimeout(() => {
			isLoading.value = true
		}, loadingAfterMillisecond)
	},
	{
		immediate: true,
	},
)
</script>

<template>
	<div class="list-render">
		<template v-if="props.status !== 'success'">
			<template v-if="$slots.loading">
				<slot v-if="isLoading" name="loading"></slot>
			</template>
			<p v-else class="p-8">loading ...</p>
		</template>
		<template v-else>
			<ul v-if="props.data?.length" class="list space-y-5">
				<slot></slot>
			</ul>
			<div v-else class="no-data center p-8 bg-orange-800 bg-opacity-20 text-sky-500 rounded">
				<p class="text-xl uppercase text-center font-bold">No data</p>
			</div>
		</template>
	</div>
</template>
