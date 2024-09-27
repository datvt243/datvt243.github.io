<script setup lang="ts">
const { data } = useFetch('/api/get-current-time');
</script>

<template>
    <div class="container">
        <BaseHeading text="Page SWR" />
        <p>
            {{ data }}
        </p>
        <hr class="my-8" />
        <ClientOnly>
            <p>client only: {{ +new Date() }}</p>
        </ClientOnly>
    </div>
</template>
