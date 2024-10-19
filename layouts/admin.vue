<script setup lang="ts">
const demo = "nice"
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <TemplateHeader />
    <main class="grow p-0">
      <slot></slot>
    </main>
    <TemplateFooter />
  </div>
</template>
