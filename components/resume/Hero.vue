<script setup lang="ts">
const store = useResumeStore();

const hero = computed(() => store.hero);
const fullName = computed(() => {
    return `${hero.value.firstName} ${hero.value.lastName}`;
});
</script>

<template>
    <section class="resume-hero">
        <!-- mx-auto max-w-screen-lg px-3 py-28 -->
        <UContainer>
            <div class="flex flex-col items-center md:flex-row md:justify-center md:gap-x-24">
                <div class="clearfix select-none">
                    <p class="text-3xl font-bold">Hi there,</p>
                    <p class="flex items-start font-bold space-x-1">
                        <span class="text-3xl text-gray-400">I'm</span>
                        <span class="text-5xl bg-gradient-to-br from-sky-500 to-cyan-400 bg-clip-text text-transparent">
                            {{ fullName }}
                        </span>
                        👋
                    </p>
                    <p class="capitalize font-semibold tracking-wider text-lg">{{ hero.positionDesired }}</p>
                    <ul class="flex items-center space-x-6 mt-4">
                        <li
                            v-for="src in ['vue-js', 'nuxt-js', 'react-js', 'js', 'typescript', 'git', 'node-js']"
                            :key="src"
                        >
                            <UTooltip :text="src" :popper="{ placement: 'top' }">
                                <NuxtImg :src="`svg/${src}.svg`" width="30" :alt="src" :title="src" />
                            </UTooltip>
                        </li>
                    </ul>
                    <ul class="flex items-center space-x-6 mt-4">
                        <li v-for="src in ['bootstrap', 'tailwindcss']" :key="src">
                            <UTooltip :text="src" :popper="{ placement: 'top' }">
                                <NuxtImg :src="`svg/${src}.svg`" width="30" :alt="src" :title="src" />
                            </UTooltip>
                        </li>
                    </ul>
                    <p class="mt-10">
                        <UButton color="pink" variant="solid" label="get in touch" to="/contact" />
                        <!-- <NuxtLink to="/contact" class="btn btn-primary uppercase !px-10 !font-bold tracking-widest">
                            get in touch
                        </NuxtLink> -->
                    </p>
                </div>

                <div class="shrink-0 hidden md:block">
                    <NuxtImg
                        class="h-80 w-64 select-none pointer-events-none"
                        src="avatar-thumb.svg"
                        alt="Avatar image"
                        loading="lazy"
                    />
                </div>
            </div>
        </UContainer>
    </section>
</template>
