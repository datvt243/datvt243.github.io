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

const { data } = await useFetch<APIFormatResponse<Post>>(
    `/api/blogs/detail/${id}`,
    /* {
        params: { id: id},
        watch: [id]
    } */
);

/* const { data, status, error } = await useAsyncFetchncData<APIFormatResponse<Post>>(
    `post-detail-${id}`,
    () => $fetch(`/api/blogs/detail/${id}`),
    
   
); */
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
