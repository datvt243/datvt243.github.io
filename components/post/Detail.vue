<script setup lang="ts">
import type { Post } from '@/types/index'

const props = defineProps<{
	modelValue: Post
}>()
</script>

<template>
	<article
		class="mx-auto format format-sm sm:format-base lg:format-lg format-blue dark:format-invert mb-8 pb-4 border-b"
	>
		<header class="pt-6 xl:pb-6">
			<div class="space-y-1 text-center">
				<dl class="space-y-10">
					<div>
						<dt class="sr-only">Published on</dt>
						<dd class="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
							<time datetime="2023-08-05T00:00:00.000Z">
								{{ new Date(modelValue.createdAt).toUTCString() }}
							</time>
						</dd>
					</div>
				</dl>
				<div>
					<h1
						class="text-pink-500 text-3xl font-extrabold leading-9 tracking-tight sm:text-4xl sm:leading-10 md:text-5xl md:leading-14"
					>
						{{ modelValue.title }}
					</h1>
				</div>
			</div>
		</header>
		<hr class="hidden md:my-4" />
		<div
			class="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0"
		>
			<div class="my-6 md:my-6 lg:my-4 xl:my-0 p-0">
				<PostAuthor />
			</div>

			<div class="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0 lg:pt-4">
				<div class="post-content" v-html="modelValue.content"></div>
			</div>
			<footer>
				<div
					class="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y"
				>
					<div class="py-4 xl:py-8">
						<h2 class="text-lg text-bold uppercase tracking-wide text-pink-500 pb-2 mb-2 border-b">Tags</h2>
						<div class="flex flex-wrap space-x-4">
							<NuxtLink to="'/blogs'" class="link text-sm font-medium lowercase hover:text-pink-500">
								#tag
							</NuxtLink>
						</div>
					</div>
				</div>
				<div class="pt-4 xl:pt-8">
					<NuxtLink
						to="/blogs"
						class="btn border-pink-500 border rounded-md p-4 text-pink hover:bg-pink hover:text-white transition-all"
						aria-label="Back to the blog"
					>
						<span class="flex items-center space-x-2">
							<!-- <UIcon name="fe:backward" class="w-5 h-5" /> -->
							<span class="uppercase">Back to the blog</span>
						</span>
					</NuxtLink>
				</div>
			</footer>
		</div>
	</article>
</template>
