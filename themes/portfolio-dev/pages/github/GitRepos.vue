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
  <div class="git-repos font-theme-mono">
    <div class="search mb-3">
      <UInput
        v-model="search"
        size="sm"
        icon="fe:search"
        color="gray"
        variant="outline"
        placeholder="Search repos name..."
        :ui="{
          base: 'font-theme-mono',
          color: {
            gray: {
              outline:
                'shadow-none bg-theme-panel/50 dark:bg-theme-panel/50 text-theme-text-strong dark:text-theme-text-strong ring-1 ring-inset ring-theme-border-subtle dark:ring-theme-border-subtle focus:ring-1 focus:ring-theme-accent dark:focus:ring-theme-accent',
            },
          },
        }"
      />
    </div>
    <div v-if="props.repos" class="clearfix overflow-hidden">
      <TransitionGroup name="transition-group" tag="ul" class="list">
        <li v-for="res in getRepos" :key="res.id" class="border-b border-theme-border py-4">
          <ThemeGithubPartItem :model-value="res" />
        </li>
      </TransitionGroup>
    </div>
  </div>
</template>
