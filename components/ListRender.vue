<script setup lang="ts">
const props = defineProps<{
    status: 'idle' | 'pending' | 'success' | 'error';
    data: Record<string, any>[];
    message?: string;
}>();
</script>

<template>
    <div class="list-render">
        <template v-if="props.status === 'pending'">
            <p>loading ...</p>
        </template>
        <template v-else>
            <ul v-if="props.data.length" class="list">
                <slot></slot>
            </ul>
            <div v-else class="no-data">
                <p>No data</p>
            </div>
        </template>
    </div>
</template>
