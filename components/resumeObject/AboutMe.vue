<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const store = useResumeStore()
const hero = computed(() => store.hero)
const social = computed(() => store.social)

const isDisabled = ref(false)

async function downloadResume() {
	const response = await fetch('/api/generate-pdf')

	const { status } = response
	if (status !== 200) {
		isDisabled.value = true
		return
	}

	const blob = await response.blob()
	const link = document.createElement('a')

	link.href = URL.createObjectURL(blob)
	link.download = `${hero.value.email || 'download'}.pdf`
	link.click()
}
</script>

<template>
	<ResumeObjectLayout title="About me" size="xl">
		<ClientOnly>
			<!-- v-html chỉ chạy ở client, server ko render ra đc -> tạm thời xài clientOnly -->
			<p v-html="hero.introduction" class="mb-4"></p>
		</ClientOnly>

		<!-- <ResumeObjectLayout title="Contact"> -->
		<!-- 	<p v-for="[key, value] in Object.entries(social)" :key="key" class="text-sm"> -->
		<!-- 		<span>{{ key }}:</span> -->
		<!-- 		{{ value }} -->
		<!-- 	</p> -->
		<!-- </ResumeObjectLayout> -->

		<ul v-if="social" class="flex gap-1 space-x-4">
			<li v-for="[name, link] in Object.entries(social)" :key="name">
				<a :href="link" target="_blank" class="text-pink">
					<UTooltip :text="link" :popper="{ placement: 'top' }">
						<UIcon
							:name="`grommet-icons:${name.toLocaleLowerCase() === 'website' ? 'globe' : name}`"
							class="w-6 h-6"
						/>
					</UTooltip>
				</a>
			</li>
		</ul>

		<p class="mt-4">
			<UButton @click="downloadResume()" color="pink" variant="solid" size="lg" :disabled="isDisabled">
				Download CV
			</UButton>
		</p>
	</ResumeObjectLayout>
</template>
<style scoped>
:deep(strong) {
	color: var(--color-green);
}
</style>
