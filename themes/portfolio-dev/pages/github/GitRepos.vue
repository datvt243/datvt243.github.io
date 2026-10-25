<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import type { GitRepos } from '@/types/github'

const { t } = useI18n()
const props = defineProps<{
	repos: GitRepos[]
}>()

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
        size="md"
        icon="fe:search"
        color="neutral"
        variant="outline"
        class="w-full"
        :placeholder="t('github.searchPlaceholder')"
        data-shortcut="/"
        :data-shortcut-label="t('github.searchPlaceholder')"
        :ui="{
          base: 'font-theme-mono shadow-none bg-theme-panel/50 text-theme-text-strong ring-1 ring-inset ring-theme-border-subtle focus-visible:ring-1 focus-visible:ring-theme-accent focus-visible:outline-none',
        }"
      >
        <template #trailing>
          <ThemeKbd aria-hidden="true" class="px-1 text-[10px] leading-4">/</ThemeKbd>
        </template>
      </UInput>
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
