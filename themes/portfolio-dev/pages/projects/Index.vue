<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const { t } = useI18n()
const store = useResumeStore()
await useAsyncData('api-resume', async () => await store.fetchData())
const projects = computed(() => store.projects || [])

const allTech = computed(() => {
  const set = new Set<string>()
  for (const p of projects.value) {
    for (const t of p.technology) set.add(t)
  }
  return [...set].sort()
})

const selected = ref<string[]>([])

const filtered = computed(() => {
  if (!selected.value.length) return projects.value
  return projects.value.filter((p) => p.technology.some((t) => selected.value.includes(t)))
})

// Overrides UBadge's default Nuxt UI `{color}` variant (which never picks
// up the --theme-* CSS custom properties) with the same --theme-accent
// token this component already uses for its other small accent text/icons
// (see the hash-icon badge below) - so the tag follows the Dracula
// editor-scope like everything else inside <ThemePanel>. Nuxt UI's `ui`
// prop merges via tailwind-merge per class-modifier group, so the default
// `dark:text-{color}-400`/`dark:ring-{color}-400` classes survive unless
// explicitly overridden too - can't rely on the base (non-dark) override
// alone to also win in dark mode.
const techBadgeUi = {
  variant: {
    outline: 'text-theme-accent dark:text-theme-accent ring-1 ring-inset ring-theme-accent/40 dark:ring-theme-accent/40',
  },
}
</script>

<template>
  <UContainer>
    <ThemePanel>
      <template #sidebar>
        <ThemeFilterFolder v-model="selected" label="projects" :items="allTech" />
      </template>

      <p v-if="!filtered.length" class="text-theme-faint font-theme-mono">{{ t('projects.noMatch') }}</p>
      <div v-else class="grid gap-6 grid-cols-1">
        <article
          v-for="(p, i) in filtered"
          :key="p.id || i"
          class="flex flex-col sm:flex-row rounded-lg border border-theme-border bg-theme-panel/50 overflow-hidden transition-colors hover:border-theme-accent/40"
        >
          <div class="relative aspect-video sm:aspect-square sm:w-48 shrink-0 bg-theme-panel-subtle/70">
            <NuxtImg v-if="p.images[0]" :src="p.images[0]" class="w-full h-full object-cover" :alt="p.name" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <UIcon name="fe:file" class="w-8 h-8 text-theme-faint" />
            </div>
            <span
              v-if="p.technology[0]"
              class="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-md border border-theme-border-subtle bg-theme-panel/90 text-theme-accent"
            >
              <UIcon name="fe:hash" class="w-3.5 h-3.5" />
            </span>
          </div>

          <div class="flex flex-col grow p-5 min-w-0">
            <p class="font-theme-mono text-sm text-theme-accent mb-2">
              {{ t('projects.projectLabel') }} {{ i + 1 }} <span class="text-theme-faint">//</span> _{{ p.slug }}
            </p>
            <h2 class="text-lg font-bold text-theme-text mb-1">{{ p.name }}</h2>
            <p v-if="p.position" class="text-sm text-theme-muted italic mb-2">{{ p.position }}</p>
            <p class="text-xs text-theme-faint font-theme-mono mb-3">{{ p.dateRangeLabel }}</p>
            <p class="text-sm text-theme-text-soft mb-4 line-clamp-3 max-w-2xl">{{ p.descriptionText }}</p>
            <ul v-if="p.technology.length" class="flex flex-wrap gap-2 mb-4">
              <li v-for="tech in p.technology" :key="tech">
                <UBadge :label="tech" variant="outline" :ui="techBadgeUi" />
              </li>
            </ul>
          </div>
        </article>
      </div>
    </ThemePanel>
  </UContainer>
</template>
