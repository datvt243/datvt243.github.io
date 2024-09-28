import type { Post } from '@/types';
import { cacheGetPosts } from '~/server/utils/cacheGetPost';

export default defineEventHandler(async (event) => {
    const posts: Post[] | [] = await cacheGetPosts();

    return {
        status: true,
        data: posts,
    };
});
