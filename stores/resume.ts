/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { Resume, SocialMedia, Education, Experience, GeneralInformation, ForeignLanguage, Project, ProfessionalSkill } from '@/types'

export const useResumeStore = defineStore('resume', {
  state: () => ({
    resume: {} as Resume,
  }),
  actions: {
    async fetchData(): Promise<Resume> {
      const { success, resume } = await $fetch<{ success: boolean; resume: Resume }>('/api/resume')
      const _data = resume ? resume : ({} as Resume)
      this.resume = _data
      return _data
    },
  },
  getters: {
    generalInformation({ resume: { generalInformation } }): GeneralInformation {
      if (Array.isArray(generalInformation)) return generalInformation[0] || ({} as GeneralInformation)
      return generalInformation || ({} as GeneralInformation)
    },

    hero({ resume = {} }) {
      const { firstName = '', lastName = '', introduction = '', email = '' } = resume
      const { positionDesired = 'A frontend developer' } = this.generalInformation as GeneralInformation
      return {
        firstName,
        lastName,
        email,
        positionDesired,
        introduction,
      }
    },
    contact({ resume }) {
      const { phone, email, address } = resume
      return { phone, email, address }
    },

    social({ resume: { socialMedia } }): SocialMedia | Record<string, never> {
      return socialMedia
    },
    experiences({ resume: { experiences } }): Experience[] {
      return [...experiences].sort((a, b) => b.startDate - a.startDate)
    },
    educations({ resume: { educations } }): Education[] {
      return educations
    },
    projects({ resume: { projects } }): Project[] {
      return projects
    },
    foreignLanguages(): ForeignLanguage[] {
      return (this.generalInformation as GeneralInformation).foreignLanguages || ([] as ForeignLanguage[])
    },
    skills(): ProfessionalSkill[] {
      return (this.generalInformation as GeneralInformation).professionalSkills || []
    },
    groups(): string[] {
      return (this.generalInformation as GeneralInformation).professionalSkillsGroup || []
    },
  },
})

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
