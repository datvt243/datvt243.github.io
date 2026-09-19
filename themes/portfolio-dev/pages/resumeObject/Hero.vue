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

const techStack = ['vue-js', 'nuxt-js', 'react-js', 'js', 'typescript', 'git', 'node-js', 'bootstrap', 'tailwindcss']
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
      <p class="text-2xl text-theme-code-keyword mt-6">
        <span class="text-theme-faint">&gt;</span> {{ hero?.positionDesired }}
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
