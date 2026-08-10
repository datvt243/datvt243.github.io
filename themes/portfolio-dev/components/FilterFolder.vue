<script setup lang="ts">
/**
 * File-tree style multi-select filter, used inside editor/Panel.vue sidebars.
 * Standard established by the /github languages filter.
 */
const props = defineProps<{
  label: string
  items: string[]
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

function toggle(item: string) {
  const next = props.modelValue.includes(item)
    ? props.modelValue.filter((v) => v !== item)
    : [...props.modelValue, item]
  emit('update:modelValue', next)
}
</script>

<template>
  <div>
    <ThemeFolder :label="label">
      <li v-for="item in items" :key="item">
        <ThemeNavItem :active="modelValue.includes(item)" @click="toggle(item)">
          <span class="flex items-center gap-2">
            <UIcon name="fe:hash" class="w-3.5 h-3.5 opacity-50 shrink-0" />
            {{ item }}
          </span>
        </ThemeNavItem>
      </li>
    </ThemeFolder>

    <div
      v-if="modelValue.length"
      class="flex items-center gap-2 text-xs font-theme-mono text-theme-faint border-t border-theme-border mt-4 pt-3"
    >
      <span class="text-theme-text-soft truncate">{{ modelValue.join(', ') }};</span>
      <button
        type="button"
        class="shrink-0 text-theme-faint hover:text-theme-accent transition-colors"
        aria-label="Clear filters"
        @click="emit('update:modelValue', [])"
      >
        <UIcon name="fe:close" class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>
