<script setup lang="ts">
/**
 * File-tree style sidebar nav button, used inside editor/Panel.vue sidebars.
 */
defineProps<{
  active?: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="w-full text-left px-2 py-1.5 rounded text-sm transition-colors"
    :class="active ? 'bg-theme-panel-subtle text-theme-text' : 'text-theme-muted hover:text-theme-text-strong hover:bg-theme-panel-subtle/50'"
  >
    <slot />
  </button>
</template>
