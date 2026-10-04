<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
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

const { data, error } = await useFetch<APIFormatResponse<Post>>(`/api/blogs/detail/${id}`)

/**
 * Unknown ids (or slugs - links only ever use _id) leave data empty;
 * show the error page instead of crashing ThemePostDetail on undefined.
 * Only a real "not found" is a 404 - an upstream outage keeps its own
 * status so it isn't mistaken for a missing post.
 */
if (!data.value?.data) {
  const statusCode = error.value?.statusCode && error.value.statusCode !== 404 ? error.value.statusCode : 404
  throw createError({ statusCode, statusMessage: statusCode === 404 ? 'Post not found' : 'Unable to load post', fatal: true })
}

const postDetail = computed<Post>(() => {
  return data.value?.data as Post
})

useSeoMeta({
  title: () => postDetail.value?.title,
  ogTitle: () => postDetail.value?.title,
  description: () => postDetail.value?.excerpt,
  ogDescription: () => postDetail.value?.excerpt,
})
</script>

<template>
  <ThemePostDetail :model-value="postDetail" />
</template>
