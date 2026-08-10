<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
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
      class="text-3xl sm:text-4xl md:text-5xl text-theme-text uppercase tracking-wider font-extrabold leading-normal"
      v-html="text"
    />
  </div>
</template>
