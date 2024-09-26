import type { ResumeAPIResponse } from '@/types';

export default defineEventHandler(async (event) => {
    const { API_RESUME, MY_EMAIL } = useAppConfig();
    const { success = false, data = null } = await $fetch<ResumeAPIResponse>(`${API_RESUME}/api/me/${MY_EMAIL}`);

    return {
        success,
        resume: data,
    };
});
