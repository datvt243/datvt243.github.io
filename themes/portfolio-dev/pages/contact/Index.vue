<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const { contact } = useAppConfig()

const form = reactive({ name: '', email: '', message: '' })

function submitMessage() {
  const subject = `Portfolio contact from ${form.name || 'someone'}`
  const body = `${form.message}\n\n— ${form.name} (${form.email})`
  window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
</script>

<template>
  <UContainer>
    <ThemePanel>
      <template #sidebar>
        <p class="text-xs uppercase tracking-widest text-theme-faint mb-3 font-theme-mono">contacts</p>
        <ul class="space-y-3 font-theme-mono text-sm mb-6">
          <li class="flex items-center gap-2 text-theme-text-soft">
            <UIcon name="fe:phone" class="w-4 h-4 opacity-50 shrink-0" />
            <a :href="`tel:${contact.phone}`" class="hover:text-theme-accent transition-colors">{{ contact.phone }}</a>
          </li>
          <li class="flex items-center gap-2 text-theme-text-soft">
            <UIcon name="fe:mail" class="w-4 h-4 opacity-50 shrink-0" />
            <a :href="`mailto:${contact.email}`" class="hover:text-theme-accent transition-colors">{{ contact.email }}</a>
          </li>
          <li class="flex items-center gap-2 text-theme-text-soft">
            <UIcon name="fe:location" class="w-4 h-4 opacity-50 shrink-0" />
            <span>{{ contact.address }}</span>
          </li>
        </ul>

        <p class="text-xs uppercase tracking-widest text-theme-faint mb-3 font-theme-mono">find-me-also-in</p>
        <ul class="space-y-1 font-theme-mono text-sm">
          <li v-for="[name, link] in Object.entries(contact.social)" :key="name">
            <a
              :href="link"
              target="_blank"
              class="flex items-center gap-2 px-2 py-1.5 rounded text-theme-muted hover:text-theme-text-strong hover:bg-theme-panel-subtle/50 transition-colors"
            >
              <UIcon :name="`grommet-icons:${name.toLowerCase() === 'website' ? 'globe' : name}`" class="w-4 h-4" />
              <span class="capitalize">{{ name }}</span>
            </a>
          </li>
        </ul>
      </template>

      <p class="text-xs text-theme-faint font-theme-mono mb-4"># fills your mail client - no server involved :)</p>
      <form class="space-y-4 font-theme-mono max-w-lg" @submit.prevent="submitMessage">
        <div>
          <label for="contact-name" class="block text-sm text-theme-muted mb-1.5">_name:</label>
          <input
            id="contact-name"
            v-model="form.name"
            type="text"
            placeholder="Your name"
            required
            class="w-full rounded bg-theme-panel-subtle/50 border border-theme-border-subtle px-3 py-2 text-sm text-theme-text placeholder:text-theme-faint focus:border-theme-accent/50 focus:outline-none"
          />
        </div>
        <div>
          <label for="contact-email" class="block text-sm text-theme-muted mb-1.5">_email:</label>
          <input
            id="contact-email"
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            required
            class="w-full rounded bg-theme-panel-subtle/50 border border-theme-border-subtle px-3 py-2 text-sm text-theme-text placeholder:text-theme-faint focus:border-theme-accent/50 focus:outline-none"
          />
        </div>
        <div>
          <label for="contact-message" class="block text-sm text-theme-muted mb-1.5">_message:</label>
          <textarea
            id="contact-message"
            v-model="form.message"
            rows="5"
            placeholder="What's on your mind?"
            required
            class="w-full rounded bg-theme-panel-subtle/50 border border-theme-border-subtle px-3 py-2 text-sm text-theme-text placeholder:text-theme-faint focus:border-theme-accent/50 focus:outline-none resize-y"
          />
        </div>
        <button
          type="submit"
          class="inline-flex items-center gap-2 rounded bg-theme-accent px-4 py-2 text-sm font-semibold text-theme-accent-contrast hover:bg-theme-accent-soft transition-colors font-theme-mono"
        >
          submit-message
          <UIcon name="fe:paper-plane" class="w-4 h-4" />
        </button>
      </form>
    </ThemePanel>
  </UContainer>
</template>
