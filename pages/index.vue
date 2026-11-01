<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import { removeHtmlTags } from '@/utils'

const resumeStore = useResumeStore()
const { contact, AppHeading } = useAppConfig()
const { public: publicConfig } = useRuntimeConfig()

definePageMeta({
  layout: 'default',
})

const { data } = await useResumeData()

const seoTitle = computed(() => {
  const { firstName = '', lastName = '' } = data.value || {}
  return firstName || lastName ? `Resume ${firstName} ${lastName}`.trim() : 'Võ Tấn CV'
})
const seoDescription = computed(() => removeHtmlTags(data.value?.introduction || ''))
const ogImageUrl = `${publicConfig.SITE_URL}/og-image.png`

useSeoMeta({
  title: seoTitle,
  // The home title already carries the name; the global template would repeat it.
  titleTemplate: '%s',
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
  ogImage: ogImageUrl,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterImage: ogImageUrl,
})

/**
 * Person structured data - a CV site has no page more relevant to attach
 * this to than the resume itself. Every field traces to real, already-shown
 * data (app.config.ts's contact + the resume store's positionDesired) - no
 * fabricated identifiers.
 */
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: AppHeading,
          jobTitle: resumeStore.hero.positionDesired,
          url: publicConfig.SITE_URL,
          sameAs: [contact.social.github, contact.social.linkedin].filter(Boolean),
        }),
      ),
    },
  ],
})

const isValid = computed(() => !!data.value && Object.keys(data.value).length)
</script>

<template>
  <div class="page-index mx-auto">
    <UContainer v-if="isValid && data">
      <ThemeResumeObject />
    </UContainer>
  </div>
</template>

<style scoped></style>
