<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const props = defineProps<{
	title: string
	content: string
	type?: 'phone' | 'email' | ''
}>()
</script>

<template>
  <div class="flex items-start">
    <div class="shrink-0 relative">
      <div class="absolute inline-flex items-center justify-center rounded-md bg-sky-500 bg-opacity-20 p-2 w-10 h-10 text-sky-400">
        <slot name="icon" />
      </div>
    </div>
    <div class="grow z-10 ml-5 mt-2">
      <p class="text-xl font-bold tracking-wide">
        {{ title }}
      </p>
      <p class="">
        <template v-if="type === 'phone'">
          <a :href="`tel:${content}`">{{ content }}</a>
        </template>
        <template v-else-if="type === 'email'">
          <a :href="`mailto:${content}`">{{ content }}</a>
        </template>
        <template v-else>{{ content }}</template>
      </p>
    </div>
  </div>
</template>
