import type { APIFormatResponse, Post } from '@/types';

export default defineEventHandler(async (event) => {
    const {
        status = false,
        data = null,
        errors = [],
        message = '',
    } = await $fetch<APIFormatResponse<Post[]>>(`https://blog-api-nodejs-express.onrender.com/api/v1/post/`);

    return {
        status,
        data,
        errors,
        message,
    };
});
