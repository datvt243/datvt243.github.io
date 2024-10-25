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
			></iframe>
		</div>
		<div class="mx-auto max-w-screen-lg px-3">
			<div class="block rounded-lg px-6 py-12 md:py-16 md:px-12 -mt-[100px] backdrop-blur-[30px]">
				<p class="text-4xl font-bold mb-8 uppercase tracking-widest">Get in touch</p>
				<hr class="mb-8 border-pink-500" />
				<div class="block items-center gap-6 space-y-8">
					<div class="w-full">
						<ContactItem title="Phone/Zalo" :content="contact.phone" type="phone">
							<template #icon><IconsEmail /></template>
						</ContactItem>
					</div>
					<div class="w-full">
						<ContactItem title="Email" :content="contact.email" type="email">
							<template #icon><IconsEmail /></template>
						</ContactItem>
					</div>
					<div class="w-full">
						<ContactItem title="Address" :content="contact.address">
							<template #icon><IconsEmail /></template>
						</ContactItem>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
