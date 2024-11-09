<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const router = useRoute()
const category = ref(router.query?.category || '');
const page = ref(router.query?.page || 1);
const perPage = ref(router.query?.['per-page'] || 20);

watch(() => router.query, query => {
	category.value = query?.category || '';
	page.value = query?.page || 1;
	perPage.value = query?.['per-page'] || 20;
});

provide('query', {
	category,
	page,
	perPage
})

</script>

<template>
	<main class="grow p-0 layout-blog pt-4">
		<div class="container-block !pt-0">
			<div class="flex sm:space-x-16 md:space-x-20 lg:space-x-24">
				<div class="grow">
					<slot></slot>
				</div>
				<div
					class="hidden lg:block max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-white bg-opacity-5 h-auto mt-6"
				>
					<PostCategories />
				</div>
			</div>
		</div>
	</main>
</template>
