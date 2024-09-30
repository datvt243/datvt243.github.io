<script setup lang="ts">
import type { ForeignLanguage } from '@/types/index';

const store = useResumeStore();
const languages = computed<ForeignLanguage[]>(() => store.foreignLanguages);
</script>

<template>
    <section class="section-educations bg-opacity-5 bg-sky-700">
        <UContainer>
            <BaseHeading text="Ngoại ngữ" />
            <ul class="list">
                <li v-for="(el, index) in languages" :key="el.language || index">
                    <BlockItem
                        :title="el.language"
                        position=""
                        :start-date="0"
                        :end-date="0"
                        description=""
                        :is-current="false"
                    >
                        <template #body>
                            <p class="position text-slate-400 text-lg capitalize" v-html="el.level"></p>
                        </template>
                    </BlockItem>
                </li>
            </ul>
        </UContainer>
    </section>
</template>

<style scoped>
:deep(.heading-title) {
    text-transform: uppercase;
}
</style>
