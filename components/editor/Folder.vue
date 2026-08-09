<script setup lang="ts">
/**
 * Collapsible file-tree folder header + list shell, used inside editor/Panel.vue sidebars.
 */
const props = withDefaults(
  defineProps<{
    label: string
    defaultOpen?: boolean
  }>(),
  { defaultOpen: true },
)

const open = ref(props.defaultOpen)
</script>

<template>
  <div>
    <button
      type="button"
      class="flex items-center gap-1.5 text-xs uppercase tracking-widest text-slate-500 mb-3 font-jetbrains"
      @click="open = !open"
    >
      <UIcon name="fe:drop-down" class="w-3 h-3 transition-transform" :class="open ? '' : '-rotate-90'" />
      <UIcon :name="open ? 'fe:folder-open' : 'fe:folder'" class="w-3.5 h-3.5" />
      {{ label }}
    </button>
    <ul v-show="open" class="space-y-1">
      <slot />
    </ul>
  </div>
</template>
