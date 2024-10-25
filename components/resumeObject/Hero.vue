<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const store = useResumeStore()
const hero = computed(() => store.hero)
</script>

<template>
	<div class="my-10">
		<p class="text-3xl text-green-500 font-bold font-jetbrains tracking-wide">{{ hero.positionDesired }}</p>
		<ul class="flex items-center space-x-6 mt-4">
			<li v-for="src in ['vue-js', 'nuxt-js', 'react-js', 'js', 'typescript', 'git', 'node-js']" :key="src">
				<UTooltip :text="src" :popper="{ placement: 'top' }">
					<NuxtImg :src="`svg/${src}.svg`" width="30" :alt="src" :title="src" />
				</UTooltip>
			</li>
		</ul>
		<ul class="flex items-center space-x-6 mt-4">
			<li v-for="src in ['bootstrap', 'tailwindcss']" :key="src">
				<UTooltip :text="src" :popper="{ placement: 'top' }">
					<NuxtImg :src="`svg/${src}.svg`" width="30" :alt="src" :title="src" />
				</UTooltip>
			</li>
		</ul>
	</div>
</template>
