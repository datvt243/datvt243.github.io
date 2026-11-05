<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import { skillIcon } from '@/utils/index'

const { resumeContentLang } = useAppConfig()
const { t } = useI18n()
const localePath = useLocalePath()
const store = useResumeStore()
const hero = computed(() => store.hero)
const { downloadResume, isLoading } = useDownloadResume()

/** Icons resolve from the API's free-text names; an unmatched name renders as text only. */
const techStack = computed(() => store.mainSkills.map((name) => ({ name, icon: skillIcon(name) })))
const familiarStack = computed(() => store.familiarSkills.map((name) => ({ name, icon: skillIcon(name) })))

/**
 * The API's introduction is HTML. Every tag but <strong>/<b> is dropped, then splitting on those leaves
 * [plain, bold, plain, ...], so it renders as text interpolation and never needs v-html.
 */
const introParts = computed(() =>
  hero.value.introduction.replace(/<(?!\/?(?:strong|b)\b)[^>]+>/gi, '').split(/<\/?(?:strong|b)>/gi),
)
</script>

<template>
  <div class="py-10 font-theme-mono">
    <div>
      <!-- Avatar sits beside the name, not in its own column, so the title and intro get the full width. -->
      <div class="flex items-center gap-6">
        <ThemeCornerFrame class="hidden sm:block shrink-0">
          <NuxtImg src="Avatar.png" width="128" height="128" class="rounded-lg" alt="" />
        </ThemeCornerFrame>
        <div>
          <p class="text-theme-accent-soft mb-4">{{ t('resume.greeting') }}<span class="text-theme-text">_</span></p>
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold uppercase text-theme-code-tag leading-none text-balance" :lang="resumeContentLang">
            {{ hero.fullName }}
          </h1>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2 mt-4">
        <span
          v-if="hero.openToWork"
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-theme-success/30 bg-theme-success/10 text-sm text-theme-success"
        >
          <span class="w-2 h-2 rounded-full bg-theme-success" />
          {{ t('resume.openToWork') }}
        </span>
        <NuxtLink
          :to="localePath('/contact')"
          data-shortcut="c"
          :data-shortcut-label="t('resume.contactMe')"
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-theme-border-subtle text-sm text-theme-muted hover:text-theme-accent hover:border-theme-accent/50 transition-colors"
        >
          <UIcon name="fe:mail" class="w-4 h-4" />
          {{ t('resume.contactMe') }}
          <ThemeKbd aria-hidden="true" class="px-1 text-[10px] leading-4">c</ThemeKbd>
        </NuxtLink>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-theme-accent/50 text-sm text-theme-accent hover:bg-theme-accent hover:text-theme-accent-contrast transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-theme-accent"
          :disabled="isLoading"
          data-shortcut="d"
          :data-shortcut-label="t('resume.downloadCv')"
          @click="downloadResume()"
        >
          <UIcon name="fe:download" class="w-4 h-4" />
          {{ isLoading ? t('resume.downloadingCv') : t('resume.downloadCv') }}
          <ThemeKbd aria-hidden="true" class="px-1 text-[10px] leading-4">d</ThemeKbd>
        </button>
      </div>
      <p class="text-2xl text-theme-code-keyword mt-6">
        <span class="text-theme-faint">&gt;</span> {{ hero?.positionDesired }}
      </p>
      <p v-if="hero.introduction" class="text-sm leading-relaxed text-theme-muted mt-2">
        <template v-for="(part, i) in introParts" :key="i">
          <strong v-if="i % 2" class="font-bold text-theme-text">{{ part }}</strong>
          <template v-else>{{ part }}</template>
        </template>
      </p>
      <ul v-if="techStack.length" class="flex flex-wrap gap-2 mt-6">
        <li
          v-for="tech in techStack"
          :key="tech.name"
          class="flex items-center gap-2 h-11 px-3 rounded-lg border border-theme-border-subtle bg-theme-panel text-sm text-theme-text-soft transition-colors hover:border-theme-accent/50"
        >
          <NuxtImg v-if="tech.icon" :src="`svg/${tech.icon}.svg`" width="24" height="24" class="w-6 h-6 object-contain" alt="" />
          {{ tech.name }}
        </li>
      </ul>
      <template v-if="familiarStack.length">
        <p class="text-xs text-theme-faint mt-4 mb-2">{{ t('resume.familiarWith') }}</p>
        <ul class="flex flex-wrap gap-2">
          <li
            v-for="tech in familiarStack"
            :key="tech.name"
            class="flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-theme-border-subtle bg-theme-panel/60 text-xs text-theme-muted transition-colors hover:border-theme-accent/50"
          >
            <NuxtImg v-if="tech.icon" :src="`svg/${tech.icon}.svg`" width="16" height="16" class="w-4 h-4 object-contain" alt="" />
            {{ tech.name }}
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>
