<script setup lang="ts">
/**
 * Keyboard-shortcut badge, the single style for every shortcut hint. Uses
 * --theme-kbd rather than --theme-accent because editor-dracula.css repaints
 * accent purple inside <ThemePanel>, which would split the badge colors.
 * Inline hints (the aria-hidden ones) disappear on touch screens, where
 * there's no keyboard to press them; the help overlay keeps its keys.
 *
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */
</script>

<template>
  <kbd class="rounded-sm border border-theme-border font-theme-mono text-theme-kbd [@media(hover:none)]:aria-hidden:hidden"><slot /></kbd>
</template>
