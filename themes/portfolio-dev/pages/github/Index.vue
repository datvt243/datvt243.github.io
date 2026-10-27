<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import type { GitRepos, GitUser } from '~/types/github'

const { data, error } = await useFetch<{ data: { user: GitUser; repos: GitRepos[] } }>('/api/github')
/**
 * Without data the page can't render. Always a 5xx (even for an upstream
 * 404), so ISR keeps serving the last good page instead of caching an error.
 */
if (error.value) {
  throw createError({ statusCode: 502, statusMessage: 'Unable to load GitHub data', fatal: true })
}

const user = computed(() => data.value?.data.user as GitUser)
const repos = computed(() => data.value?.data.repos as GitRepos[])

const languages = computed(() => {
  return [...new Set((repos.value || []).map((r) => r.language).filter((l): l is string => !!l))].sort()
})

const selected = ref<string[]>([])

const filteredRepos = computed(() => {
  if (!selected.value.length) return repos.value || []
  return (repos.value || []).filter((r) => !!r.language && selected.value.includes(r.language))
})
</script>

<template>
  <UContainer class="py-6">
    <h1 class="sr-only">{{ $t('github.seoTitle') }}</h1>
    <ThemePanel>
      <template #sidebar>
        <ThemeGithubGitUser :user="user" />

        <div class="mt-6 pt-4 border-t border-theme-border">
          <ThemeFilterFolder v-model="selected" label="languages" :items="languages" />
        </div>
      </template>
      <ThemeGithubGitRepos :repos="filteredRepos" />
    </ThemePanel>
  </UContainer>
</template>
