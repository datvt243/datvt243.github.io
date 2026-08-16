<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { buildJsonArrayLines } from '@/utils/index'

const store = useResumeStore()
const educations = computed(() => store.educations)

const lines = computed(() =>
  buildJsonArrayLines(
    (educations.value || []).map((el) => ({
      school: el.school,
      major: el.major,
      startDate: el.startDateLabel,
      endDate: el.endDateLabel,
      description: el.descriptionText,
    })),
  ),
)
</script>

<template>
  <ThemeCodeBlock :lines="lines" />
</template>
