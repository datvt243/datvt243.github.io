<script setup lang="ts">
import type { Information } from '@/types/index';

const props = defineProps<{
    modelValue: Information;
}>();

const fullName = computed(() => {
    return `${props.modelValue.firstName} ${props.modelValue.lastName}`;
});
</script>

<template>
    <div class="resume-information mb-8">
        <div class="flex gap-8 items-center">
            <!-- <NuxtImg src="Avatar.png" width="250" /> -->
            <div class="clearfix">
                <h1 class="text-3xl font-bold underline uppercase">Hello world!</h1>
                <p>Resume Information</p>
                <p class="full-name">{{ fullName }}</p>
            </div>
        </div>
    </div>
</template>
