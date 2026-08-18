<script setup lang="ts">
/**
 * Editor-style top nav (tab-bar look).
 * Visual reference: alexdeploy/developer-portfolio-v2 (tab-bar theme).
 */

const { menuPrimary = [] } = useAppConfig()
const route = useRoute()
const colorMode = useColorMode()
const { t, locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()

const isOpen = ref(false)

const isActive = (link: string) => route.path === localePath(link)
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
const otherLocale = computed(() => locales.value.find((l) => (typeof l === 'string' ? l : l.code) !== locale.value))
const toggleLocale = () => {
  const target = typeof otherLocale.value === 'string' ? otherLocale.value : otherLocale.value?.code
  if (target) setLocale(target)
}

const mainTabs = computed(() => menuPrimary.filter((r: { link: string }) => r.link !== '/contact'))
const contactTab = computed(() => menuPrimary.find((r: { link: string }) => r.link === '/contact'))
</script>

<template>
  <header class="border-b border-theme-border bg-theme-panel font-theme-mono text-sm">
    <UContainer :ui="{ constrained: 'mx-auto max-w-screen-lg px-3 py-0 md:py-0 lg:py-0' }">
      <div class="flex items-stretch">
        <NuxtLink
          :to="localePath('/')"
          class="flex shrink-0 items-center border-r border-theme-border pr-4 py-3 text-theme-muted hover:text-theme-text-strong transition-colors"
        >
          <label class="text-bold">_datvt243</label>
        </NuxtLink>

        <nav class="hidden lg:flex items-stretch grow">
          <NuxtLink
            v-for="route_ in mainTabs"
            :key="route_.link"
            :to="localePath(route_.link)"
            class="flex items-center border-r border-theme-border px-5 py-3 whitespace-nowrap transition-colors"
            :class="
              isActive(route_.link)
                ? 'text-theme-text border-b-2 border-b-theme-accent -mb-px bg-theme-panel-subtle/40'
                : 'text-theme-muted hover:text-theme-text-strong'
            "
          >
            {{ route_.page }}
          </NuxtLink>
          <div class="grow" />
          <NuxtLink
            v-if="contactTab"
            :to="localePath(contactTab.link)"
            class="flex items-center border-l border-theme-border px-5 py-3 whitespace-nowrap transition-colors"
            :class="
              isActive(contactTab.link)
                ? 'text-theme-text border-b-2 border-b-theme-accent -mb-px bg-theme-panel-subtle/40'
                : 'text-theme-muted hover:text-theme-text-strong'
            "
          >
            {{ contactTab.page }}
          </NuxtLink>
        </nav>

        <button
          class="flex items-center border-l border-theme-border px-4 text-theme-muted hover:text-theme-text-strong transition-colors uppercase text-xs font-bold"
          :aria-label="t('header.switchLanguage')"
          @click="toggleLocale"
        >
          {{ locale }}
        </button>

        <button
          class="flex items-center border-l border-theme-border px-4 text-theme-muted hover:text-theme-text-strong transition-colors"
          :aria-label="colorMode.value === 'dark' ? t('header.switchToLight') : t('header.switchToDark')"
          @click="toggleColorMode"
        >
          <UIcon v-if="colorMode.value === 'dark'" name="fe:sunny-o" class="w-4 h-4" />
          <UIcon v-else name="fe:moon" class="w-4 h-4" />
        </button>

        <div class="grow lg:hidden" />

        <button class="lg:hidden flex items-center px-4 text-theme-text-soft hover:text-theme-text" :aria-label="t('header.openMenu')" @click="isOpen = true">
          <UIcon name="fe:bar" class="w-5 h-5" />
        </button>

        <USlideover v-model="isOpen">
          <div class="p-4 flex-1 bg-theme-panel font-theme-mono">
            <button
              class="flex lg:hidden absolute end-5 top-5 z-10 text-theme-text-soft hover:text-theme-text"
              :aria-label="t('header.closeMenu')"
              @click="isOpen = false"
            >
              <UIcon name="fe:close" class="w-5 h-5" />
            </button>
            <ul class="space-y-1 pt-14">
              <li v-for="route_ in menuPrimary" :key="`m-${route_.link}`">
                <NuxtLink
                  :to="localePath(route_.link)"
                  class="block rounded px-3 py-2 transition-colors"
                  :class="isActive(route_.link) ? 'text-theme-text bg-theme-panel-subtle' : 'text-theme-muted hover:text-theme-text-strong hover:bg-theme-panel-subtle/50'"
                  @click="isOpen = false"
                >
                  {{ route_.page }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </USlideover>
      </div>
    </UContainer>
  </header>
</template>
