<script setup lang="ts">
/**
 * Bordered panel with 4 small corner-bracket dots, VS-Code-widget style.
 * Wrap any content (photo, thumbnail) to get the editor-theme "framed" look.
 */
</script>

<template>
  <div class="relative rounded-xl border border-theme-border-subtle bg-theme-panel p-3">
    <span class="absolute -top-1 -left-1 w-2 h-2 rounded-full border border-theme-border-faint bg-theme-panel" />
    <span class="absolute -top-1 -right-1 w-2 h-2 rounded-full border border-theme-border-faint bg-theme-panel" />
    <span class="absolute -bottom-1 -left-1 w-2 h-2 rounded-full border border-theme-border-faint bg-theme-panel" />
    <span class="absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-theme-border-faint bg-theme-panel" />
    <slot />
  </div>
</template>
