<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { GitRepos } from '@/types/github'

const props = defineProps<{
	repos: GitRepos[]
}>()

// Filter
const search = debouncedRef<string>('', 500)

const getRepos = computed(() => {
  let resule = toValue(props.repos)

  if (search.value) {
    resule = resule.filter((e: GitRepos) => e?.name.includes(search.value))
  }

  return resule
})
</script>

<template>
  <div class="git-repos font-jetbrains">
    <div class="search mb-3">
      <UInput
        v-model="search"
        size="sm"
        icon="fe:search"
        color="gray"
        variant="outline"
        placeholder="Search repos name..."
        :ui="{
          base: 'font-jetbrains',
          color: {
            gray: {
              outline:
                'shadow-none bg-slate-900/50 dark:bg-slate-900/50 text-slate-200 dark:text-slate-200 ring-1 ring-inset ring-slate-700 dark:ring-slate-700 focus:ring-1 focus:ring-orange-400 dark:focus:ring-orange-400',
            },
          },
        }"
      />
    </div>
    <div v-if="props.repos" class="clearfix overflow-hidden">
      <TransitionGroup name="transition-group" tag="ul" class="list">
        <li v-for="res in getRepos" :key="res.id" class="border-b border-slate-800 py-4">
          <GithubPartItem :model-value="res" />
        </li>
      </TransitionGroup>
    </div>
  </div>
</template>
