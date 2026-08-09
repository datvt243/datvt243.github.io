<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */
import { fetchWithRetry } from '~/utils'

interface Category {
	_id: string
	name: string
	description: string
	slug: string
	[key: string]: string
}

const { data = [], status, error } = await useAsyncData<Category[]>(() => fetchWithRetry('/api/blogs/categories'))

const query = inject<{ category: Ref<string>; page: Ref<number>; perPage: Ref<number> }>('query')
const category = toRef(query?.category || '')
</script>

<template>
  <div class="font-jetbrains">
    <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
    <EditorFolder v-if="data?.length" label="categories">
      <li v-for="cate in data" :key="cate._id">
        <NuxtLink
          :to="`/blogs?category=${cate.slug}`"
          :aria-label="`View posts tagged ${cate.name}`"
          class="flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors"
          :class="category === cate.slug ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'"
        >
          <UIcon name="fe:hash" class="w-3.5 h-3.5 opacity-50 shrink-0" />
          {{ cate.name }}
        </NuxtLink>
      </li>
    </EditorFolder>
    <p v-else class="text-slate-500 text-sm">No categories</p>
  </div>
</template>
