<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const sections = [
  { key: 'about-me', label: 'about-me' },
  { key: 'skills', label: 'skills' },
  { key: 'experience', label: 'experience' },
  { key: 'education', label: 'education' },
  { key: 'languages', label: 'languages' },
]
const active = ref(sections[0].key)
</script>

<template>
  <div class="clearfix font-opensans">
    <ResumeObjectHero />

    <div class="mt-4">
      <EditorPanel>
        <template #sidebar>
          <p class="text-xs uppercase tracking-widest text-slate-500 mb-3 font-jetbrains">personal-info</p>
          <ul class="space-y-1">
            <li v-for="s in sections" :key="s.key">
              <EditorNavItem :active="active === s.key" @click="active = s.key">
                {{ s.label }}
              </EditorNavItem>
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
