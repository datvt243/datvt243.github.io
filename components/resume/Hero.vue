<script setup lang="ts">
import type { Information, SocialMedia } from '@/types/index';

const store = useResumeStore();

const hero = computed(() => store.hero);
const social = computed(() => store.social);
</script>

<template>
    <div class="mx-auto max-w-screen-lg px-3 py-28">
        <div class="flex flex-col items-center md:flex-row md:justify-between md:gap-x-24">
            <div>
                <p class="text-3xl font-bold">
                    Hi there, I'm
                    <span class="bg-gradient-to-br from-sky-500 to-cyan-400 bg-clip-text text-transparent">
                        {{ hero.firstName }} {{ hero.lastName }}
                    </span>
                    👋
                </p>
                <p class="mt-6 text-xl leading-9">
                    {{ removeHtmlTags(hero.introduction) }}
                </p>
                <ul class="mt-6 flex gap-1 space-x-5">
                    <li v-for="[name, link] in Object.entries(social)" :key="name">
                        <a :href="link" target="_blank" class="text-pink capitalize flex items-center space-x-1">
                            <GithubIcon v-if="name === 'github'" size="1.2x" />
                            <LinkedinIcon v-if="name === 'linkedin'" size="1.2x" />
                            <GlobeIcon v-if="name === 'website'" size="1.2x" />
                            <span>
                                {{ name }}
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="shrink-0">
                <NuxtImg class="h-80 w-64" src="avatar-thumb.svg" alt="Avatar image" loading="lazy" />
            </div>
        </div>
    </div>
</template>
