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

      <p class="text-xs text-slate-500 font-jetbrains mb-3"># reach out - no backend wired up yet, ping me directly :)</p>
      <pre class="font-jetbrains text-sm leading-relaxed overflow-x-auto"><code><span class="text-blue-400">const</span> <span class="text-white">contact</span> <span class="text-slate-500">=</span> <span class="text-slate-500">{</span>
  <span class="text-slate-300">phone</span><span class="text-slate-500">:</span> <span class="text-orange-300">'{{ contact.phone }}'</span><span class="text-slate-500">,</span>
  <span class="text-slate-300">email</span><span class="text-slate-500">:</span> <span class="text-orange-300">'{{ contact.email }}'</span><span class="text-slate-500">,</span>
  <span class="text-slate-300">address</span><span class="text-slate-500">:</span> <span class="text-orange-300">'{{ contact.address }}'</span><span class="text-slate-500">,</span>
<span class="text-slate-500">}</span>

<span class="text-blue-400">function</span> <span class="text-white">reachOut</span><span class="text-slate-500">()</span> <span class="text-slate-500">{</span>
  <span class="text-slate-500">return</span> <span class="text-slate-300">`Hey </span><span class="text-orange-300">${</span><span class="text-slate-300">contact.email</span><span class="text-orange-300">}</span><span class="text-slate-300">, let's talk!`</span>
<span class="text-slate-500">}</span></code></pre>
    </EditorPanel>
  </UContainer>
</template>
