<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { GitRepos, GitUser } from '~/types/github'

const { data } = await useFetch<{ data: { user: GitUser; repos: GitRepos[] } }>('/api/github')

const user = computed(() => data.value?.data.user as GitUser)
const repos = computed(() => data.value?.data.repos as GitRepos[])

const languages = computed(() => {
  return [...new Set((repos.value || []).filter((r) => !!r.language).map((r) => r.language))].sort()
})

const selected = ref<string[]>([])

const filteredRepos = computed(() => {
  if (!selected.value.length) return repos.value || []
  return (repos.value || []).filter((r) => selected.value.includes(r.language))
})
</script>

<template>
  <UContainer class="py-6">
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
