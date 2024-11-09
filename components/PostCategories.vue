<script setup lang="ts">/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

interface Category {
	_id: string
	name: string
	description: string
	slug: string
	[key: string]: string
}

const { data = [], status } = await useAsyncData<Category[]>(() => $fetch('/api/blogs/categories'))

const query = inject<{ category: Ref<string>, page: Ref<number>, perPage: Ref<number> }>('query');
const category = toRef(query?.category || '')

</script>

<template>
	<div class="px-4 py-4">
		<h3 class="font-bold text-2xl uppercase text-pink-500 mb-4 tracking-widest">
			Categories
		</h3>
		<ul v-if="data?.length" class="list pl-1 space-y-4">
			<li
				class=""
				v-for="cate in data"
				:key="cate._id"
			>
				<NuxtLink
					:to="`/blogs?category=${cate.slug}`"
					aria-label="View posts tagged next-js"
					class="px-3 py-2 text-sm font-medium uppercase hover:text-sky-500 transition-colors tracking-wider"
					:class="[category === cate.slug ? '!text-sky-500' : 'text-pink-500']"
				>
					_ {{ cate.name }}
				</NuxtLink>
			</li>
		</ul>
		<p v-else class="p-2 bg-dark-400 text-center rounded-md">No Data</p>
	</div>
</template>

