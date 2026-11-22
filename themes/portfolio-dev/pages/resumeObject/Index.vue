<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

// First = default tab: experience is what a recruiter looks for; the hero carries the about-me introduction.
const allSections = [
  { key: 'experience', label: 'experiences.pug', icon: 'heroicons:code-bracket' },
  { key: 'skills', label: 'skills.ts', icon: 'heroicons:code-bracket-square' },
  { key: 'education', label: 'educations.json', icon: 'heroicons:queue-list' },
  { key: 'languages', label: 'languages.json', icon: 'heroicons:queue-list' },
  { key: 'certificates', label: 'certificates.json', icon: 'heroicons:queue-list' },
  { key: 'awards', label: 'awards.json', icon: 'heroicons:queue-list' },
]
const store = useResumeStore()
// Tabs with no data are left out, so the number shortcuts stay consecutive and `?tab=` to one falls back to the default.
const sections = computed(() => allSections.filter((s) => (s.key === 'certificates' || s.key === 'awards' ? store[s.key].length > 0 : true)))
const resumeView = useResumeView()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const active = ref(allSections[0]!.key)
const activeLabel = computed(() => sections.value.find((s) => s.key === active.value)?.label ?? active.value)
// The skills section is split into two editor tabs; the group enum is secondary, so skills.ts opens first.
const skillFiles = ['skills.ts', 'skill-group.ts'] as const
const skillFile = ref<(typeof skillFiles)[number]>(skillFiles[0])

// Scroll to the content's tab row, not the panel: on mobile the sidebar stacks above the content.
const fileTab = ref<HTMLElement>()
const select = async (key: string) => {
  active.value = key
  // Tab lives in the URL (?tab=skills) so a section can be linked to; the default tab keeps the clean URL.
  await router.replace({ query: { ...route.query, tab: key === allSections[0]!.key ? undefined : key } })
  // Wait for the new tab to render, else the scroll is clamped to the old (shorter) page height.
  await nextTick()
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  fileTab.value?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
}

const tabFromUrl = () => sections.value.find((s) => s.key === route.query.tab)?.key
// No `?view` keeps the current view (an HR choice made elsewhere in this tab wins over a plain link to `/`); any other value than `hr` means Dev.
const applyViewQuery = async () => {
  const view = route.query.view
  if (view !== undefined) resumeView.value = view === 'hr' ? 'hr' : 'dev'
  else if (resumeView.value === 'hr') await router.replace({ query: { ...route.query, view: 'hr' } })
}
// Client-only, not in setup: `/` is ISR-cached, so the server HTML can't depend on the query.
onMounted(async () => {
  // Registered before the await: a watcher created after it isn't stopped on unmount.
  watch(() => route.query.view, applyViewQuery)
  // Keeps the tab in sync when the query changes without a remount (Back/Forward, `gr` clearing ?tab).
  watch(() => route.query.tab, () => (active.value = tabFromUrl() ?? allSections[0]!.key))
  // A refetch (e.g. locale switch) can drop the open tab; fall back instead of showing an empty panel.
  watch(sections, (list) => {
    if (!list.some((s) => s.key === active.value)) active.value = allSections[0]!.key
  })
  // Awaited so the tab deep link below reads the updated query.
  await applyViewQuery()
  const deepLinked = tabFromUrl()
  if (deepLinked) select(deepLinked)
})
</script>

<template>
  <div class="clearfix font-theme-mono">
    <ThemeResumeObjectHero />

    <ThemeResumeObjectHr v-if="resumeView === 'hr'" class="mt-4" />
    <div v-else class="mt-4">
      <ThemePanel>
        <template #filetab>
          <span ref="fileTab" class="flex items-center gap-2 scroll-mt-3" translate="no">
            <span v-if="active === 'skills'" role="tablist" class="flex items-center gap-4">
              <button
                v-for="f in skillFiles"
                :key="f"
                type="button"
                role="tab"
                :aria-selected="skillFile === f"
                :class="skillFile === f ? 'text-theme-text-strong' : 'hover:text-theme-text-strong'"
                class="flex items-center gap-2 transition-colors"
                @click="skillFile = f"
              >
                {{ f }}
                <UIcon v-if="skillFile === f" name="fe:close" class="w-3.5 h-3.5 opacity-40" />
              </button>
            </span>
            <template v-else>
              {{ activeLabel }}
              <UIcon name="fe:close" class="w-3.5 h-3.5 opacity-40" />
            </template>
          </span>
        </template>

        <template #sidebar>
          <ThemeFolder label="personal-info">
            <li v-for="(s, i) in sections" :key="s.key">
              <ThemeNavItem :active="active === s.key" :data-shortcut="String(i + 1)" :data-shortcut-label="s.label" @click="select(s.key)">
                <span class="flex items-center gap-2">
                  <UIcon :name="s.icon" class="w-3.5 h-3.5 opacity-50 shrink-0" />
                  <span translate="no">{{ s.label }}</span>
                  <ThemeKbd aria-hidden="true" class="ml-auto px-1 text-[10px] leading-4">{{ i + 1 }}</ThemeKbd>
                </span>
              </ThemeNavItem>
            </li>
          </ThemeFolder>

          <div class="mt-4">
            <ThemeFolder label="search">
              <li>
                <NuxtLink
                  :to="localePath('/contact')"
                  class="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-sm transition-colors text-theme-muted hover:text-theme-text-strong hover:bg-theme-panel-subtle/50"
                >
                  <UIcon name="heroicons:code-bracket-square" class="w-3.5 h-3.5 opacity-50 shrink-0" />
                  _contact.ts
                </NuxtLink>
              </li>
            </ThemeFolder>
          </div>
        </template>

        <ThemeResumeObjectSkills v-show="active === 'skills'" :file="skillFile" />
        <ThemeResumeObjectExperiences v-show="active === 'experience'" />
        <ThemeResumeObjectEducations v-show="active === 'education'" />
        <ThemeResumeObjectLanguages v-show="active === 'languages'" />
        <ThemeResumeObjectCertificates v-show="active === 'certificates'" />
        <ThemeResumeObjectAwards v-show="active === 'awards'" />
      </ThemePanel>
    </div>
  </div>
</template>
