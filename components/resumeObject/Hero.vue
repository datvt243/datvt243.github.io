<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const store = useResumeStore()
const hero = computed(() => store.hero)
const getFullName = computed(() => `${hero.value.firstName} ${hero.value.lastName}`)

const techStack = ['vue-js', 'nuxt-js', 'react-js', 'js', 'typescript', 'git', 'node-js', 'bootstrap', 'tailwindcss']
</script>

<template>
  <div class="grid gap-10 lg:grid-cols-[1fr_auto] items-center py-10 font-jetbrains">
    <div>
      <p class="text-violet-400 mb-4">Hi there! I am <span class="text-white">_</span></p>
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold uppercase text-pink-500 leading-none">
        {{ getFullName }} <span class="text-white">{</span>
      </h1>
      <p class="text-2xl text-blue-400 mt-6">
        <span class="text-slate-600">&gt;</span> {{ hero?.positionDesired }}
      </p>
      <ul class="flex flex-wrap gap-2 mt-6">
        <li v-for="src in techStack" :key="src">
          <UTooltip :text="src" :popper="{ placement: 'top' }">
            <div
              class="flex items-center justify-center w-11 h-11 rounded-lg border border-slate-700 bg-slate-900 p-2 transition-colors hover:border-orange-400/50"
            >
              <NuxtImg :src="`svg/${src}.svg`" class="max-w-full max-h-full" :alt="src" :title="src" />
            </div>
          </UTooltip>
        </li>
      </ul>
    </div>

    <div class="hidden lg:block">
      <div class="relative rounded-xl border border-slate-700 bg-slate-900 p-3">
        <span class="absolute -top-1 -left-1 w-2 h-2 rounded-full border border-slate-600 bg-slate-900" />
        <span class="absolute -top-1 -right-1 w-2 h-2 rounded-full border border-slate-600 bg-slate-900" />
        <span class="absolute -bottom-1 -left-1 w-2 h-2 rounded-full border border-slate-600 bg-slate-900" />
        <span class="absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-slate-600 bg-slate-900" />
        <NuxtImg src="Avatar.png" width="240" height="240" class="rounded-lg" alt="Avatar" />
      </div>
    </div>
  </div>
</template>
