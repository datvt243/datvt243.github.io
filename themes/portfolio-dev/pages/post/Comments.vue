<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description: Giscus (GitHub Discussions) comment widget, synced with
 * the site's dark/light color mode.
 */

// Repo name is a fixed, deterministic constant for this site (same
// convention as SITE_URL in server/routes/{rss,sitemap}.xml.ts) - only
// the opaque IDs below need real values from https://giscus.app's config
// generator, which requires GitHub Discussions enabled + the Giscus
// GitHub App installed on the repo first (a manual, one-time operator
// step - see root CLAUDE.md).
const GISCUS_REPO = 'datvt243/datvt243.github.io'

const { GISCUS_CATEGORY, GISCUS_CATEGORY_ID, GISCUS_REPO_ID } = useRuntimeConfig().public
const isConfigured = Boolean(GISCUS_REPO_ID && GISCUS_CATEGORY_ID)

const colorMode = useColorMode()
const containerRef = ref<HTMLElement | null>(null)

function giscusTheme() {
  return colorMode.value === 'dark' ? 'dark' : 'light'
}

function loadGiscus() {
  if (!isConfigured || !containerRef.value) return

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-repo', GISCUS_REPO)
  script.setAttribute('data-repo-id', GISCUS_REPO_ID)
  script.setAttribute('data-category', GISCUS_CATEGORY || 'Comments')
  script.setAttribute('data-category-id', GISCUS_CATEGORY_ID)
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', giscusTheme())
  script.setAttribute('data-lang', 'vi')

  containerRef.value.appendChild(script)
}

function getGiscusIframe() {
  return containerRef.value?.querySelector<HTMLIFrameElement>('iframe.giscus-frame') || null
}

watch(
  () => colorMode.value,
  () => {
    const iframe = getGiscusIframe()
    if (!iframe || !iframe.contentWindow) return
    iframe.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme() } } }, 'https://giscus.app')
  },
)

onMounted(() => {
  loadGiscus()
})
</script>

<template>
  <ClientOnly>
    <div class="pt-4 xl:pt-8 border-t border-theme-border">
      <h2 class="text-lg text-bold uppercase tracking-wide text-theme-accent pb-2 mb-4">Comments</h2>
      <div v-if="isConfigured" ref="containerRef" class="giscus" />
      <p v-else class="text-sm text-theme-muted">Giscus chưa được cấu hình.</p>
    </div>
  </ClientOnly>
</template>
