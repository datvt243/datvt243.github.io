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

const filtered = computed(() => {
  if (!selected.value.length) return projects.value
  return projects.value.filter((p) => (p.technology || []).some((t) => selected.value.includes(t)))
})

const getDate = (p: { startDate: number; endDate: number }) =>
  `${convertNumberToDate(p.startDate)} - ${convertNumberToDate(p.endDate)}`
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-3 py-6">
    <EditorPanel>
      <template #sidebar>
        <p class="text-xs uppercase tracking-widest text-slate-500 mb-3 font-jetbrains">projects</p>
        <ul class="space-y-1 font-jetbrains text-sm">
          <li v-for="tech in allTech" :key="tech">
            <label class="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors hover:bg-slate-800/50">
              <input
                type="checkbox"
                class="rounded border-slate-600 bg-slate-800 text-orange-400 focus:ring-orange-400/50"
                :checked="selected.includes(tech)"
                @change="toggle(tech)"
              />
              <span :class="selected.includes(tech) ? 'text-white' : 'text-slate-400'">{{ tech }}</span>
            </label>
          </li>
        </ul>
      </template>

      <p v-if="!filtered.length" class="text-slate-500 font-jetbrains">No projects match the selected filters.</p>
      <div v-else class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="(p, i) in filtered"
          :key="p._id || i"
          class="rounded-lg border border-slate-800 bg-slate-900/50 p-5 transition-colors hover:border-orange-400/40"
        >
          <p class="font-jetbrains text-sm text-blue-400 mb-2">
            Project {{ i + 1 }} <span class="text-slate-600">//</span> _{{ p.name?.toLowerCase().replace(/\s+/g, '-') }}
          </p>
          <h2 class="text-lg font-bold text-white mb-1">{{ p.name }}</h2>
          <p v-if="p.position" class="text-sm text-slate-400 italic mb-2">{{ p.position }}</p>
          <p class="text-xs text-slate-500 font-jetbrains mb-3">{{ getDate(p) }}</p>
          <div class="description text-sm text-slate-300 mb-4" v-html="p.description" />
          <ul v-if="p.technology?.length" class="flex flex-wrap gap-2 mb-4">
            <li v-for="t in p.technology" :key="t">
              <UBadge :label="t" variant="outline" />
            </li>
          </ul>
          <a
            v-if="p.link"
            :href="p.link"
            target="_blank"
            class="inline-flex items-center gap-1.5 text-sm font-jetbrains text-orange-400 hover:text-orange-300"
          >
            view-project <UIcon name="fe:link-external" class="w-3.5 h-3.5" />
          </a>
        </article>
      </div>
    </EditorPanel>
  </div>
</template>

<style scoped lang="scss">
.description {
	:deep(> *) {
		margin-bottom: 0.5rem;
	}
	:deep(ul, ol) {
		list-style-type: disc;
		padding-left: 1rem;
	}
}
</style>
