<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const isNotFound = computed(() => props.error.statusCode === 404)

function handleError() {
  clearError({
    redirect: localePath('/'),
  })
}

// A full reload, not clearError(): the failed page must be server-rendered again.
function retry() {
  window.location.reload()
}
</script>

<template>
  <NuxtLayout name="error">
    <!-- component -->
    <div
      class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16"
    >
      <div class="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <div class="relative">
          <div class="status-code text-8xl font-bold">
            <span>{{ props.error.statusCode }}</span>
          </div>
          <div class="clearfix my-6">
            <div class="">
              <h1 class="my-2 font-bold text-2xl">{{ isNotFound ? t('error.notFoundTitle') : t('error.serverTitle') }}</h1>
              <p class="my-3">{{ isNotFound ? t('error.notFoundText') : t('error.serverText') }}</p>
              <button
                v-if="!isNotFound"
                class="sm:w-full lg:w-auto my-2 mr-2 border rounded-sm md py-3 px-8 text-center bg-theme-accent text-theme-accent-contrast hover:bg-theme-accent-soft focus:outline-hidden focus:ring-2 focus:ring-theme-accent/50"
                @click="retry"
              >
                {{ t('error.retry') }}
              </button>
              <button
                class="sm:w-full lg:w-auto my-2 border rounded-sm md py-3 px-8 text-center bg-theme-accent text-theme-accent-contrast hover:bg-theme-accent-soft focus:outline-hidden focus:ring-2 focus:ring-theme-accent/50"
                @click="handleError"
              >
                {{ t('error.home') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <NuxtImg src="error.png" alt="" />
      </div>
    </div>
    <!-- <div class="error-page w-[400px] mx-auto">
            <h2 class="text-8xl">{{ props.error.statusCode }}</h2>
            <p>Something wrong here</p>
            <button
                class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-sm"
                @click="handleError"
            >
                Clear errors
            </button>
        </div> -->
  </NuxtLayout>
</template>
