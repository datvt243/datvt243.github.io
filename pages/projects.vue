<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { convertNumberToDate } from '@/utils/index'

definePageMeta({
  layout: 'default',
})
useSeoMeta({
  title: 'Projects',
  ogTitle: 'Projects',
  description: 'Projects built by Võ Tấn Đạt.',
  ogDescription: 'Projects built by Võ Tấn Đạt.',
})

const store = useResumeStore()
await useAsyncData('api-resume', async () => await store.fetchData())
const projects = computed(() => store.projects || [])

const allTech = computed(() => {
  const set = new Set<string>()
  for (const p of projects.value) {
    for (const t of p.technology || []) set.add(t)
  }
  return [...set].sort()
})

const selected = ref<string[]>([])

const filtered = computed(() => {
  if (!selected.value.length) return projects.value
  return projects.value.filter((p) => (p.technology || []).some((t) => selected.value.includes(t)))
})

const getDate = (p: { startDate: number; endDate: number }) => `${convertNumberToDate(p.startDate)} - ${convertNumberToDate(p.endDate)}`

const stripHtml = (html?: string) => (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
</script>

<template>
  <UContainer>
    <EditorPanel>
      <template #sidebar>
        <EditorFilterFolder v-model="selected" label="projects" :items="allTech" />
      </template>

      <p v-if="!filtered.length" class="text-slate-500 font-jetbrains">No projects match the selected filters.</p>
      <div v-else class="grid gap-6 grid-cols-1">
        <article
          v-for="(p, i) in filtered"
          :key="p._id || i"
          class="flex flex-col sm:flex-row rounded-lg border border-slate-800 bg-slate-900/50 overflow-hidden transition-colors hover:border-orange-400/40"
        >
          <div class="relative aspect-video sm:aspect-square sm:w-48 shrink-0 bg-slate-800/70">
            <NuxtImg v-if="p.images?.[0]" :src="p.images[0]" class="w-full h-full object-cover" :alt="p.name" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <UIcon name="fe:file" class="w-8 h-8 text-slate-600" />
            </div>
            <span
              v-if="p.technology?.[0]"
              class="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-md border border-slate-700 bg-slate-900/90 text-orange-400"
            >
              <UIcon name="fe:hash" class="w-3.5 h-3.5" />
            </span>
          </div>

          <div class="flex flex-col grow p-5 min-w-0">
            <p class="font-jetbrains text-sm text-blue-400 mb-2">
              Project {{ i + 1 }} <span class="text-slate-600">//</span> _{{ p.name?.toLowerCase().replace(/\s+/g, '-') }}
            </p>
            <h2 class="text-lg font-bold text-white mb-1">{{ p.name }}</h2>
            <p v-if="p.position" class="text-sm text-slate-400 italic mb-2">{{ p.position }}</p>
            <p class="text-xs text-slate-500 font-jetbrains mb-3">{{ getDate(p) }}</p>
            <p class="text-sm text-slate-300 mb-4 line-clamp-3 max-w-2xl">{{ stripHtml(p.description) }}</p>
            <ul v-if="p.technology?.length" class="flex flex-wrap gap-2 mb-4">
              <li v-for="t in p.technology" :key="t">
                <UBadge :label="t" variant="outline" />
              </li>
            </ul>
          </div>
        </article>
      </div>
    </EditorPanel>
  </UContainer>
</template>
