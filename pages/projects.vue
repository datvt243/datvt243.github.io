<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
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
