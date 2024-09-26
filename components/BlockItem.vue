<script setup lang="ts">
import { convertNumberToDate } from '@/utils/index';

const props = defineProps<{
    title: string;
    position: string;
    prefixPosition?: string;
    startDate: number;
    endDate: number;
    isCurrent: boolean;
    description: string;
}>();

const getDate = computed(() => {
    const _s = convertNumberToDate(props.startDate);
    const _e = convertNumberToDate(props.endDate);
    return `${_s} - ${_e}`;
});
const getPosition = computed(() => {
    let _str = '';
    props.prefixPosition && (_str += `${props.prefixPosition}: `);
    return `${_str} ${props.position}`.trim();
});
</script>

<template>
    <div class="block-item pl-4 border-l">
        <div class="heading mb-2 pb-2 border-b">
            <p class="text-2xl tracking-wide font-bold">{{ title }}</p>
            <div class="flex justify-between">
                <p class="position">{{ getPosition }}</p>
                <p class="date text-sm">{{ getDate }}</p>
            </div>
        </div>
        <div class="description" v-html="description"></div>
    </div>
</template>

<style scoped lang="scss">
.description {
    position: relative;

    :deep(> ul, > ol) {
        list-style-type: disc;
        padding-left: 1.5rem;
    }
}
</style>
