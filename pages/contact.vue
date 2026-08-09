<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

definePageMeta({
  layout: 'default',
})

const { contact } = useAppConfig()
const getDesc = computed(() => {
  return `Get in touch with me at ${contact.email}. I would love to hear from you! Reach us at ${contact.phone} and ${contact.address}.`
})

useSeoMeta({
  title: 'Contact me',
  ogTitle: 'Contact me',
  description: getDesc.value,
  ogDescription: getDesc.value,
})

const form = reactive({ name: '', email: '', message: '' })

function submitMessage() {
  const subject = `Portfolio contact from ${form.name || 'someone'}`
  const body = `${form.message}\n\n— ${form.name} (${form.email})`
  window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
</script>

<template>
  <UContainer>
    <EditorPanel>
      <template #sidebar>
        <p class="text-xs uppercase tracking-widest text-slate-500 mb-3 font-jetbrains">contacts</p>
        <ul class="space-y-3 font-jetbrains text-sm mb-6">
          <li class="flex items-center gap-2 text-slate-300">
            <UIcon name="fe:phone" class="w-4 h-4 opacity-50 shrink-0" />
            <a :href="`tel:${contact.phone}`" class="hover:text-orange-400 transition-colors">{{ contact.phone }}</a>
          </li>
          <li class="flex items-center gap-2 text-slate-300">
            <UIcon name="fe:mail" class="w-4 h-4 opacity-50 shrink-0" />
            <a :href="`mailto:${contact.email}`" class="hover:text-orange-400 transition-colors">{{ contact.email }}</a>
          </li>
          <li class="flex items-center gap-2 text-slate-300">
            <UIcon name="fe:location" class="w-4 h-4 opacity-50 shrink-0" />
            <span>{{ contact.address }}</span>
          </li>
        </ul>

        <p class="text-xs uppercase tracking-widest text-slate-500 mb-3 font-jetbrains">find-me-also-in</p>
        <ul class="space-y-1 font-jetbrains text-sm">
          <li v-for="[name, link] in Object.entries(contact.social)" :key="name">
            <a
              :href="link"
              target="_blank"
              class="flex items-center gap-2 px-2 py-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
            >
              <UIcon :name="`grommet-icons:${name.toLowerCase() === 'website' ? 'globe' : name}`" class="w-4 h-4" />
              <span class="capitalize">{{ name }}</span>
            </a>
          </li>
        </ul>
      </template>

      <p class="text-xs text-slate-500 font-jetbrains mb-4"># fills your mail client - no server involved :)</p>
      <form class="space-y-4 font-jetbrains max-w-lg" @submit.prevent="submitMessage">
        <div>
          <label for="contact-name" class="block text-sm text-slate-400 mb-1.5">_name:</label>
          <input
            id="contact-name"
            v-model="form.name"
            type="text"
            required
            class="w-full rounded bg-slate-800/50 border border-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-orange-400/50 focus:outline-none"
          />
        </div>
        <div>
          <label for="contact-email" class="block text-sm text-slate-400 mb-1.5">_email:</label>
          <input
            id="contact-email"
            v-model="form.email"
            type="email"
            required
            class="w-full rounded bg-slate-800/50 border border-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-orange-400/50 focus:outline-none"
          />
        </div>
        <div>
          <label for="contact-message" class="block text-sm text-slate-400 mb-1.5">_message:</label>
          <textarea
            id="contact-message"
            v-model="form.message"
            rows="5"
            required
            class="w-full rounded bg-slate-800/50 border border-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-orange-400/50 focus:outline-none resize-y"
          />
        </div>
        <UButton type="submit" color="pink" variant="solid" class="font-jetbrains">submit-message</UButton>
      </form>
    </EditorPanel>
  </UContainer>
</template>
