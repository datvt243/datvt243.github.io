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
  <section class="mb-0">
    <div
      id="map"
      class="relative h-[300px] overflow-hidden bg-cover bg-[50%] bg-no-repeat grayscale bg-gray-700 pointer-events-none"
    >
      <iframe
        :src="contact.google_map"
        width="100%"
        height="450"
        style="border: 0"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />
    </div>
    <div class="mx-auto max-w-screen-lg px-3">
      <div class="block rounded-lg px-6 py-12 md:py-16 md:px-12 -mt-[100px] backdrop-blur-[30px]">
        <p class="text-4xl font-bold mb-8 uppercase tracking-widest">Get in touch</p>
        <hr class="mb-8 border-pink-500" />
        <div class="grid gap-6 sm:grid-cols-3">
          <div class="rounded-lg border border-white/10 bg-white/5 p-6">
            <ContactItem title="Phone/Zalo" :content="contact.phone" type="phone">
              <template #icon><UIcon name="fe:phone" class="w-6 h-6" /></template>
            </ContactItem>
          </div>
          <div class="rounded-lg border border-white/10 bg-white/5 p-6">
            <ContactItem title="Email" :content="contact.email" type="email">
              <template #icon><UIcon name="fe:mail" class="w-6 h-6" /></template>
            </ContactItem>
          </div>
          <div class="rounded-lg border border-white/10 bg-white/5 p-6">
            <ContactItem title="Address" :content="contact.address">
              <template #icon><UIcon name="fe:location" class="w-6 h-6" /></template>
            </ContactItem>
          </div>
        </div>

        <div class="mt-10 rounded-lg border border-white/10 bg-white/5 p-6">
          <p class="text-sm font-bold uppercase tracking-widest text-pink-500 mb-4">Connect</p>
          <ul class="flex items-center gap-4">
            <li v-for="[name, link] in Object.entries(contact.social)" :key="name">
              <a :href="link" target="_blank" class="flex items-center justify-center w-11 h-11 rounded-lg border border-white/10 bg-white/5 transition-colors hover:border-pink-500/50 hover:bg-white/10">
                <UIcon :name="`grommet-icons:${name.toLowerCase() === 'website' ? 'globe' : name}`" class="w-5 h-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
