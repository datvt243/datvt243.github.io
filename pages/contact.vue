<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()
const { contact } = useAppConfig()
const seoTitle = computed(() => t('contact.seoTitle'))
const seoDescription = computed(() => t('contact.seoDescription', { email: contact.email, phone: contact.phone, address: contact.address }))

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
})
</script>

<template>
  <ThemeContact />
</template>
