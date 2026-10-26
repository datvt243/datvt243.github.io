<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import type { APIFormatResponse, PaginatedPosts } from '@/types/index'

const { t } = useI18n()
const query = inject<{ category: Ref<string>, page: Ref<number>, perPage: Ref<number> }>('query');
const category = toRef(query?.category || '')
const page = toRef(query?.page || 1)
const perPage = toRef(query?.perPage || 20)

const fetchKey = `blogs-posts:${category.value}:${page.value}:${perPage.value}`
const postsFetch = useFetch<APIFormatResponse<PaginatedPosts>>(`/api/blogs/posts`, {
  key: fetchKey,
  query: {
    page: page,
    perPage: perPage,
    category: category,
  },
  /**
   * Show whatever we fetched last time for these params instantly (no
   * blank/loading flash), then silently refetch below and overwrite it -
   * Nuxt's own default getCachedData only reads from the SSR/static payload,
   * which isn't populated for plain client-side re-navigation.
   */
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key],
})
const { data, status, refresh } = postsFetch
/**
 * A failed server render must end as a 5xx so ISR keeps serving the last
 * good blog page; in the browser the list's own error state + retry is enough.
 */
if (import.meta.server) {
  await postsFetch
  if (postsFetch.error.value) {
    throw createError({ statusCode: postsFetch.error.value.statusCode || 503, statusMessage: 'Unable to load posts', fatal: true })
  }
}
/**
 * `status` is already 'success' here (reused from the cached fetch above)
 * only when we're displaying stale data from a previous visit - kick off a
 * background refresh so it gets replaced with fresh data once it arrives.
 * Nuxt's page Suspense/transition setup can call onMounted twice for the
 * same mount, so guard with a flag scoped to this component instance
 * (not to the in-flight request, which may already have finished by the
 * time the second onMounted call happens).
 */
let hasRevalidated = false
onMounted(() => {
  if (status.value !== 'success' || hasRevalidated) return
  hasRevalidated = true
  refresh()
})
const blogs = computed(() => data.value?.data?.data || null)
const total = computed(() => data.value?.data?.total || 0)
/**
 * Keep showing the (possibly stale) list during the background refresh
 * instead of flashing back to the ListRender loading state.
 */
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
        <div class="flex items-center space-x-4 border border-theme-border-subtle rounded-sm pl-3">
          <div id="blogs-per-page" class="leading-none text-sm">{{ t('blogs.show') }}</div>
          <USelect v-model="perPage" :items="[10, 20, 30, 40, 50]" variant="none" aria-labelledby="blogs-per-page" />
        </div>
      </div>
    </div>
    <ListRender :status="listStatus" :data="blogs" @retry="refresh()">
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
      <!-- v4's solid-button focus outline is 25% opacity; keep v3's solid one on the active page -->
      <UPagination
        v-model:page="page"
        :items-per-page="perPage"
        :total="total"
        active-color="secondary"
        :ui="{ item: 'aria-[current=page]:focus-visible:outline-2 aria-[current=page]:focus-visible:outline-offset-2 aria-[current=page]:focus-visible:outline-secondary' }"
      />
    </div>

  </div>
</template>

<style scoped></style>
