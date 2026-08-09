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
const folderOpen = ref(true)
const searchOpen = ref(true)
</script>

<template>
  <div class="clearfix font-opensans">
    <ResumeObjectHero />

    <div class="mt-4">
      <EditorPanel>
        <template #filetab>
          {{ activeLabel }}
          <UIcon name="fe:close" class="w-3.5 h-3.5 opacity-40" />
        </template>

        <template #sidebar>
          <button
            type="button"
            class="flex items-center gap-1.5 text-xs uppercase tracking-widest text-slate-500 mb-3 font-jetbrains"
            @click="folderOpen = !folderOpen"
          >
            <UIcon name="fe:drop-down" class="w-3 h-3 transition-transform" :class="folderOpen ? '' : '-rotate-90'" />
            <UIcon :name="folderOpen ? 'fe:folder-open' : 'fe:folder'" class="w-3.5 h-3.5" />
            personal-info
          </button>
          <ul v-show="folderOpen" class="space-y-1">
            <li v-for="s in sections" :key="s.key">
              <EditorNavItem :active="active === s.key" @click="active = s.key">
                <span class="flex items-center gap-2">
                  <UIcon :name="s.icon" class="w-3.5 h-3.5 opacity-50 shrink-0" />
                  {{ s.label }}
                </span>
              </EditorNavItem>
            </li>
          </ul>

          <button
            type="button"
            class="flex items-center gap-1.5 text-xs uppercase tracking-widest text-slate-500 mt-4 mb-3 font-jetbrains"
            @click="searchOpen = !searchOpen"
          >
            <UIcon name="fe:drop-down" class="w-3 h-3 transition-transform" :class="searchOpen ? '' : '-rotate-90'" />
            <UIcon :name="searchOpen ? 'fe:folder-open' : 'fe:folder'" class="w-3.5 h-3.5" />
            search
          </button>
          <ul v-show="searchOpen" class="space-y-1">
            <li>
              <NuxtLink
                to="/contact"
                class="flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              >
                <UIcon name="heroicons:code-bracket-square" class="w-3.5 h-3.5 opacity-50 shrink-0" />
                _contact.ts
              </NuxtLink>
            </li>
          </ul>
        </template>

        <ResumeObjectAboutMe v-show="active === 'about-me'" />
        <ResumeObjectSkills v-show="active === 'skills'" />
        <ResumeObjectExperiences v-show="active === 'experience'" />
        <ResumeObjectEducations v-show="active === 'education'" />
        <ResumeObjectLanguages v-show="active === 'languages'" />
      </EditorPanel>
    </div>
  </div>
</template>
