<script setup lang="ts">
/**
 * Reusable 2-column "sidebar file-tree + editor pane" shell.
 * Used by resumeObject/Index.vue and later reskinned pages (github/blogs/contact).
 */
</script>

<template>
  <div class="grid lg:grid-cols-[240px_1fr] border border-slate-800 rounded-lg overflow-hidden font-jetbrains">
    <aside class="border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/50 p-4">
      <slot name="sidebar" />
    </aside>
    <div class="p-6 min-h-[300px] overflow-x-auto">
      <slot />
    </div>
  </div>
</template>
