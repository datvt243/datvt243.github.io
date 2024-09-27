<script setup lang="ts">
import type { APIFormatResponse, Post } from '@/types/index';

const route = useRoute();
const {
    params: { id = '' },
} = route;

definePageMeta({
    validate: async (route) => {
        return !!route.params.id;
    },
});

const { data, status, error } = await useAsyncData<APIFormatResponse<Post>>(
    `post-detail-${id}`,
    () => $fetch(`/api/blogs/detail/${id}`),
    {
        /* default: () => {
            return {
                _id: '',
                title: '',
                slug: '',
                isPublic: false,
                content: '',
                authorId: '',
                createdAt: '',
                updatedAt: '',
            } as Post;
        }, */
    },
    /* {
        watch: [id],
    }, */
);
const postDetail = computed<Post>(() => {
    return data.value?.data as Post;
});
</script>

<template>
    <div class="container">
        <PostContent :model-value="postDetail" />

        <PostAuthor />

        <PostCommentForm />
    </div>
</template>
