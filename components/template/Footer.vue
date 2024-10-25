<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const currentYear = new Date().getFullYear()
const socialMedia = [
	{
		name: 'github',
		icon: 'grommet-icons:github',
		link: 'https://github.com/datvt243',
	},
	{
		name: 'linkedin',
		icon: 'grommet-icons:linkedin',
		link: 'https://www.linkedin.com/in/datvt243/',
	},
]
</script>

<template>
	<footer class="border-orange-500 border-t-2">
		<UContainer :ui="{ constrained: 'py-2 md:py-4 lg:py-6' }">
			<div class="md:flex md:items-center md:justify-between">
				<p class="">
					&copy; {{ currentYear }}
					<a href="https://github.com/datvt243" class="hover:underline text-pink-500" target="_blank">
						datvt243
					</a>
					. All Rights Reserved.
				</p>
				<ul class="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
					<li v-for="social in socialMedia" :key="social.name">
						<a
							:href="social.link"
							target="_blank"
							class="hover:underline me-4 md:me-6 text-orange-500 capitalize flex items-center space-x-1"
						>
							<UIcon v-if="social.icon" :name="social.icon" class="w-5 h-5" />
							<span class="capitalize">{{ social.name }}</span>
						</a>
					</li>
				</ul>
			</div>
		</UContainer>
	</footer>
</template>
