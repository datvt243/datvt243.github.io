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
    return `<span class="text-sm">${_str}</span> <span class="font-bold tracking-widest">${props.position.toUpperCase()}</span>`;
});
</script>

<template>
    <div class="block-item space-y-4">
        <div class="heading">
            <p
                class="heading-title text-xl sm:text-2xl md:text-3xl tracking-wide font-bold text-white capitalize"
                v-html="title"
            ></p>
            <template v-if="$slots.body">
                <slot name="body"></slot>
            </template>
            <div v-else class="block md:flex justify-between">
                <p class="position text-slate-400 text-sm md:text-lg" v-html="getPosition"></p>
                <p class="text-sm font-italic tracking-widest">
                    <span class="flex items-center space-x-2 px-4 py-1 date md:bg-pink text-white leading-normal">
                        <UIcon name="fe:clock" class="w-5 h-5" />
                        <span>{{ getDate }}</span>
                    </span>
                </p>
            </div>
        </div>
        <div class="description" v-html="description"></div>
    </div>
</template>

<style scoped lang="scss">
.description {
    position: relative;

    :deep(> *) {
        margin-bottom: 1rem;
    }

    :deep(> ul, > ol) {
        list-style-type: disc;
        padding-left: 1.5rem;

        ul,
        ol {
            list-style-type: disc;
            padding-left: 1.5rem;
        }
    }
}

.block-item {
    position: relative;
    padding-left: 1.5rem;

    &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 0.5rem;
        height: 100%;
        background: #fff;
        opacity: 0.1;
        border-radius: 1rem;
    }
}
</style>
