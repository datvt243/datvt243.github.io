<script setup lang="ts">
/**
 * Renders a list of HTML-string lines as a numbered code block
 * (line-number gutter + content), editor-theme style.
 *
 * A line can be a plain HTML string (no indent) or a { html, indent }
 * object — indent is applied as CSS padding (not leading spaces) so
 * wrapped text stays aligned under the line's own start column instead
 * of falling back to the left edge.
 */
import type { CodeLine } from '@/types/codeLine'

defineProps<{
  lines: (string | CodeLine)[]
}>()

function toLine(line: string | CodeLine): CodeLine {
  return typeof line === 'string' ? { html: line } : line
}
</script>

<template>
  <div class="font-jetbrains text-sm leading-relaxed">
    <div v-for="(line, i) in lines" :key="i" class="flex gap-4">
      <span class="text-slate-600 select-none w-6 text-right shrink-0">{{ i + 1 }}</span>
      <span
        class="text-slate-300 min-w-0"
        :style="{ paddingLeft: `${toLine(line).indent || 0}ch` }"
        v-html="toLine(line).html"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.line-icon) {
  display: inline-block;
  width: 14px;
  height: 14px;
  vertical-align: -2px;
  margin-right: 2px;
}
</style>
