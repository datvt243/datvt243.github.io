<script setup lang="ts">
import type { Post } from '@/types/index';

const props = defineProps<{
    modelValue: Post;
}>();
</script>

<template>
    <article
        class="mx-auto format format-sm sm:format-base lg:format-lg format-blue dark:format-invert mb-8 pb-4 border-b"
    >
        <header class="mb-4 lg:mb-6 not-format">
            <h1 class="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-black">
                {{ modelValue.title }}
            </h1>
        </header>
        <div class="post-content" v-html="modelValue.content"></div>
    </article>
</template>
