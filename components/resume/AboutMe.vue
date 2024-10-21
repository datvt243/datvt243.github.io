<script setup lang="ts">
const store = useResumeStore()
const hero = computed(() => store.hero)
const social = computed(() => store.social)
</script>

<template>
	<section class="section-about-me bg-opacity-5 bg-yellow-500">
		<UContainer>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="col-left">
					<BaseHeading text="Giới thiệu về tôi" size="text-8xl" />
					<div class="hidden md:block">
						<p class="mb-4">
							<UButton color="pink" variant="solid" label="Download my resume" disabled />
						</p>
						<ul v-if="social" class="flex gap-1 space-x-4">
							<li v-for="[name, link] in Object.entries(social)" :key="name">
								<a :href="link" target="_blank" class="text-pink">
									<UTooltip :text="link" :popper="{ placement: 'top' }">
										<UIcon
											:name="`grommet-icons:${
												name.toLocaleLowerCase() === 'website' ? 'globe' : name
											}`"
											class="w-6 h-6"
										/>
									</UTooltip>
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div class="col-right" v-html="hero.introduction"></div>
				<!-- {{ removeHtmlTags() }} -->
			</div>
		</UContainer>
	</section>
</template>

<style scoped>
:deep(strong) {
	color: var(--color-pink);
}
</style>
