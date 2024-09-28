import type { ResumeAPIResponse } from '@/types';

export default defineCachedEventHandler(
    async (event) => {
        const { API_RESUME, MY_EMAIL } = useAppConfig();
        const { success = false, data = null } = await $fetch<ResumeAPIResponse>(`${API_RESUME}/api/me/${MY_EMAIL}`);

        return {
            success,
            resume: data,
        };
    },
    {
        name: 'api-resume',
        getKey() {
            const { MY_EMAIL } = useAppConfig();
            return `api-resume-${MY_EMAIL}`;
        },
        maxAge: 60 * 60 * 24 * 12,
    },
);
