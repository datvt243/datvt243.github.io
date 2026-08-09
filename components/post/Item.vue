<script setup lang="ts">/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */
/* import { convertNumberToDate } from '@/utils/index'; */
import { formatDate } from '~/utils'
import type { Post } from '~/types'

const excerptLength = 50;

const props = defineProps<{
	modelValue: Post
}>()

const getExcerpt = computed(() => {
  const arr = (props.modelValue.excerpt || '').split(' ');
  if (arr.length < excerptLength) return arr.join(' ');
  arr.length = excerptLength;
  return   arr.join(' ') + '...';
})
const getURL = computed(() => {
  return `blogs/${props.modelValue._id}`
})
</script>

<template>
  <article class="flex flex-col space-y-2 xl:space-y-0 font-jetbrains">
    <dl class="flex items-center gap-1.5 text-base font-medium text-slate-500 mb-2">
      <dt class="flex items-center">
        <UIcon name="fe:calendar" class="w-3.5 h-3.5 opacity-60" />
      </dt>
      <dd class="leading-6">
        <time :datetime="formatDate(modelValue.createdAt)" class="text-sm">
          {{ formatDate(modelValue.createdAt) }}
        </time>
      </dd>
    </dl>
    <div class="space-y-3">
      <div class="clearfix">
        <p
          class="text-2xl mb-2 font-bold capitalize leading-8 tracking-tight"
        >
          <NuxtLink :to="getURL" class="text-white hover:text-orange-400 transition-all">
            {{ modelValue.title }}
          </NuxtLink>
        </p>
        <ul class="flex flex-wrap gap-2">
          <li v-for="(tag, i) in (modelValue.tags || [])" :key="`tag-${i}`">
            <NuxtLink :to="getURL">
              <UBadge :label="tag" variant="outline" />
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div class="prose max-w-none text-slate-400">
        {{ getExcerpt }}
      </div>
      <p>
        <NuxtLink :to="getURL" class="text-orange-400 hover:text-orange-300 text-sm">
          Read more ...
        </NuxtLink>
      </p>
    </div>
  </article>
</template>

<style scoped></style>
