<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */
import { formatDate } from '~/utils'
import type { Post } from '@/types/index'

const props = defineProps<{
	modelValue: Post
}>()
</script>

<template>
  <div class="container-block !pt-0">
    <article
      class="mx-auto format format-sm sm:format-base lg:format-lg format-blue dark:format-invert mb-8 pb-4 border-b border-theme-border font-theme-mono"
    >
      <header class="py-5 md:py-8 lg:py-12">
        <div class="space-y-1 text-center">
          <dl class="space-y-10">
            <div>
              <dt class="sr-only">Published on</dt>
              <dd class="text-base font-medium leading-6 text-theme-faint">
                <time datetime="2023-08-05T00:00:00.000Z">
                  {{ formatDate(modelValue.createdAt) }}
                </time>
              </dd>
            </div>
          </dl>
          <div>
            <h1
              class="text-theme-accent text-3xl font-bold leading-9 tracking-wide sm:text-4xl sm:leading-10 md:text-5xl md:leading-14"
            >
              {{ modelValue.title }}
            </h1>
          </div>
        </div>
      </header>
      <hr class="hidden md:my-8 border-theme-border" />
      <div
        class="grid-rows-[auto_1fr] divide-y divide-theme-border pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0"
      >
        <div class="my-6 md:my-6 lg:my-4 xl:my-0 p-0">
          <ThemePostAuthor />
        </div>

        <div class="divide-y divide-theme-border xl:col-span-3 xl:row-span-2 xl:pb-0 lg:py-12 xl:py-4">
          <div class="post-content text-theme-text-soft" v-html="modelValue.content"/>
        </div>
        <footer>
          <div
            class="divide-theme-border text-sm font-medium leading-5 xl:col-start-1 xl:row-start-2 xl:divide-y"
          >
            <div class="py-4 xl:py-8">
              <h2 class="text-lg text-bold uppercase tracking-wide text-theme-accent pb-2 mb-2 border-b border-theme-border">Tags</h2>
              <div class="flex flex-wrap space-x-4">
                <NuxtLink to="'/blogs'" class="link text-sm font-medium lowercase text-theme-muted hover:text-theme-accent">
                  #tag
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="pt-4 xl:pt-8">
            <NuxtLink
              to="/blogs"
              class="btn border-theme-accent border rounded-md p-4 text-theme-accent hover:bg-theme-accent hover:text-theme-accent-contrast transition-all"
              aria-label="Back to the blog"
            >
              <span class="flex items-center space-x-2">
                <UIcon name="fe:backward" class="w-5 h-5" />
                <span class="uppercase">Back to the blog</span>
              </span>
            </NuxtLink>
          </div>
        </footer>
      </div>
    </article>
  </div>
</template>
