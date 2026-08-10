<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

definePageMeta({
  layout: 'default',
})

const { contact } = useAppConfig()
const getDesc = computed(() => {
  return `Get in touch with me at ${contact.email}. I would love to hear from you! Reach us at ${contact.phone} and ${contact.address}.`
})

useSeoMeta({
  title: 'Contact me',
  ogTitle: 'Contact me',
  description: getDesc.value,
  ogDescription: getDesc.value,
})
</script>

<template>
  <ThemeContact />
</template>
