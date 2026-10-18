<script setup lang="ts">
/**
 * Vim-style site-wide keyboard navigation: `g`+key jumps to a menuPrimary
 * route, j/k scroll, gg/G top/bottom, `?` toggles the help overlay.
 *
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

const { menuPrimary = [] } = useAppConfig()
const { t } = useI18n()
const localePath = useLocalePath()

const SCROLL_STEP = 80
const PREFIX_TIMEOUT_MS = 1000

// Owned by the parent so a visible button can open the same overlay as the `?` key.
const isHelpOpen = defineModel<boolean>({ default: false })
let isPrefixPending = false
let prefixTimer: ReturnType<typeof setTimeout> | undefined

/**
 * Page-level shortcuts are declared in markup (`data-shortcut` + `data-shortcut-label`)
 * instead of registered in JS, so any themed component can add one without touching this file.
 */
const visibleShortcuts = () =>
  [...document.querySelectorAll<HTMLElement>('[data-shortcut]')].filter((el) => el.getClientRects().length > 0)
const pageShortcuts = ref<{ keys: string; label: string }[]>([])
watch(isHelpOpen, (open) => {
  if (open) pageShortcuts.value = visibleShortcuts().map((el) => ({ keys: el.dataset.shortcut ?? '', label: el.dataset.shortcutLabel ?? '' }))
})

const isTyping = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')

const onKeydown = (e: KeyboardEvent) => {
  // Modifier combos belong to the browser/OS (Ctrl+F, Cmd+K...), never hijack them.
  if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return
  if (isTyping(e.target)) {
    // Esc hands the keyboard back to the shortcuts, e.g. after `/` focused a search box.
    if (e.key === 'Escape') (e.target as HTMLElement).blur()
    return
  }

  if (e.key === '?') {
    isHelpOpen.value = !isHelpOpen.value
    return
  }
  if (isHelpOpen.value) return

  if (isPrefixPending) {
    isPrefixPending = false
    clearTimeout(prefixTimer)
    if (e.key === 'g') {
      window.scrollTo({ top: 0 })
      return
    }
    const item = menuPrimary.find((r: { key: string }) => r.key === e.key)
    if (item) navigateTo(localePath(item.link))
    return
  }

  if (e.key === 'g') {
    isPrefixPending = true
    prefixTimer = setTimeout(() => (isPrefixPending = false), PREFIX_TIMEOUT_MS)
  } else if (e.key === 'j') {
    window.scrollBy({ top: SCROLL_STEP })
  } else if (e.key === 'k') {
    window.scrollBy({ top: -SCROLL_STEP })
  } else if (e.key === 'G') {
    window.scrollTo({ top: document.documentElement.scrollHeight })
  } else {
    const target = visibleShortcuts().find((el) => el.dataset.shortcut === e.key)
    if (!target) return
    // Otherwise the key itself lands in a just-focused input (`/` → search box) or opens Firefox quick-find.
    e.preventDefault()
    // focus() first so the target scrolls into view; click() is a no-op on a disabled button.
    target.focus()
    target.click()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  clearTimeout(prefixTimer)
})

const motions = computed(() => [
  { keys: 'j', label: t('keyNav.scrollDown') },
  { keys: 'k', label: t('keyNav.scrollUp') },
  { keys: 'gg', label: t('keyNav.top') },
  { keys: 'G', label: t('keyNav.bottom') },
  { keys: '?', label: t('keyNav.help') },
])
</script>

<template>
  <UModal v-model="isHelpOpen" :ui="{ background: 'bg-theme-panel', ring: 'ring-1 ring-theme-border' }">
    <div class="p-5 font-theme-mono text-sm text-theme-text">
      <h2 class="mb-4 text-theme-text-strong font-bold">{{ t('keyNav.title') }}</h2>
      <ul class="space-y-2">
        <li v-for="item in menuPrimary" :key="item.link" class="flex items-center justify-between gap-4">
          <span class="text-theme-muted">{{ t('keyNav.goTo') }} {{ item.page }}</span>
          <ThemeKbd class="px-1.5">g{{ item.key }}</ThemeKbd>
        </li>
        <li v-for="m in motions" :key="m.keys" class="flex items-center justify-between gap-4">
          <span class="text-theme-muted">{{ m.label }}</span>
          <ThemeKbd class="px-1.5">{{ m.keys }}</ThemeKbd>
        </li>
      </ul>
      <template v-if="pageShortcuts.length">
        <h3 class="mt-4 mb-2 text-theme-text-strong font-bold">{{ t('keyNav.onThisPage') }}</h3>
        <ul class="space-y-2">
          <li v-for="s in pageShortcuts" :key="s.keys" class="flex items-center justify-between gap-4">
            <span class="text-theme-muted">{{ s.label }}</span>
            <ThemeKbd class="px-1.5">{{ s.keys }}</ThemeKbd>
          </li>
        </ul>
      </template>
      <p class="mt-4 border-t border-theme-border pt-3 text-xs text-theme-muted">{{ t('keyNav.extensionNote') }}</p>
    </div>
  </UModal>
</template>
