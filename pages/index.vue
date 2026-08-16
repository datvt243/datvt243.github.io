<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { Resume } from '@/types/resume-document'
import { removeHtmlTags } from '@/utils'

const resumeStore = useResumeStore()

definePageMeta({
  layout: 'default',
})

const { data, error } = await useAsyncData<Resume>(`api-resume`, async () => await resumeStore.fetchData())

const seoTitle = computed(() => {
  const { firstName = '', lastName = '' } = data.value || {}
  return firstName || lastName ? `Resume ${firstName} ${lastName}`.trim() : 'Võ Tấn CV'
})
const seoDescription = computed(() => removeHtmlTags(data.value?.introduction || ''))

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
  twitterCard: 'summary_large_image',
})

const isValid = computed(() => !!data.value && Object.keys(data.value).length)
</script>

<template>
  <div class="page-index mx-auto">
    <template v-if="!error">
      <UContainer v-if="isValid && data">
        <ThemeResumeObject />
      </UContainer>
    </template>
    <template v-else>
      {{ error }}
    </template>
  </div>
</template>

<style scoped></style>
