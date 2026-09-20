<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { Resume } from '@/types/resume-document'
import { removeHtmlTags } from '@/utils'

const resumeStore = useResumeStore()
const { contact, AppHeading } = useAppConfig()
const { public: publicConfig } = useRuntimeConfig()

definePageMeta({
  layout: 'default',
})

const { data, error } = await useAsyncData<Resume>(`api-resume`, async () => await resumeStore.fetchData())

const seoTitle = computed(() => {
  const { firstName = '', lastName = '' } = data.value || {}
  return firstName || lastName ? `Resume ${firstName} ${lastName}`.trim() : 'Võ Tấn CV'
})
const seoDescription = computed(() => removeHtmlTags(data.value?.introduction || ''))
// No dedicated social-share banner exists yet - reusing the real profile
// photo (already used as the hero avatar) so shares at least render a real
// image instead of none, per the `no-og-image` finding (issue #179).
const ogImageUrl = computed(() => `${publicConfig.SITE_URL}/Avatar.png`)

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
  ogImage: ogImageUrl,
  twitterCard: 'summary_large_image',
  twitterImage: ogImageUrl,
})

// Person structured data - a CV site has no page more relevant to attach
// this to than the resume itself. Every field traces to real, already-shown
// data (app.config.ts's contact + the resume store's positionDesired) - no
// fabricated identifiers.
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
    <template v-if="!error">
      <UContainer v-if="isValid && data">
        <ThemeResumeObject />
      </UContainer>
    </template>
    <template v-else>
      {{ error }}
    </template>
  </div>
</template>

<style scoped></style>
