<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */
const { AppHeading, contact } = useAppConfig()
</script>

<template>
  <div class="p-4 border border-theme-border rounded-md font-theme-mono">
    <address class="flex items-center m-0 not-italic">
      <div class="flex items-center space-x-2">
        <UAvatar src="/Avatar.png" :alt="AppHeading" size="lg" />

        <div>
          <a :href="contact.social.github" target="_blank" rel="author noopener" class="text-xl font-bold text-theme-text">{{ AppHeading }}</a>
        </div>
      </div>
    </address>
  </div>
</template>
