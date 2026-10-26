<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

const props = defineProps<{
	status: 'idle' | 'pending' | 'success' | 'error'
	data: readonly unknown[] | null
	message?: string
}>()
const emit = defineEmits<{ retry: [] }>()
const { t } = useI18n()

const isLoading = ref(false)
const loadingAfterMillisecond = 500
watch(
  isLoading,
  () => {
    setTimeout(() => {
      isLoading.value = true
    }, loadingAfterMillisecond)
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="list-render">
    <div v-if="props.status === 'error'" role="alert" class="p-8 text-center text-theme-muted bg-theme-panel-subtle rounded-sm space-y-4">
      <p>{{ props.message || t('error.loadError') }}</p>
      <UButton color="neutral" variant="outline" icon="i-fe-sync" @click="emit('retry')">{{ t('error.retry') }}</UButton>
    </div>
    <template v-else-if="props.status !== 'success'">
      <template v-if="$slots.loading">
        <slot v-if="isLoading" name="loading"/>
      </template>
      <p v-else class="p-8">loading ...</p>
    </template>
    <template v-else>
      <ul v-if="props.data?.length" class="list space-y-5">
        <slot/>
      </ul>
      <div v-else class="no-data center p-8 bg-theme-panel-subtle text-theme-muted rounded-sm">
        <p class="text-xl uppercase text-center font-bold">No data</p>
      </div>
    </template>
  </div>
</template>
