<script setup lang="ts">
const store = useResumeStore()
const hero = computed(() => store.hero)
const social = computed(() => store.social)
</script>

<template>
	<ResumeObjectLayout title="About me" size="xl">
		<p v-html="hero.introduction" class="mb-4"></p>

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
	</ResumeObjectLayout>
</template>
<style scoped>
:deep(strong) {
	color: var(--color-pink);
}
</style>
