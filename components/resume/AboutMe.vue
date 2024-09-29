<script setup lang="ts">
const store = useResumeStore();
const hero = computed(() => store.hero);
const social = computed(() => store.social);
</script>

<template>
    <section class="section-about-me bg-opacity-5 bg-yellow-500">
        <div class="container-block">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="col-left">
                    <BaseHeading text="About me" size="text-8xl" />
                    <p class="mb-4">
                        <button class="btn btn-primary uppercase w-auto">Download my CV</button>
                    </p>
                    <ul v-if="social" class="flex gap-1 space-x-5">
                        <li v-for="[name, link] in Object.entries(social)" :key="name">
                            <a :href="link" target="_blank" class="text-pink capitalize flex items-center space-x-1">
                                <!-- <GithubIcon v-if="name === 'github'" size="1.2x" />
                                <LinkedinIcon v-if="name === 'linkedin'" size="1.2x" />
                                <GlobeIcon v-if="name === 'website'" size="1.2x" /> -->
                                <span>
                                    {{ name }}
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="col-right">
                    {{ removeHtmlTags(hero.introduction) }}
                </div>
            </div>
        </div>
    </section>
</template>
