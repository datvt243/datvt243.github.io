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

const { data } = await useFetch<APIFormatResponse<Post>>(`/api/blogs/detail/${id}`)

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
