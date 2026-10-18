<script setup lang="ts">
/**
 * Keyboard-shortcut badge, the single style for every shortcut hint. Uses
 * --theme-kbd rather than --theme-accent because editor-dracula.css repaints
 * accent purple inside <ThemePanel>, which would split the badge colors.
 *
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */
</script>

<template>
  <kbd class="rounded border border-theme-border font-theme-mono text-theme-kbd"><slot /></kbd>
</template>
