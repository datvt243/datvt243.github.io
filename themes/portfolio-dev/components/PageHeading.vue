<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

withDefaults(
  defineProps<{
    text?: string
    size?: string
  }>(),
  {
    text: '',
    size: '',
  },
)
</script>

<template>
  <div class="space-y-2 pb-8 pt-6 md:space-y-5">
    <h1
      class="text-3xl leading-normal sm:text-4xl sm:leading-10 md:text-5xl md:leading-none text-theme-text uppercase tracking-wider font-extrabold"
      v-html="text"
    />
  </div>
</template>
