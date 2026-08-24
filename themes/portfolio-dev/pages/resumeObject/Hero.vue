<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const { t } = useI18n()
const store = useResumeStore()
const hero = computed(() => store.hero)

const techStack = ['vue-js', 'nuxt-js', 'react-js', 'js', 'typescript', 'git', 'node-js', 'bootstrap', 'tailwindcss']
</script>

<template>
  <div class="grid gap-10 lg:grid-cols-[1fr_auto] items-center py-10 font-theme-mono">
    <div>
      <p class="text-violet-400 mb-4">{{ t('resume.greeting') }} <span class="text-theme-text">_</span></p>
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold uppercase text-pink-500 leading-none">
        {{ hero.fullName }} <span class="text-theme-text">{</span>
      </h1>
      <p class="text-2xl text-blue-400 mt-6">
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
