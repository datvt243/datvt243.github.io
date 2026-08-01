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
  <UContainer>
    <div class="block md:flex md:flex-row gap-8">
      <div class="hidden md:block md:basis-2/5 lg:basis-1/3">
        <GithubGitUser :user="user" />
      </div>
      <div class="md:basic-3/5 lg:basis-2/3">
        <GithubGitRepos :repos="repos" />
      </div>
    </div>
  </UContainer>
</template>
