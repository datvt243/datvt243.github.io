<script setup lang="ts">
import type { GitUser } from '@/types/github'

const { github } = useAppConfig()

const { data, status } = await useGithubAPI<GitUser>({
	user: github.user,
	token: github.personalAccessTokens,
	type: 'user',
})
</script>
<template>
	<div class="git-user min-w-60">
		<!-- {{ status }}
		{{ data }}
		{{}} -->

		<div v-if="status === 'success' && data">
			<NuxtImg :src="data.avatar_url" class="w-40 h-40 rounded-full mb-4" />
			<p class="space-x-1 flex items-center">
				<a :href="data.html_url" class="font-bold text-pink-500 text-lg hover:opacity-50 transition-all">{{
					data.name
				}}</a>
				<UIcon name="fe:link-external" class="w-5 h-5 opacity-35" />
			</p>
			<p class="font-italic text-violet-400">{{ data.login }}</p>
		</div>
		<ClientOnly>
			<p class="px-4 py-1 my-2 border-l-4 border-pink-500 italic" v-html="data.bio"></p>
		</ClientOnly>
		<div class="flex flex-wrap items-center space-x-2">
			<div class="opacity-50"><UIcon name="fe:users" class="w-5 h-5" /></div>
			<div class="followers">{{ data.followers }} <span class="opacity-50">followers</span></div>
			<div class="following">{{ data.following }} <span class="opacity-50">following</span></div>
		</div>
		<div class="contact text-sm mt-4">
			<p v-if="data.location" class="flex items-center space-x-2">
				<UIcon name="fe:location" />
				<span>{{ data.location }}</span>
			</p>
		</div>
		<!-- <pre>{{ data }}</pre> -->
		<UDivider />
	</div>
</template>
<style></style>
