<script lang="ts" setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
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
