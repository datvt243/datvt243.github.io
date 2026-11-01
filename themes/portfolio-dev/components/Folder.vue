<script setup lang="ts">
/**
 * Collapsible file-tree folder header + list shell, used inside editor/Panel.vue sidebars.
 *
 * `collapseBelowLg` starts it closed below `lg`, where Panel stacks the
 * sidebar above the content. The viewport is unknown during SSR, so `open`
 * stays `null` until mount and CSS (`hidden lg:block`) picks the state,
 * which avoids a layout shift after hydration.
 */
const props = withDefaults(
  defineProps<{
    label: string
    defaultOpen?: boolean
    collapseBelowLg?: boolean
  }>(),
  { defaultOpen: true, collapseBelowLg: false },
)

const open = ref<boolean | null>(props.collapseBelowLg ? null : props.defaultOpen)

onMounted(() => {
  if (open.value === null) open.value = window.matchMedia('(min-width: 64rem)').matches
})
</script>

<template>
  <div>
    <button
      type="button"
      :aria-expanded="open ?? undefined"
      class="flex items-center gap-1.5 text-xs uppercase tracking-widest text-theme-faint mb-3 font-theme-mono"
      @click="open = !open"
    >
      <UIcon
        name="fe:drop-down"
        class="w-3 h-3 transition-transform"
        :class="open === null ? '-rotate-90 lg:rotate-0' : open ? '' : '-rotate-90'"
      />
      <UIcon :name="open === false ? 'fe:folder' : 'fe:folder-open'" class="w-3.5 h-3.5" />
      {{ label }}
    </button>
    <ul v-show="open !== false" class="space-y-1" :class="{ 'hidden lg:block': open === null }">
      <slot />
    </ul>
  </div>
</template>
