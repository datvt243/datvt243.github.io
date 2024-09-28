<script setup lang="ts"></script>

<template>
    <div class="flex flex-col min-h-screen">
        <TemplateHeader />
        <main class="grow p-0 layout-blog">
            <div class="container">
                <div class="flex sm:space-x-24">
                    <div class="grow">
                        <slot></slot>
                    </div>
                    <div
                        class="hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-gray-50 pt-5 shadow-md dark:bg-gray-900/70 dark:shadow-gray-800/40 sm:flex"
                    >
                        <div class="px-6 py-4">
                            <h3 class="font-bold uppercase text-pink">All Posts</h3>
                            <ul>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged next-js"
                                        href="/tags/next-js"
                                        >next-js (6)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged guide"
                                        href="/tags/guide"
                                        >guide (5)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged tailwind"
                                        href="/tags/tailwind"
                                        >tailwind (3)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged feature"
                                        href="/tags/feature"
                                        >feature (2)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged markdown"
                                        href="/tags/markdown"
                                        >markdown (1)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged code"
                                        href="/tags/code"
                                        >code (1)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged features"
                                        href="/tags/features"
                                        >features (1)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged math"
                                        href="/tags/math"
                                        >math (1)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged ols"
                                        href="/tags/ols"
                                        >ols (1)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged github"
                                        href="/tags/github"
                                        >github (1)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged holiday"
                                        href="/tags/holiday"
                                        >holiday (1)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged canada"
                                        href="/tags/canada"
                                        >canada (1)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged images"
                                        href="/tags/images"
                                        >images (1)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged writings"
                                        href="/tags/writings"
                                        >writings (1)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged book"
                                        href="/tags/book"
                                        >book (1)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged reflection"
                                        href="/tags/reflection"
                                        >reflection (1)</a
                                    >
                                </li>
                                <li class="my-3">
                                    <a
                                        class="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                                        aria-label="View posts tagged multi-author"
                                        href="/tags/multi-author"
                                        >multi-author (1)</a
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
