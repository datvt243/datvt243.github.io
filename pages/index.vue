<script setup lang="ts">
import type { Resume } from '@/types/resume-document';

const resumeStore = useResumeStore();

definePageMeta({
    layout: 'default',
});

const { data, error } = await useAsyncData<Resume>(`api-resume`, async () => await resumeStore.fetchData());

/* const { data, error } = await useFetch<{ success: boolean; resume: Resume }>(`/api/resume`); */

/* useSeoMeta({
    title: `Resume ${data.value?.firstName} ${data.value?.lastName}`,
    ogTitle: `Resume ${data.value?.firstName} ${data.value?.lastName}`,
    description: data.value?.introduction,
    ogDescription: data.value?.introduction,
    ogImage: '',
    twitterCard: 'summary_large_image',
}); */

const isValid = computed(() => !!data && Object.keys(data).length);
</script>

<template>
    <div class="container mx-auto">
        <Head>
            <Title>Võ Tấn CV</Title>
        </Head>

        <template v-if="!error">
            <Resume v-if="isValid && data" :model-value="data" />
        </template>
        <template v-else>
            {{ error }}
        </template>
    </div>
</template>

<style scoped></style>
