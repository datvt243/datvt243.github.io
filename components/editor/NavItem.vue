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
    :class="active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'"
  >
    <slot />
  </button>
</template>
