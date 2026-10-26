<script setup lang="ts">
/**
 * Editor-style bottom status bar (tab-bar look).
 * Visual reference: alexdeploy/developer-portfolio-v2 (tab-bar theme).
 * Links get a 24px box around their 16px icons (WCAG 2.5.8 target size);
 * the row's padding shrinks by the same amount so the bar keeps its height.
 */

const { t } = useI18n()
const currentYear = new Date().getFullYear()
const socialMedia = [
  { name: 'github', icon: 'grommet-icons:github', link: 'https://github.com/datvt243' },
  { name: 'linkedin', icon: 'grommet-icons:linkedin', link: 'https://www.linkedin.com/in/datvt243/' },
]
</script>

<template>
  <footer class="border-t-2 border-theme-accent bg-theme-panel font-theme-mono text-xs text-theme-muted">
    <UContainer class="py-0 md:py-0 lg:py-0">
      <div class="py-2 flex items-center justify-between">
        <div class="flex items-center gap-1">
          <span class="hidden sm:inline mr-2">{{ t('footer.findMeIn') }}</span>
          <a
            v-for="social in socialMedia"
            :key="social.name"
            :href="social.link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex size-6 items-center justify-center hover:text-theme-text transition-colors"
            :aria-label="social.name"
          >
            <UIcon :name="social.icon" class="w-4 h-4" />
          </a>
          <span class="hidden md:inline mx-2 text-theme-faint">&middot;</span>
          <span class="hidden md:inline">&copy; {{ currentYear }} datvt243</span>
        </div>
        <a href="https://github.com/datvt243" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 py-1 hover:text-theme-text transition-colors">
          <span>@datvt243</span>
          <UIcon name="grommet-icons:github" class="w-4 h-4" />
        </a>
      </div>
    </UContainer>
  </footer>
</template>
