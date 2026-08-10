<template>
  <div class="wrapper-app">
    <NuxtLoadingIndicator :height="3" color="repeating-linear-gradient(to right, #fb923c 0%, #f97316 50%, #fb923c 100%)" />
    <div class="flex flex-col min-h-screen">
      <ThemeHeader />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <ThemeFooter />
    </div>
  </div>
</template>
<script setup lang="ts"></script>

