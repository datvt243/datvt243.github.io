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
                        class="hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-white bg-opacity-5 sm:block"
                    >
                        <div class="px-4 py-4">
                            <h3 class="font-bold text-lg tracking-widest uppercase text-pink mb-4 mt-2">All Posts</h3>
                            <ul class="list pl-1 space-y-3">
                                <li
                                    class=""
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
                                    <NuxtLink
                                        to="/blogs"
                                        aria-label="View posts tagged next-js"
                                        class="px-3 py-2 text-sm font-medium uppercase hover:text-pink"
                                    >
                                        _ {{ tag }}
                                    </NuxtLink>
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
