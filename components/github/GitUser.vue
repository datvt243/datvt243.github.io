<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { GitUser } from '@/types/github'

const props = defineProps<{
	user: GitUser
}>()
</script>
<template>
  <div class="git-user min-w-60">
    <div v-if="props.user || Object.keys(props.user).length">
      <div>
        <template v-if="props.user.avatar_url">
          <NuxtImg :src="props.user.avatar_url" class="w-40 h-40 rounded-full mb-4" />
        </template>
        <p class="space-x-1 flex items-center">
          <a
            :href="props.user.html_url"
            class="font-bold text-pink-500 text-lg hover:opacity-50 transition-all"
          >{{ props.user.name }}</a
          >
          <UIcon name="fe:link-external" class="w-5 h-5 opacity-35" />
        </p>
        <p class="font-italic text-violet-400">{{ props.user.login }}</p>
      </div>
      <ClientOnly>
        <p class="px-4 py-1 my-2 border-l-4 border-pink-500 italic" v-html="props.user.bio"/>
      </ClientOnly>
      <div class="contact text-sm mt-2">
        <p v-if="props.user.location" class="flex items-center space-x-2">
          <UIcon name="fe:location" class="opacity-50" />
          <span>{{ props.user.location }}</span>
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-1 mt-2 text-xs text-gray-400">
        <UIcon name="fe:users" class="w-4 h-4 opacity-50" />
        <span>{{ props.user.followers }} followers</span>
        <span class="opacity-50">·</span>
        <span>{{ props.user.following }} following</span>
      </div>
    </div>
    <p v-else>NO data</p>
  </div>
</template>
<style></style>
