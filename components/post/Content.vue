<script setup lang="ts">
import type { Post } from '@/types/index';

const props = defineProps<{
    modelValue: Post;
}>();
</script>

<template>
    <article
        class="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert"
    >
        <header class="mb-4 lg:mb-6 not-format">
            <address class="flex items-center mb-6 not-italic">
                <div class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                    <img
                        class="mr-4 w-16 h-16 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                        alt="David"
                    />
                    <div>
                        <a href="#" rel="author" class="text-xl font-bold text-gray-900 dark:text-white">
                            Author Name
                        </a>
                        <p class="text-base text-gray-500 dark:text-gray-400">Author Job</p>
                        <p class="text-base text-gray-500 dark:text-gray-400">
                            {{ modelValue.createdAt }}
                        </p>
                    </div>
                </div>
            </address>
            <h1 class="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
                {{ modelValue.title }}
            </h1>
        </header>
        <div class="post-content" v-html="modelValue.content"></div>
    </article>
</template>
