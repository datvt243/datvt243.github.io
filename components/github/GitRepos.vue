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
const language = debouncedRef<string>('', 500)

const getLanguages = computed(() => {
  return new Set(
    toValue(props.repos)
      .filter((e: { language: string }) => !!e.language)
      .map((e: { language: string }) => e.language),
  )
})
const getRepos = computed(() => {
  let resule = toValue(props.repos)

  if (search.value) {
    resule = resule.filter((e: GitRepos) => e?.name.includes(search.value))
  }
  if (language.value) {
    resule = resule.filter((e: GitRepos) => e.language === language.value)
  }

  return resule
})
</script>

<template>
  <div class="git-repos font-jetbrains">
    <div class="flex items-center justify-between">
      <ul class="list inline-flex flex-wrap items-center gap-2 mb-3">
        <li v-for="lang in getLanguages" :key="lang">
          <a
            href="javascript:void(0)"
            @click="
              () => {
                language === lang ? (language = '') : (language = lang)
              }
            "
          >
            <UBadge :label="lang" :variant="language === lang ? 'solid' : 'outline'" />
          </a>
        </li>
      </ul>
      <div>
        <span v-if="language" @click="() => language = ''">
          <UTooltip text="Clear filter">
            <UIcon name="fe:close" class="w-5 h-5 text-red-400 cursor-pointer" />
          </UTooltip>
        </span>
      </div>
    </div>
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
