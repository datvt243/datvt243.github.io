<script setup lang="ts">
definePageMeta({
    layout: 'default',
});

const { contact } = useAppConfig();
const getDesc = computed(() => {
    return `Get in touch with me at ${contact.email}. I would love to hear from you! Reach us at ${contact.phone} and ${contact.address}.`;
});

useSeoMeta({
    title: 'Contact me',
    ogTitle: 'Contact me',
    description: getDesc.value,
    ogDescription: getDesc.value,
});
</script>

<template>
    <section class="mb-0">
        <div id="map" class="relative h-[300px] overflow-hidden bg-cover bg-[50%] bg-no-repeat grayscale bg-gray-700">
            <iframe
                :src="contact.google_map"
                width="100%"
                height="450"
                style="border: 0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
        <div class="container px-6 md:px-12">
            <div
                class="block rounded-lg bg-white dark:bg-black px-6 py-12 md:py-16 md:px-12 -mt-[100px] backdrop-blur-[30px]"
            >
                <p class="text-4xl mb-8 uppercase">Get in touch</p>
                <hr class="mb-8" />
                <div class="grid grid-rows-2 grid-flow-col gap-6">
                    <div class="">
                        <ContactItem title="Phone/Zalo" :content="contact.phone">
                            <template #icon><IconsEmail /></template>
                        </ContactItem>
                    </div>
                    <div class="">
                        <ContactItem title="Email" :content="contact.email"
                            ><template #icon><IconsEmail /></template
                        ></ContactItem>
                    </div>
                    <div class="">
                        <ContactItem title="Address" :content="contact.address"
                            ><template #icon><IconsEmail /></template
                        ></ContactItem>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped></style>
