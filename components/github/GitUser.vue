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
  <div class="git-user font-jetbrains">
    <div v-if="props.user || Object.keys(props.user).length">
      <template v-if="props.user.avatar_url">
        <NuxtImg :src="props.user.avatar_url" class="w-24 h-24 rounded-lg mb-4 border border-slate-700" />
      </template>
      <p class="space-x-1 flex items-center">
        <a
          :href="props.user.html_url"
          class="font-bold text-orange-400 hover:text-orange-300 transition-all"
        >{{ props.user.name }}</a
        >
        <UIcon name="fe:link-external" class="w-4 h-4 opacity-35" />
      </p>
      <p class="text-slate-500 text-sm">{{ props.user.login }}</p>

      <ClientOnly>
        <p class="px-3 py-1 my-3 border-l-2 border-blue-400 italic text-sm text-slate-300" v-html="props.user.bio"/>
      </ClientOnly>

      <p v-if="props.user.location" class="flex items-center gap-2 text-sm text-slate-300 mt-2">
        <UIcon name="fe:location" class="opacity-50" />
        <span>{{ props.user.location }}</span>
      </p>

      <div class="flex flex-wrap items-center gap-1 mt-2 text-xs text-slate-500">
        <UIcon name="fe:users" class="w-4 h-4 opacity-50" />
        <span>{{ props.user.followers }} followers</span>
        <span class="opacity-50">&middot;</span>
        <span>{{ props.user.following }} following</span>
      </div>
    </div>
    <p v-else class="text-slate-500">NO data</p>
  </div>
</template>
