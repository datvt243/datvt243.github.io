<script setup lang="ts">
const darkMode = ref(false)
const dropdownOpen = ref(false)
const items = [
	[
		{
			label: 'ben@example.com',
			slot: 'account',
			disabled: true,
		},
	],
	[
		{
			label: 'Settings',
			icon: 'i-heroicons-cog-8-tooth',
		},
	],
	[
		{
			label: 'Documentation',
			icon: 'i-heroicons-book-open',
		},
		{
			label: 'Changelog',
			icon: 'i-heroicons-megaphone',
		},
		{
			label: 'Status',
			icon: 'i-heroicons-signal',
		},
	],
	[
		{
			label: 'Sign out',
			icon: 'i-heroicons-arrow-left-on-rectangle',
		},
	],
]
</script>

<template>
	<header class="sticky top-0 z-999 flex w-full bg-slate-800 drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
		<div class="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
			<div class="flex items-center gap-2 sm:gap-4 lg:hidden">
				<!-- Hamburger Toggle BTN -->

				<!-- Hamburger Toggle BTN -->
			</div>
			<div class="hidden sm:block">
				<UFormGroup>
					<UInput placeholder="search ..." icon="fe:search" />
				</UFormGroup>
			</div>

			<div class="flex items-center gap-5 2xsm:gap-7">
				<ul class="flex items-center gap-2 2xsm:gap-4 space-x-3">
					<li>
						<UToggle v-model="darkMode" />
					</li>
					<li>
						<UChip color="green">
							<UButton icon="fe:bell" color="gray" />
						</UChip>
					</li>
					<li>
						<UChip color="green">
							<UButton icon="fe:commenting" color="gray" />
						</UChip>
					</li>
				</ul>

				<!-- User Area -->
				<div class="relative" x-data="{ dropdownOpen: false }" @click.outside="dropdownOpen = false">
					<a class="flex items-center gap-5" href="#" @click.prevent="dropdownOpen = !dropdownOpen">
						<span class="hidden text-right lg:block">
							<span class="block text-sm font-medium text-black dark:text-white">Thomas Anree</span>
							<span class="block text-xs font-light">UX Designer</span>
						</span>
						<div>
							<UDropdown
								:items="items"
								:ui="{ item: { disabled: 'cursor-text select-text' } }"
								:popper="{ placement: 'bottom-start' }"
							>
								<UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" size="md" />

								<template #account="{ item }">
									<div class="text-left">
										<p>Signed in as</p>
										<p class="truncate font-medium text-gray-900 dark:text-white">
											{{ item.label }}
										</p>
									</div>
								</template>

								<template #item="{ item }">
									<span class="truncate">{{ item.label }}</span>

									<UIcon
										:name="item.icon"
										class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
									/>
								</template>
							</UDropdown>
						</div>
					</a>
				</div>
				<!-- User Area -->
			</div>
		</div>
	</header>
</template>
