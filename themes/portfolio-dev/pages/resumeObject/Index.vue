<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
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
</script>

<template>
  <div class="clearfix font-opensans">
    <ThemeResumeObjectHero />

    <div class="mt-4">
      <ThemePanel>
        <template #filetab>
          {{ activeLabel }}
          <UIcon name="fe:close" class="w-3.5 h-3.5 opacity-40" />
        </template>

        <template #sidebar>
          <ThemeFolder label="personal-info">
            <li v-for="s in sections" :key="s.key">
              <ThemeNavItem :active="active === s.key" @click="active = s.key">
                <span class="flex items-center gap-2">
                  <UIcon :name="s.icon" class="w-3.5 h-3.5 opacity-50 shrink-0" />
                  {{ s.label }}
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
