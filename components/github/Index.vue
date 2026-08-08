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
</script>

<template>
  <UContainer class="py-6">
    <EditorPanel>
      <template #sidebar>
        <GithubGitUser :user="user" />
      </template>
      <GithubGitRepos :repos="repos" />
    </EditorPanel>
  </UContainer>
</template>
