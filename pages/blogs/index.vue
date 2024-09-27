<script setup lang="ts">
import type { APIFormatResponse, Post } from '@/types/index';

definePageMeta({
    layout: 'default',
});

const { data, error, status } = useFetch<APIFormatResponse<Post[]>>('/api/blogs/posts');

const blogs = computed(() => data.value?.data || null);
</script>

<template>
    <div class="container">
        <h1 class="text-3xl font-bold underline">Page Blogs</h1>

        <ListRender :status="status" :data="blogs">
            <template #default>
                <li v-for="post in blogs" :key="post._id" class="p-4 my-2 border rounded-lg">
                    <NuxtLink :to="`blogs/${post._id}`">
                        {{ post.title }}
                    </NuxtLink>
                </li>
            </template>
        </ListRender>
    </div>
</template>

<style scoped></style>
