<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { APIFormatResponse, Post } from '@/types/index'

const query = inject<{ category: Ref<string>, page: Ref<number>, perPage: Ref<number> }>('query');
const category = toRef(query?.category || '')
const page = toRef(query?.page || 1)
const perPage = toRef(query?.perPage || 20)

interface GetPosts {
	data: Post[],
	total: number,
	page: number,
	perPage: number
}
const { data, status } = useFetch<APIFormatResponse<GetPosts>>(`/api/blogs/posts`, {
  query: {
    page: page,
    perPage: perPage,
    category: category,
  }
})
const blogs = computed(() => data.value?.data?.data || null)
const total = computed(() => data.value?.data?.total || 0)
</script>

<template>
  <div class="clearfix font-theme-mono">
    <div class="page-head mb-4">
      <ThemePageHeading :text="'_blog'" />
    </div>
    <div class="mb-4 flex justify-between items-center px-2 space-x-4 text-theme-muted">
      <div>
        <p>Articles, tutorials, snippets, rants, and everything else.</p>
      </div>
      <div class="">
        <div class="flex items-center space-x-4 border border-theme-border-subtle rounded pl-3">
          <div class="leading-none text-sm">Show:</div>
          <USelect v-model="perPage" :options="[10, 20, 30, 40, 50]"  variant="none" />
        </div>
      </div>
    </div>
    <ListRender :status="status" :data="blogs">
      <template #default>
        <li v-for="post in blogs" :key="post._id" class="p-4 border border-theme-border rounded-lg transition-colors hover:border-theme-accent/40">
          <ThemePostItem :model-value="post" />
        </li>
      </template>
      <template #loading>
        <ul class="list space-y-5">
          <li v-for="i in 3" :key="i" class="p-4 border border-theme-border rounded-lg">
            <ThemePostLoading />
          </li>
        </ul>
      </template>
    </ListRender>
    <div class="mt-4 flex justify-center">
      <UPagination v-model="page" :page-count="perPage" :total="total" :active-button="{ color: 'orange' }" />
    </div>

  </div>
</template>

<style scoped></style>
