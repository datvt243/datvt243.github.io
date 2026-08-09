<script setup lang="ts">
/**
 * Renders a list of HTML-string lines as a numbered code block
 * (line-number gutter + content), editor-theme style.
 */
defineProps<{
  lines: string[]
}>()
</script>

<template>
  <div class="font-jetbrains text-sm leading-relaxed">
    <div v-for="(line, i) in lines" :key="i" class="flex gap-4">
      <span class="text-slate-600 select-none w-6 text-right shrink-0">{{ i + 1 }}</span>
      <span class="text-slate-300 min-w-0" v-html="line" />
    </div>
  </div>
</template>
