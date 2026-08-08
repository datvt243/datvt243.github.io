<template>
  <div class="wrapper-app">
    <NuxtLoadingIndicator :height="10" />
    <div class="flex flex-col min-h-screen">
      <EditorTabBar />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <EditorStatusBar />
    </div>
  </div>
</template>
<script setup lang="ts"></script>

