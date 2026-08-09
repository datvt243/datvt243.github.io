<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { buildJsonArrayLines, convertNumberToDate } from '@/utils/index'

const store = useResumeStore()
const educations = computed(() => store.educations)

const stripHtml = (html?: string) => (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

const lines = computed(() =>
  buildJsonArrayLines(
    (educations.value || []).map((el) => ({
      school: el.school || '',
      major: el.major || '',
      startDate: convertNumberToDate(el.startDate),
      endDate: el.isCurrent ? 'present' : convertNumberToDate(el.endDate),
      description: stripHtml(el.description),
    })),
  ),
)
</script>

<template>
  <EditorCodeBlock :lines="lines" />
</template>
