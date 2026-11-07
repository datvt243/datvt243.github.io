<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

interface Category {
	_id: string
	name: string
	description: string
	slug: string
	[key: string]: string
}

const { t } = useI18n()
const localePath = useLocalePath()
// No retry: each retry of a failed call is another call to the rate-limited upstream.
const { data, error } = await useAsyncData<Category[]>(async () => (await $fetch<Category[]>('/api/blogs/categories', { retry: 0 })) ?? [])

const query = inject<{ category: Ref<string>; page: Ref<number>; perPage: Ref<number> }>('query')
const category = toRef(query?.category || '')
</script>

<template>
  <div class="font-theme-mono">
    <p v-if="error" class="text-theme-muted text-sm">{{ t('blogs.categoriesLoadError') }}</p>
    <ThemeFolder v-if="data?.length" label="categories">
      <li v-for="cate in data" :key="cate._id">
        <NuxtLink
          :to="localePath(`/blogs?category=${cate.slug}`)"
          :aria-label="t('blogs.viewCategory', { name: cate.name })"
          class="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-sm transition-colors"
          :class="category === cate.slug ? 'bg-theme-panel-subtle text-theme-text' : 'text-theme-muted hover:text-theme-text-strong hover:bg-theme-panel-subtle/50'"
        >
          <UIcon name="fe:hash" class="w-3.5 h-3.5 opacity-50 shrink-0" />
          {{ cate.name }}
        </NuxtLink>
      </li>
    </ThemeFolder>
    <p v-else class="text-theme-faint text-sm">{{ t('blogs.noCategories') }}</p>
  </div>
</template>
