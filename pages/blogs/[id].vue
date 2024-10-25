<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { APIFormatResponse, Post } from '@/types/index'

const route = useRoute()
const {
	params: { id = '' },
} = route

definePageMeta({
	validate: async (route) => {
		return !!route.params.id
	},
})

const { data } = await useFetch<APIFormatResponse<Post>>(`/api/blogs/detail/${id}`)

const postDetail = computed<Post>(() => {
	return data.value?.data as Post
})
</script>

<template>
	<div class="container-block !pt-0">
		<PostDetail :model-value="postDetail" />
		<PostCommentForm />
	</div>
</template>
