<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

definePageMeta({
  layout: 'blog',
})

const { t } = useI18n()
const seoTitle = computed(() => t('blogs.seoTitle'))
const seoDescription = computed(() => t('blogs.seoDescription'))

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
})
</script>

<template>
  <ThemeBlogs />
</template>
