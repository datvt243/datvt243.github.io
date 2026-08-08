<script setup lang="ts">
/**
 * Editor-style top nav: replaces components/template/Header.vue.
 * Visual reference: alexdeploy/developer-portfolio-v2 (tab-bar theme).
 */

const { menuPrimary = [] } = useAppConfig()
const route = useRoute()

const isOpen = ref(false)

const isActive = (link: string) => route.path === link

const mainTabs = computed(() => menuPrimary.filter((r: { link: string }) => r.link !== '/contact'))
const contactTab = computed(() => menuPrimary.find((r: { link: string }) => r.link === '/contact'))
</script>

<template>
  <header class="border-b border-slate-800 bg-slate-900 font-jetbrains text-sm">
    <UContainer>
      <div class="flex items-stretch">
        <NuxtLink
          to="/"
          class="flex shrink-0 items-center border-r border-slate-800 pr-4 py-3 text-slate-400 hover:text-slate-200 transition-colors"
        >
          đạt-võ
        </NuxtLink>

        <nav class="hidden lg:flex items-stretch grow overflow-x-auto">
          <NuxtLink
            v-for="route_ in mainTabs"
            :key="route_.link"
            :to="route_.link"
            class="flex items-center border-r border-slate-800 px-5 py-3 whitespace-nowrap transition-colors"
            :class="isActive(route_.link) ? 'text-white border-b-2 border-b-orange-400 -mb-px bg-slate-800/40' : 'text-slate-400 hover:text-slate-200'"
          >
            {{ route_.page }}
          </NuxtLink>
          <div class="grow" />
          <NuxtLink
            v-if="contactTab"
            :to="contactTab.link"
            class="flex items-center border-l border-slate-800 px-5 py-3 whitespace-nowrap transition-colors"
            :class="isActive(contactTab.link) ? 'text-white border-b-2 border-b-orange-400 -mb-px bg-slate-800/40' : 'text-slate-400 hover:text-slate-200'"
          >
            {{ contactTab.page }}
          </NuxtLink>
        </nav>

        <div class="grow lg:hidden" />

        <button
          class="lg:hidden flex items-center px-4 text-slate-300 hover:text-white"
          aria-label="Open menu"
          @click="isOpen = true"
        >
          <UIcon name="fe:bar" class="w-5 h-5" />
        </button>

        <USlideover v-model="isOpen">
          <div class="p-4 flex-1 bg-slate-900 font-jetbrains">
            <button
              class="flex lg:hidden absolute end-5 top-5 z-10 text-slate-300 hover:text-white"
              aria-label="Close menu"
              @click="isOpen = false"
            >
              <UIcon name="fe:close" class="w-5 h-5" />
            </button>
            <ul class="space-y-1 pt-14">
              <li v-for="route_ in menuPrimary" :key="`m-${route_.link}`">
                <NuxtLink
                  :to="route_.link"
                  class="block rounded px-3 py-2 transition-colors"
                  :class="isActive(route_.link) ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'"
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
