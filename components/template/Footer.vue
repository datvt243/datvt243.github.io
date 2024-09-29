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
    <footer class="border-t">
        <div class="mx-auto max-w-screen-lg px-3 py-6">
            <div class="md:flex md:items-center md:justify-between">
                <p class="">
                    &copy; {{ currentYear }}
                    <a href="https://github.com/datvt243" class="hover:underline text-pink" target="_blank">datvt243</a
                    >. All Rights Reserved.
                </p>
                <ul class="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
                    <li v-for="social in socialMedia" :key="social.name">
                        <a
                            :href="social.link"
                            class="hover:underline me-4 md:me-6 text-pink capitalize flex items-center space-x-1"
                        >
                            <GithubIcon size="1.5x" v-if="social.name === 'github'" />
                            <LinkedinIcon size="1.5x" v-else />
                            <span class="capitalize">{{ social.name }}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>
