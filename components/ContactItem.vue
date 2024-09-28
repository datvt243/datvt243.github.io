<script setup lang="ts">
const props = defineProps<{
    title: string;
    content: string;
}>();
</script>
<template>
    <div class="flex items-start">
        <div class="shrink-0 relative">
            <div class="absolute inline-block rounded-md bg-sky-200 p-4 text-primary w-10 h-10">
                <!-- <slot name="icon"></slot> -->
            </div>
        </div>
        <div class="grow z-10 ml-5 mt-2">
            <p class="text-xl font-bold">{{ title }}</p>
            <p class="">{{ content }}</p>
        </div>
    </div>
</template>
