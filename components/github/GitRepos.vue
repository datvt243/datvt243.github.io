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
        size="xl"
        icon="fe:search"
        color="primary"
        variant="outline"
        placeholder="Search repos name..."
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
