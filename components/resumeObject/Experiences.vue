<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { buildJsonArrayLines, convertNumberToDate } from '@/utils/index'

const store = useResumeStore()
const experiences = computed(() => store.experiences)

const stripHtml = (html?: string) => (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

const lines = computed(() =>
  buildJsonArrayLines(
    (experiences.value || []).map((el) => ({
      position: el.position || '',
      company: el.company || '',
      startDate: convertNumberToDate(el.startDate),
      endDate: el.isCurrent ? 'present' : convertNumberToDate(el.endDate),
      skills: (el.skills || []).join(', '),
      description: stripHtml(el.description),
    })),
  ),
)
</script>

<template>
  <EditorCodeBlock :lines="lines" />
</template>
