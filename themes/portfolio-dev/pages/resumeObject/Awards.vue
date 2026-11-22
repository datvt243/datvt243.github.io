<script setup lang="ts">
import { buildJsonArrayLines } from '@/utils/index'

const store = useResumeStore()

const lines = computed(() =>
  buildJsonArrayLines(store.awards.map((el) => ({ name: el.name, organization: el.organization, issueDate: el.issueDateLabel, description: el.descriptionText }))),
)
</script>

<template>
  <ThemeCodeBlock :lines="lines" />
</template>
