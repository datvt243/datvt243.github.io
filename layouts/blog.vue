<script setup lang="ts"></script>

<template>
    <div class="flex flex-col min-h-screen">
        <TemplateHeader />
        <main class="grow p-0 layout-blog pt-4">
            <div class="container-block !pt-0">
                <div class="flex sm:space-x-24">
                    <div class="grow">
                        <slot></slot>
                    </div>
                    <div
                        class="hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-slate-800 sm:block"
                    >
                        <div class="px-4 py-4">
                            <h3 class="font-bold text-lg tracking-wider uppercase text-pink">All Posts</h3>
                            <ul>
                                <li
                                    class="my-3"
                                    v-for="tag in [
                                        'next-js',
                                        'guide',
                                        'tailwind',
                                        'feature',
                                        'markdown',
                                        'code',
                                        'features',
                                        'math',
                                        'ols',
                                        'github',
                                        'holiday',
                                        'canada',
                                        'images',
                                        'writings',
                                        'book',
                                        'reflection',
                                        'multi-author',
                                    ]"
                                    :key="tag"
                                >
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase hover:text-primary-500 dark:hover:text-primary-500"
                                        aria-label="View posts tagged next-js"
                                        href="/tags/next-js"
                                    >
                                        {{ tag }}</a
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <TemplateFooter />
    </div>
</template>
