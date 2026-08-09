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
    <EditorFolder :label="label">
      <li v-for="item in items" :key="item">
        <EditorNavItem :active="modelValue.includes(item)" @click="toggle(item)">
          <span class="flex items-center gap-2">
            <UIcon name="fe:hash" class="w-3.5 h-3.5 opacity-50 shrink-0" />
            {{ item }}
          </span>
        </EditorNavItem>
      </li>
    </EditorFolder>

    <div
      v-if="modelValue.length"
      class="flex items-center gap-2 text-xs font-jetbrains text-slate-500 border-t border-slate-800 mt-4 pt-3"
    >
      <span class="text-slate-300 truncate">{{ modelValue.join(', ') }};</span>
      <button
        type="button"
        class="shrink-0 text-slate-500 hover:text-orange-400 transition-colors"
        aria-label="Clear filters"
        @click="emit('update:modelValue', [])"
      >
        <UIcon name="fe:close" class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>
