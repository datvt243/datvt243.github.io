<script setup lang="ts"></script>

<template>
    <div class="flex flex-col min-h-screen">
        <TemplateHeader />
        <main class="grow my-4">
            <slot></slot>
        </main>
        <TemplateFooter />
    </div>
</template>
