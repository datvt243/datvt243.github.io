<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

const { t } = useI18n()
const { contact } = useAppConfig()
const store = useResumeStore()
const hero = computed(() => store.hero)
const { downloadResume, isDisabled, isLoading } = useDownloadResume()

/** Main stack, ordered languages → frameworks → tooling; `icon` is a file under public/svg/. */
const techStack = [
  { icon: 'js', name: 'JavaScript' },
  { icon: 'typescript', name: 'TypeScript' },
  { icon: 'vue-js', name: 'Vue.js' },
  { icon: 'sapui5', name: 'SAPUI5' },
  { icon: 'git', name: 'Git' },
]

/** Secondary "familiar with" tech, rendered smaller under the main stack. */
const familiarStack = [
  { icon: 'nuxt-js', name: 'Nuxt' },
  { icon: 'react-js', name: 'React' },
  { icon: 'node-js', name: 'Node.js' },
  { icon: 'tailwindcss', name: 'Tailwind CSS' },
]

/**
 * Summary so a recruiter can see experience length + current role without
 * clicking into the Experience tab first (issue #179). Years come from the
 * owner-entered `generalInformation.yearsOfExperience` rather than being
 * derived from the earliest experience startDate. `store.experiences` is
 * sorted most-recent-first, so [0] is the current/latest role.
 */
const currentExperience = computed(() => store.experiences[0] || null)
const yearsOfExperience = computed(() => store.generalInformation.yearsOfExperience || 0)
</script>

<template>
  <div class="grid gap-10 lg:grid-cols-[1fr_auto] items-center py-10 font-theme-mono">
    <div>
      <p class="text-theme-accent-soft mb-4">{{ t('resume.greeting') }} <span class="text-theme-text">_</span></p>
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold uppercase text-theme-code-tag leading-none">
        {{ hero.fullName }}
      </h1>
      <span
        v-if="hero.openToWork"
        class="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full border border-theme-accent/30 bg-theme-accent/10 text-sm text-theme-accent"
      >
        <span class="w-2 h-2 rounded-full bg-theme-accent" />
        {{ t('resume.openToWork') }}
      </span>
      <a
        :href="`mailto:${contact.email}`"
        class="inline-flex items-center gap-2 mt-4 ml-2 px-3 py-1 rounded-full border border-theme-border-subtle text-sm text-theme-muted hover:text-theme-accent hover:border-theme-accent/50 transition-colors"
      >
        <UIcon name="fe:mail" class="w-4 h-4" />
        {{ t('resume.contactMe') }}
      </a>
      <button
        type="button"
        class="inline-flex items-center gap-2 mt-4 ml-2 px-3 py-1 rounded-full border border-theme-accent/50 text-sm text-theme-accent hover:bg-theme-accent hover:text-theme-accent-contrast transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-theme-accent"
        :disabled="isDisabled || isLoading"
        @click="downloadResume()"
      >
        <UIcon name="fe:download" class="w-4 h-4" />
        {{ isLoading ? t('resume.downloadingCv') : t('resume.downloadCv') }}
      </button>
      <p class="text-2xl text-theme-code-keyword mt-6">
        <span class="text-theme-faint">&gt;</span> {{ hero?.positionDesired }}
      </p>
      <p v-if="currentExperience && yearsOfExperience" class="text-sm text-theme-muted mt-1">
        {{ t('resume.experienceSummary', { years: yearsOfExperience, company: currentExperience.company }) }}
      </p>
      <ul class="flex flex-wrap gap-2 mt-6">
        <li
          v-for="tech in techStack"
          :key="tech.icon"
          class="flex items-center gap-2 h-11 px-3 rounded-lg border border-theme-border-subtle bg-theme-panel text-sm text-theme-text-soft transition-colors hover:border-theme-accent/50"
        >
          <NuxtImg :src="`svg/${tech.icon}.svg`" class="w-6 h-6 object-contain" alt="" />
          {{ tech.name }}
        </li>
      </ul>
      <p class="text-xs text-theme-faint mt-4 mb-2">{{ t('resume.familiarWith') }}</p>
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="tech in familiarStack"
          :key="tech.icon"
          class="flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-theme-border-subtle bg-theme-panel/60 text-xs text-theme-muted transition-colors hover:border-theme-accent/50"
        >
          <NuxtImg :src="`svg/${tech.icon}.svg`" class="w-4 h-4 object-contain" alt="" />
          {{ tech.name }}
        </li>
      </ul>
    </div>

    <div class="hidden lg:block">
      <ThemeCornerFrame>
        <NuxtImg src="Avatar.png" width="240" height="240" class="rounded-lg" alt="Avatar" />
      </ThemeCornerFrame>
    </div>
  </div>
</template>
