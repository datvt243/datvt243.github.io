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
  </div>
</template>
<script setup lang="ts">
// nuxt.config.ts's app.head.htmlAttrs.lang is a static 'vi' fallback (SSR's
// very first response, before any locale is known) - override it per real
// active locale so <html lang> matches what's actually rendered (e.g. "en"
// under the /en/* prefix), instead of always claiming Vietnamese.
// addSeoAttributes/canonical alternate-links are out of this node's scope
// (only the lang attribute was flagged as missing in issue #80) - omitting
// that option also avoids a "I18n baseUrl is required" build warning it
// would otherwise trigger.
const i18nHead = useLocaleHead()
useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang,
  },
}))
</script>

