<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()
const seoTitle = computed(() => t('projects.seoTitle'))
const seoDescription = computed(() => t('projects.seoDescription'))

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
})
</script>

<template>
  <ThemeProjects />
</template>
