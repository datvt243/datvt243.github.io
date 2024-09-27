<script setup lang="ts">
const menu = [
    {
        page: 'Resume',
        link: '/',
    },
    {
        page: 'Blogs',
        link: '/blogs',
    },
    {
        page: 'Contact',
        link: '/contact',
    },
    {
        page: 'Static',
        link: '/static',
    },
    {
        page: 'SSR',
        link: '/ssr',
    },
    {
        page: 'SSR false',
        link: '/ssr-false',
    },
    {
        page: 'SWR',
        link: '/swr',
    },
    {
        page: 'SWR 3000',
        link: '/swr-3000',
    },
    {
        page: 'ISR',
        link: '/isr',
    },
    {
        page: 'ISR 3000',
        link: '/isr-3000',
    },
];
</script>

<template>
    <header>
        <div class="container">
            <nav class="bg-slate-900 border-gray-200 rounded-lg px-4 my-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <NuxtLink to="/" class="flex items-center">
                        <span class="text-white self-center text-xl font-semibold whitespace-nowrap">
                            Hello World
                        </span>
                    </NuxtLink>
                    <div class="col-right flex items-center justify-end">
                        <div class="flex items-center lg:order-2">
                            <a
                                href="#"
                                class="text-white hover:bg-blue-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 bg-blue-600"
                                >Log in</a
                            >

                            <button
                                data-collapse-toggle="mobile-menu-2"
                                type="button"
                                class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                aria-controls="mobile-menu-2"
                                aria-expanded="false"
                            >
                                <span class="sr-only">Open main menu</span>
                                <svg
                                    class="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                                <svg
                                    class="hidden w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                        <div
                            class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1 mr-4"
                            id="mobile-menu-2"
                        >
                            <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                                <li v-for="(route, index) in menu" :key="`route-${index}`">
                                    <NuxtLink
                                        :to="route.link"
                                        class="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                                    >
                                        <span>{{ route.page }}</span>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </header>
</template>
