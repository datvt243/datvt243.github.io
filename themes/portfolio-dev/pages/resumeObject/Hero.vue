<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const { t } = useI18n()
const { contact } = useAppConfig()
const store = useResumeStore()
const hero = computed(() => store.hero)
const { downloadResume, isDisabled } = useDownloadResume()

const techStack = ['vue-js', 'nuxt-js', 'react-js', 'js', 'typescript', 'git', 'node-js', 'bootstrap', 'tailwindcss']

// Real, computed-from-data summary (not a hardcoded number) so a recruiter
// can see experience length + current role without clicking into the
// Experience tab first (issue #179). `store.experiences` is already sorted
// most-recent-first, so [0] is the current/latest role and the last item
// holds the earliest startDate.
const currentExperience = computed(() => store.experiences[0] || null)
const yearsOfExperience = computed(() => {
  const list = store.experiences
  const earliest = list[list.length - 1]?.startDate
  if (!earliest) return 0
  const years = (Date.now() - earliest.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  return Math.max(1, Math.floor(years))
})
</script>

<template>
  <div class="grid gap-10 lg:grid-cols-[1fr_auto] items-center py-10 font-theme-mono">
    <div>
      <p class="text-theme-accent-soft mb-4">{{ t('resume.greeting') }} <span class="text-theme-text">_</span></p>
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold uppercase text-theme-code-tag leading-none">
        {{ hero.fullName }} <span class="text-theme-text">{</span>
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
        :disabled="isDisabled"
        @click="downloadResume()"
      >
        <UIcon name="fe:download" class="w-4 h-4" />
        {{ t('resume.downloadCv') }}
      </button>
      <p class="text-2xl text-theme-code-keyword mt-6">
        <span class="text-theme-faint">&gt;</span> {{ hero?.positionDesired }}
      </p>
      <p v-if="currentExperience" class="text-sm text-theme-muted mt-1">
        {{ t('resume.experienceSummary', { years: yearsOfExperience, company: currentExperience.company }) }}
      </p>
      <ul class="flex flex-wrap gap-2 mt-6">
        <li v-for="src in techStack" :key="src">
          <UTooltip :text="src" :popper="{ placement: 'top' }">
            <div
              class="flex items-center justify-center w-11 h-11 rounded-lg border border-theme-border-subtle bg-theme-panel p-2 transition-colors hover:border-theme-accent/50"
            >
              <NuxtImg :src="`svg/${src}.svg`" class="max-w-full max-h-full" :alt="src" :title="src" />
            </div>
          </UTooltip>
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
