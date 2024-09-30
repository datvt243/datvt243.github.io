import type { APIFormatResponse, Post } from '@/types';

export default defineCachedEventHandler(
    async (event) => {
        const id = getRouterParam(event, 'id');

        if (!id)
            return {
                status: false,
                data: null,
                errors: [],
                message: 'Missing ID',
            };

        const {
            status = false,
            data = null,
            errors = [],
            message = '',
        } = await $fetch<APIFormatResponse<Post>>(
            `https://blog-api-nodejs-express.onrender.com/api/v1/post/detail/${id}`,
        );

        return {
            status,
            data,
            errors,
            message,
        };
    },
    {
        base: 'PostDetail',
        name: 'api-resume',
        getKey(event) {
            const id = getRouterParam(event, 'id');
            return `api-post-${id}`;
        },
        maxAge: 60 * 60 * 24 * 12,
    },
);
