<script setup lang="ts">
import type { GitRepos } from '@/types/github'
const URL = 'https://api.github.com/users/datvt243/repos'
const { data, status } = await useFetch<GitRepos[]>(URL)
</script>

<template>
	<div class="git-repos">
		<div class="search">
			<UInput color="primary" variant="outline" placeholder="Search..." />
		</div>
		<UDivider class="border-violet-500" />
		<div v-if="data" class="clearfix overflow-hidden">
			<ul class="list">
				<li v-for="res in data" :key="res.id" class="border-b border-violet-500 py-4">
					<div class="flex justify-between">
						<p class="space-x-3">
							<a
								:href="res.url"
								class="text-green-500 font-jetbrains font-bold text-lg hover:text-sky-500 transition-all"
								>{{ res.name }}</a
							>
							<span class="text-sm opacity-50 text-gray-300 font-barlow">{{ res.visibility }}</span>
						</p>
						<div>
							<div class="flex gap-2">
								<p>
									<a :href="res.git_url" class="text-pink-500 hover:opacity-50 transition-all">
										<UIcon name="fe:github" class="w-5 h-5" />
									</a>
								</p>
								<p>
									<a :href="res.git_url" class="text-violet-500 hover:opacity-50 transition-all">
										<UIcon name="fe:eye" class="w-5 h-5" />
									</a>
								</p>
							</div>
						</div>
					</div>
					<p>
						<span class="text-sm font-opensans text-orange-300">Language: {{ res.language }}</span>
					</p>
					<p class="space-x-2 my-2">
						<span
							v-for="t in res.topics"
							:key="t"
							class="inline-block px-3 py-0.5 border border-gray-500 rounded-full text-gray-500 text-sm leading-none text-nowrap"
							>{{ t }}</span
						>
						<!-- <UBadge v-for="t in res.topics" :key="t">{{ t }}</UBadge> -->
					</p>
					<p>{{ res.description }}</p>
					<p class="mt-3 text-sm text-gray-500">{{ res.created_at }}</p>
				</li>
			</ul>
			<!-- <div class="w-100 overflow-hidden">
				<pre>{{ data[1] }}</pre>
			</div> -->
		</div>
	</div>
</template>
