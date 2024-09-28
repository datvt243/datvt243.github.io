<script setup lang="ts">
const props = defineProps<{
    status: 'idle' | 'pending' | 'success' | 'error';
    data: Record<string, any>[] | null;
    message?: string;
}>();

const isLoading = ref(false);
const loadingAfterMillisecond = 1500;
watch(isLoading, () => {
    setTimeout(() => {
        isLoading.value = true;
    }, loadingAfterMillisecond);
});
</script>

<template>
    <div class="list-render">
        <template v-if="props.status === 'pending'">
            <template v-if="$slots.loading">
                <slot v-if="isLoading" name="loading"></slot>
            </template>
            <p v-else class="p-8">loading ...</p>
        </template>
        <template v-else>
            <ul v-if="props.data?.length" class="list">
                <slot></slot>
            </ul>
            <div v-else class="no-data">
                <p>No data</p>
            </div>
        </template>
    </div>
</template>
