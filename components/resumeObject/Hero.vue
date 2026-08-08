<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const store = useResumeStore()
const hero = computed(() => store.hero)
</script>

<template>
  <div class="my-10">
    <p class="text-3xl text-green-500 font-bold font-jetbrains tracking-wide">{{ hero?.positionDesired }}</p>
    <ul class="flex flex-wrap items-center gap-2 mt-4">
      <li
        v-for="src in ['vue-js', 'nuxt-js', 'react-js', 'js', 'typescript', 'git', 'node-js', 'bootstrap', 'tailwindcss']"
        :key="src"
      >
        <UTooltip :text="src" :popper="{ placement: 'top' }">
          <div
            class="flex items-center justify-center w-11 h-11 rounded-lg border border-white/10 bg-white/5 p-2 transition-colors hover:border-pink-500/50 hover:bg-white/10"
          >
            <NuxtImg :src="`svg/${src}.svg`" class="max-w-full max-h-full" :alt="src" :title="src" />
          </div>
        </UTooltip>
      </li>
    </ul>
  </div>
</template>
