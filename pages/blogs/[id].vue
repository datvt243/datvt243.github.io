<script setup lang="ts">
import type { APIFormatResponse, Post } from '@/types/index';
const route = useRoute();
const {
    params: { id = '' },
} = route;

console.log({ id });

definePageMeta({
    validate: async (route) => {
        return !!route.params.id;
    },
});

const { data, status, error } = await useAsyncData<APIFormatResponse<Post>>(
    `post-detail-${id}`,
    () => $fetch(`/api/blogs/detail/${id}`),
    {
        /*  default: () => {
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
/* const postDetail = computed<Post>(() => {
    return data;
}); */
</script>

<template>
    <div class="container">
        <pre>{{ data }}</pre>
        <!-- <div v-if="!!postDetail" class="post-detail">
            <pre>{{ postDetail }}</pre>
            <PostContent v-if="postDetail" :model-value="postDetail" />
            
        </div>
        <template v-else>
            <p>NO data</p>
        </template> -->
    </div>
</template>
