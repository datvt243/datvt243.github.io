<template>
  <div class="wrapper-app">
    <NuxtLoadingIndicator :height="3" color="repeating-linear-gradient(to right, #fb923c 0%, #f97316 50%, #fb923c 100%)" />
    <div class="flex flex-col min-h-screen">
      <ThemeHeader />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <ThemeFooter />
    </div>
    <UNotifications />
  </div>
</template>
<script setup lang="ts">
// nuxt.config.ts's app.head.htmlAttrs.lang is a static 'vi' fallback (SSR's
// very first response, before any locale is known) - override it per real
// active locale so <html lang> matches what's actually rendered (e.g. "en"
// under the /en/* prefix), instead of always claiming Vietnamese.
// addSeoAttributes was previously omitted here because it triggered an
// "I18n baseUrl is required" build warning - nuxt.config.ts's i18n.baseUrl
// is now a real value (server/utils/siteUrl.ts's SITE_URL), so canonical +
// hreflang alternate <link> tags can be generated for real.
const i18nHead = useLocaleHead({ addSeoAttributes: true })
useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang,
  },
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
}))
</script>

