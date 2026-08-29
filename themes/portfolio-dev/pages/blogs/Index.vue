<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { APIFormatResponse, Post } from '@/types/index'

const { t } = useI18n()
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
const fetchKey = `blogs-posts:${category.value}:${page.value}:${perPage.value}`
const { data, status, refresh } = useFetch<APIFormatResponse<GetPosts>>(`/api/blogs/posts`, {
  key: fetchKey,
  query: {
    page: page,
    perPage: perPage,
    category: category,
  },
  // Show whatever we fetched last time for these params instantly (no
  // blank/loading flash), then silently refetch below and overwrite it -
  // Nuxt's own default getCachedData only reads from the SSR/static payload,
  // which isn't populated for plain client-side re-navigation.
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key],
})
// `status` is already 'success' here (reused from the cached fetch above)
// only when we're displaying stale data from a previous visit - kick off a
// background refresh so it gets replaced with fresh data once it arrives.
// Nuxt's page Suspense/transition setup can call onMounted twice for the
// same mount, so guard with a flag scoped to this component instance
// (not to the in-flight request, which may already have finished by the
// time the second onMounted call happens).
let hasRevalidated = false
onMounted(() => {
  if (status.value !== 'success' || hasRevalidated) return
  hasRevalidated = true
  refresh()
})
const blogs = computed(() => data.value?.data?.data || null)
const total = computed(() => data.value?.data?.total || 0)
// Keep showing the (possibly stale) list during the background refresh
// instead of flashing back to the ListRender loading state.
const listStatus = computed(() => (blogs.value ? 'success' : status.value))
</script>

<template>
  <div class="clearfix font-theme-mono">
    <div class="page-head mb-4">
      <ThemePageHeading :text="'_blog'" />
    </div>
    <div class="mb-4 flex justify-between items-center px-2 space-x-4 text-theme-muted">
      <div>
        <p>{{ t('blogs.intro') }}</p>
      </div>
      <div class="">
        <div class="flex items-center space-x-4 border border-theme-border-subtle rounded pl-3">
          <div class="leading-none text-sm">{{ t('blogs.show') }}</div>
          <USelect v-model="perPage" :options="[10, 20, 30, 40, 50]"  variant="none" />
        </div>
      </div>
    </div>
    <ListRender :status="listStatus" :data="blogs">
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
