<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

const sections = [
  { key: 'about-me', label: 'about-me.md', icon: 'heroicons:document-text' },
  { key: 'skills', label: 'skills.ts', icon: 'heroicons:code-bracket-square' },
  { key: 'experience', label: 'experiences.pug', icon: 'heroicons:code-bracket' },
  { key: 'education', label: 'educations.json', icon: 'heroicons:queue-list' },
  { key: 'languages', label: 'languages.json', icon: 'heroicons:queue-list' },
]
const active = ref(sections[0].key)
const activeLabel = computed(() => sections.find((s) => s.key === active.value)?.label ?? active.value)

// Scroll to the content's tab row, not the panel: on mobile the sidebar stacks above the content.
const fileTab = ref<HTMLElement>()
const select = async (key: string) => {
  active.value = key
  // Wait for the new tab to render, else the scroll is clamped to the old (shorter) page height.
  await nextTick()
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  fileTab.value?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
}
</script>

<template>
  <div class="clearfix font-theme-mono">
    <ThemeResumeObjectHero />

    <div class="mt-4">
      <ThemePanel>
        <template #filetab>
          <span ref="fileTab" class="flex items-center gap-2 scroll-mt-3">
            {{ activeLabel }}
            <UIcon name="fe:close" class="w-3.5 h-3.5 opacity-40" />
          </span>
        </template>

        <template #sidebar>
          <ThemeFolder label="personal-info">
            <li v-for="(s, i) in sections" :key="s.key">
              <ThemeNavItem :active="active === s.key" :data-shortcut="String(i + 1)" :data-shortcut-label="s.label" @click="select(s.key)">
                <span class="flex items-center gap-2">
                  <UIcon :name="s.icon" class="w-3.5 h-3.5 opacity-50 shrink-0" />
                  {{ s.label }}
                  <ThemeKbd aria-hidden="true" class="ml-auto px-1 text-[10px] leading-4">{{ i + 1 }}</ThemeKbd>
                </span>
              </ThemeNavItem>
            </li>
          </ThemeFolder>

          <div class="mt-4">
            <ThemeFolder label="search">
              <li>
                <NuxtLink
                  to="/contact"
                  class="flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors text-theme-muted hover:text-theme-text-strong hover:bg-theme-panel-subtle/50"
                >
                  <UIcon name="heroicons:code-bracket-square" class="w-3.5 h-3.5 opacity-50 shrink-0" />
                  _contact.ts
                </NuxtLink>
              </li>
            </ThemeFolder>
          </div>
        </template>

        <ThemeResumeObjectAboutMe v-show="active === 'about-me'" />
        <ThemeResumeObjectSkills v-show="active === 'skills'" />
        <ThemeResumeObjectExperiences v-show="active === 'experience'" />
        <ThemeResumeObjectEducations v-show="active === 'education'" />
        <ThemeResumeObjectLanguages v-show="active === 'languages'" />
      </ThemePanel>
    </div>
  </div>
</template>
