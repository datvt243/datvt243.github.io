<script setup lang="ts">
import type { Resume } from '@/types/resume-document';

definePageMeta({
    layout: 'default',
});

/* const { SERVICE_RESUME } = useRuntimeConfig(); */

/* const { data, error } = await useAsyncData<Resume>('users', async () => {
    const { success = false, resume } = await $fetch<{ success: boolean; resume: Record<string, any> }>(`/api/resume`);
    return resume as Resume;
}); */

const { data, error } = await useFetch<{ success: boolean; resume: Resume }>(`/api/resume`);

/* useSeoMeta({
    title: `Resume ${data.value?.firstName} ${data.value?.lastName}`,
    ogTitle: `Resume ${data.value?.firstName} ${data.value?.lastName}`,
    description: data.value?.introduction,
    ogDescription: data.value?.introduction,
    ogImage: '',
    twitterCard: 'summary_large_image',
}); */
</script>

<template>
    <div class="container mx-auto">
        <Head>
            <Title>Võ Tấn CV</Title>
        </Head>
        <template v-if="!error">
            <Resume v-if="data" :model-value="data.resume" />
        </template>
        <template v-else>
            {{ error }}
        </template>
    </div>
</template>

<style scoped></style>
