<script lang="ts" setup>
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()
const seoTitle = computed(() => t('github.seoTitle'))
const seoDescription = computed(() => t('github.seoDescription'))

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
})
</script>

<template>
  <ThemeGithub/>
</template>
