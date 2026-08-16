<script setup lang="ts">
/**
 * Reusable 2-column "sidebar file-tree + editor pane" shell.
 * Used by resumeObject/Index.vue and later reskinned pages (github/blogs/contact).
 *
 * The root's `editor-scope` class re-skins this whole subtree to Dracula
 * (see settings-colors-theme/editor-dracula.css) by overriding the same
 * `--theme-*` custom properties every descendant already reads - no
 * component below this needs to know that scope exists.
 */
</script>

<template>
  <div class="editor-scope border border-theme-border rounded-lg overflow-hidden font-theme-mono bg-theme-editor shadow-md">
    <div class="grid lg:grid-cols-[240px_1fr]">
      <aside class="border-b lg:border-b-0 lg:border-r border-theme-border bg-theme-panel/50 p-4">
        <slot name="sidebar" />
      </aside>
      <div class="min-w-0">
        <div v-if="$slots.filetab" class="flex items-center gap-2 border-b border-theme-border bg-theme-panel/30 px-4 py-2 text-xs text-theme-muted">
          <slot name="filetab" />
        </div>
        <div class="p-6 min-h-[300px] overflow-x-auto">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
