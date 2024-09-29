import type { Resume, SocialMedia, Education, Experience } from '@/types';

export const useResumeStore = defineStore('resume', {
    state: () => ({
        resume: {} as Resume,
    }),
    actions: {
        async fetchData(): Promise<Resume> {
            const { success, resume } = await $fetch<{ success: boolean; resume: Resume }>('/api/resume');
            const _data = resume ? resume : ({} as Resume);
            this.resume = _data;
            return _data;
        },
    },
    getters: {
        hero({ resume = {} }) {
            const { firstName = '', lastName = '', introduction = '' } = resume;
            return {
                firstName,
                lastName,
                introduction,
            };
        },
        contact({ resume }) {
            const { phone, email, address } = resume;
            return { phone, email, address };
        },
        generalInformation({ resume: { generalInformation } }) {
            return Array.isArray(generalInformation) ? generalInformation?.[0] || {} : generalInformation;
        },
        social({ resume: { socialMedia } }): SocialMedia | Record<string, never> {
            return socialMedia;
        },
        experiences({ resume: { experiences } }): Experience[] {
            return experiences;
        },
        educations({ resume: { educations } }): Education[] {
            return educations;
        },
    },
});

/* export const useResumeStore = defineStore('resume', async () => {
    const resume = ref<Resume>({} as Resume);

    async function fetchData() {
        const _result = await $fetch<Resume>('/api/resume');
        const _data = _result ? _result : ({} as Resume);
        resume.value = _data;
        return _data;
    }

    const hero = computed(() => {
        const { firstName, lastName, introduction } = resume.value;
        return {
            firstName,
            lastName,
            introduction,
        };
    });
    const educations = computed(() => resume.value.educations || []);
    const experiences = computed(() => resume.value.experiences || []);

    return {
        resume,
        fetchData,

        hero,
        educations,
        experiences,
    };
}); */
