<script setup lang="ts">
import type { APIFormatResponse, Post } from '@/types/index'

definePageMeta({
	layout: 'blog',
})
useSeoMeta({
	title: 'Blogs',
	ogTitle: 'Blogs',
	description: '',
	ogDescription: '',
})

const { data, status } = useFetch<APIFormatResponse<Post[]>>('/api/blogs/posts')

const blogs = computed(() => data.value?.data || null)
</script>

<template>
	<div class="clearfix">
		<div class="page-head mb-8">
			<BaseHeading :text="'_blog'" />
			<p>Articles, tutorials, snippets, rants, and everything else.</p>
		</div>
		<ListRender :status="status" :data="blogs">
			<template #default>
				<li v-for="post in blogs" :key="post._id" class="p-4 border border-slate-700 rounded-lg">
					<!-- {{ post.title }} -->
					<PostItem :model-value="post" />
				</li>
			</template>
			<template #loading>
				<ul class="list space-y-5">
					<li v-for="i in 3" :key="i" class="p-4 border border-slate-700 rounded-lg">
						<PostLoading />
					</li>
				</ul>
			</template>
		</ListRender>
	</div>
</template>

<style scoped></style>
