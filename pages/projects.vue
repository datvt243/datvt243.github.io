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
function toggle(tech: string) {
  const i = selected.value.indexOf(tech)
  if (i === -1) selected.value.push(tech)
  else selected.value.splice(i, 1)
}
function clearFilters() {
  selected.value = []
}

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
        <p class="text-xs uppercase tracking-widest text-slate-500 mb-3 font-jetbrains">projects</p>
        <ul class="space-y-1 font-jetbrains text-sm mb-4">
          <li v-for="tech in allTech" :key="tech">
            <label class="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors hover:bg-slate-800/50">
              <input
                type="checkbox"
                class="rounded border-slate-600 bg-slate-800 text-orange-400 focus:ring-orange-400/50"
                :checked="selected.includes(tech)"
                @change="toggle(tech)"
              />
              <UIcon name="fe:hash" class="w-3.5 h-3.5 opacity-40 shrink-0" />
              <span :class="selected.includes(tech) ? 'text-white' : 'text-slate-400'">{{ tech }}</span>
            </label>
          </li>
        </ul>

        <div class="flex items-center gap-2 text-xs font-jetbrains text-slate-500 border-t border-slate-800 pt-3">
          <span v-if="!selected.length">all;</span>
          <span v-else class="text-slate-300 truncate">{{ selected.join(', ') }};</span>
          <button
            v-if="selected.length"
            type="button"
            class="shrink-0 text-slate-500 hover:text-orange-400 transition-colors"
            aria-label="Clear filters"
            @click="clearFilters"
          >
            <UIcon name="fe:close" class="w-3.5 h-3.5" />
          </button>
        </div>
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
