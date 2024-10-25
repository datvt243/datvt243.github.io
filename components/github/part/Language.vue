<script setup lang="ts">
const props = defineProps<{
	url: string
}>()

const { github } = useAppConfig()
const nuxtConfig = useRuntimeConfig()

async function getLanguage() {
	return await $fetch(props.url, {
		headers: { Authorization: `token ${nuxtConfig.gitToken}` },
	})
}

const data = ref()
const colors = { Vue: 'green', TypeScript: 'red', CSS: 'violet', default: 'gray' }

onMounted(async () => {
	if (props.url) {
		data.value = await getLanguage()
	}
})

const getMax = computed<number>((): number => {
	if (!data) return 0
	const _keys: string[] = Object.keys(toValue(data))

	const _result = _keys.reduce((s: number, k: string) => {
		return (s += toValue(data)[k])
	}, 0)

	return _result
})
</script>

<template>
	<div class="language" v-if="data">
		{{ getMax }}
		{{ data }}
		<UMeterGroup :min="0" :max="getMax">
			<UMeter
				v-for="lang in Object.keys(data)"
				:key="lang"
				:value="data[lang]"
				label="System"
				icon="i-heroicons-cog-6-tooth"
			/>
		</UMeterGroup>
		<!-- <pre>{{ data }}</pre> -->
	</div>
</template>
