<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const store = useResumeStore()
const hero = computed(() => store.hero)

const getFullName = computed(() => `${hero.value.firstName} ${hero.value.lastName}`)
</script>

<template>
	<div class="clearfix font-opensans">
		<p class="text-violet-800 text-lg mb-6">Hi there! I am _</p>
		<ResumeObjectLayout
			:title="getFullName"
			title-size="text-5xl md:text-6xl lg:text-8xl"
			size="xxl"
			title-style="font-bold italic !text-pink-500 uppercase text-barlow !font-barlow"
		>
			<ResumeObjectHero />
			<ResumeObjectAboutMe />
			<ResumeObjectSkills />
			<ResumeObjectExperiences />
			<ResumeObjectProjects />
			<ResumeObjectEducations />
			<ResumeObjectLanguages />
		</ResumeObjectLayout>
	</div>
</template>
