import type { ResumeAPIResponse, GeneralInformation } from '@/types';

export default defineCachedEventHandler(
    async (event) => {
        /* const query = getQuery(event);
        console.log({ query }); */

        const { nodeAPI, myEmail } = useAppConfig();

        const { success = false, data = {} } = await $fetch<ResumeAPIResponse>(`${nodeAPI}/api/me/${myEmail}`);

        if (data) {
            data.generalInformation = ((generalInformation: GeneralInformation[]) => {
                if (!generalInformation.length) return {};
                return generalInformation[0];
            })(data?.generalInformation || []);
        }

        return {
            success,
            resume: data,
        };
    },
    {
        name: 'api-resume',
        getKey() {
            const { myEmail } = useAppConfig();
            return `api-resume-${myEmail}`;
        },
        maxAge: 60 * 60 * 24 * 12,
    },
);
