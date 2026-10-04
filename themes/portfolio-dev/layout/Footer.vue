<script setup lang="ts">
/**
 * Editor-style bottom status bar (tab-bar look).
 * Visual reference: alexdeploy/developer-portfolio-v2 (tab-bar theme).
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
    <UContainer :ui="{ constrained: 'mx-auto max-w-screen-lg px-3 py-0 md:py-0 lg:py-0' }">
      <div class="py-2.5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="hidden sm:inline">{{ t('footer.findMeIn') }}</span>
          <a
            v-for="social in socialMedia"
            :key="social.name"
            :href="social.link"
            target="_blank"
            class="hover:text-theme-text transition-colors"
            :aria-label="social.name"
          >
            <UIcon :name="social.icon" class="w-4 h-4" />
          </a>
          <span class="hidden md:inline text-theme-faint">&middot;</span>
          <span class="hidden md:inline">&copy; {{ currentYear }} datvt243</span>
        </div>
        <a href="https://github.com/datvt243" target="_blank" class="flex items-center gap-1.5 hover:text-theme-text transition-colors">
          <span>@datvt243</span>
          <UIcon name="grommet-icons:github" class="w-4 h-4" />
        </a>
      </div>
    </UContainer>
  </footer>
</template>
