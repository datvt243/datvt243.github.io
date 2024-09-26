<script setup lang="ts">
const currentYear = new Date().getFullYear();
const socialMedia = [
    {
        name: 'github',
        img: '',
        link: 'https://github.com/datvt243',
    },
    {
        name: 'linkedin',
        img: '',
        link: 'https://www.linkedin.com/in/datvt243/',
    },
];
</script>

<template>
    <footer>
        <div class="container bg-white rounded-lg shadow my-4 dark:bg-gray-800">
            <div class="p-4 md:flex md:items-center md:justify-between">
                <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    &copy; {{ currentYear }}
                    <a href="https://github.com/datvt243" class="hover:underline" target="_blank">datvt243</a>. All
                    Rights Reserved.
                </span>
                <ul
                    class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0"
                >
                    <li v-for="social in socialMedia" :key="social.name">
                        <a :href="social.link" class="hover:underline me-4 md:me-6">
                            <NuxtImg v-if="social.img" :src="social.img" />

                            <span class="capitalize">{{ social.name }}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>
