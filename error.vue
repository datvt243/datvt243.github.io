<script setup lang="ts">
import type { NuxtError } from '#app';

definePageMeta({
    layout: 'error',
});

const props = defineProps<{
    error: NuxtError;
}>();

function handleError() {
    clearError({
        redirect: '/',
    });
}
</script>

<template>
    <NuxtLayout name="error">
        <!-- component -->
        <div
            class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16"
        >
            <div class="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
                <div class="relative">
                    <div class="status-code text-8xl font-bold">
                        <span>{{ props.error.statusCode }}</span>
                    </div>
                    <div class="clearfix">
                        <div class="">
                            <h1 class="my-2 text-gray-800 font-bold text-2xl">
                                Looks like you've found the doorway to the great nothing
                            </h1>
                            <p class="my-2 text-gray-800">
                                Sorry about that! Please visit our Homepage to get where you need to go.
                            </p>
                            <button
                                class="sm:w-full lg:w-auto my-2 border rounded md py-3 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
                                @click="handleError"
                            >
                                Take me there!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <NuxtImg src="error.png" />
            </div>
        </div>
        <!-- <div class="error-page w-[400px] mx-auto">
            <h2 class="text-8xl">{{ props.error.statusCode }}</h2>
            <p>Something wrong here</p>
            <button
                class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                @click="handleError"
            >
                Clear errors
            </button>
        </div> -->
    </NuxtLayout>
</template>
