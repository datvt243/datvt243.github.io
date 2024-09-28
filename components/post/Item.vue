<script setup lang="ts">
/* import { convertNumberToDate } from '@/utils/index'; */
import type { Post } from '@/types/index';

const props = defineProps<{
    modelValue: Post;
}>();

const formatDate = computed<string>(() => {
    const _date = new Date(props.modelValue.createdAt);
    let _d: string | number = _date.getDate(),
        _m: string | number = _date.getMonth() + 1;
    _d = _d < 10 ? `0${_d}` : _d;
    _m = _m < 10 ? `0${_m}` : _m;
    return `${_d}/${_m}/${_date.getFullYear()}`;
});
</script>

<template>
    <article class="flex flex-col space-y-2 xl:space-y-0">
        <dl>
            <dt class="sr-only">Published on</dt>
            <dd class="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                <time datetime="2023-08-05T00:00:00.000Z">
                    {{ formatDate }}
                </time>
            </dd>
        </dl>
        <div class="space-y-3">
            <div>
                <p class="text-2xl mb-2 font-bold capitalize leading-8 tracking-tight">
                    <NuxtLink :to="`blogs/${modelValue._id}`" class="text-gray-900 dark:text-gray-100">
                        {{ modelValue.title }}
                    </NuxtLink>
                </p>
                <div class="flex flex-wrap">
                    <a
                        class="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-pink"
                        href="/tags/next-js"
                        >next-js</a
                    ><a
                        class="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-pink"
                        href="/tags/tailwind"
                        >tailwind</a
                    ><a
                        class="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-pink"
                        href="/tags/guide"
                        >guide</a
                    ><a
                        class="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-pink"
                        href="/tags/feature"
                        >feature</a
                    >
                </div>
            </div>
            <div class="prose max-w-none text-gray-500 dark:text-gray-400">
                Release of Tailwind Nextjs Starter Blog template v2.0, refactored with Nextjs App directory and React
                Server Components setup.Discover the new features and how to migrate from V1.
            </div>
        </div>
    </article>
</template>

<style scoped></style>
