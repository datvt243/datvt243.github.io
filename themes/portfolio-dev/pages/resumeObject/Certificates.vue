<script setup lang="ts">
import { buildJsonArrayLines } from '@/utils/index'

const store = useResumeStore()

const lines = computed(() =>
  buildJsonArrayLines(
    store.certificates.map((el) => ({
      name: el.name,
      organization: el.organization,
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
