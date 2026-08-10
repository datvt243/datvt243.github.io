<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { buildJsonArrayLines } from '@/utils/index'

const store = useResumeStore()
const foreignLanguages = computed(() => store.foreignLanguages)

const lines = computed(() =>
  buildJsonArrayLines((foreignLanguages.value || []).map((el) => ({ language: el.language || '', level: el.level || '' }))),
)
</script>

<template>
  <ThemeCodeBlock :lines="lines" />
</template>
