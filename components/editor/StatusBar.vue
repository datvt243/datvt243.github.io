<script setup lang="ts">
/**
 * Editor-style bottom status bar: replaces components/template/Footer.vue.
 * Visual reference: alexdeploy/developer-portfolio-v2 (tab-bar theme).
 */

const currentYear = new Date().getFullYear()
const socialMedia = [
  { name: 'github', icon: 'grommet-icons:github', link: 'https://github.com/datvt243' },
  { name: 'linkedin', icon: 'grommet-icons:linkedin', link: 'https://www.linkedin.com/in/datvt243/' },
]
</script>

<template>
  <footer class="border-t-2 border-orange-400 bg-slate-900 font-jetbrains text-xs text-slate-400">
    <UContainer>
      <div class="py-2.5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="hidden sm:inline">find me in:</span>
          <a
            v-for="social in socialMedia"
            :key="social.name"
            :href="social.link"
            target="_blank"
            class="hover:text-white transition-colors"
            :aria-label="social.name"
          >
            <UIcon :name="social.icon" class="w-4 h-4" />
          </a>
          <span class="hidden md:inline text-slate-600">&middot;</span>
          <span class="hidden md:inline">&copy; {{ currentYear }} datvt243</span>
        </div>
        <a href="https://github.com/datvt243" target="_blank" class="flex items-center gap-1.5 hover:text-white transition-colors">
          <span>@datvt243</span>
          <UIcon name="grommet-icons:github" class="w-4 h-4" />
        </a>
      </div>
    </UContainer>
  </footer>
</template>
