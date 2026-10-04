/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import type { Resume, GeneralInformation } from '@/types'
import type { EducationModel, ExperienceModel, HeroModel, LanguageModel, ProjectModel, SkillModel, SocialMediaModel } from '@/models'
import { resumeAdapter } from '@/utils/ResumeAdapter'

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

    hero({ resume = {} }): HeroModel {
      return resumeAdapter.toHero(resume, this.generalInformation as GeneralInformation)
    },

    social({ resume: { socialMedia } }): SocialMediaModel {
      return resumeAdapter.toSocialMedia(socialMedia || {})
    },
    experiences({ resume: { experiences } }): ExperienceModel[] {
      return [...(experiences || [])].sort((a, b) => b.startDate - a.startDate).map(resumeAdapter.toExperience)
    },
    educations({ resume: { educations } }): EducationModel[] {
      return (educations || []).map(resumeAdapter.toEducation)
    },
    projects({ resume: { projects } }): ProjectModel[] {
      /** Most recent first, same as `experiences`; entries without a startDate sink to the end. */
      return [...(projects || [])].sort((a, b) => (b.startDate || 0) - (a.startDate || 0)).map(resumeAdapter.toProject)
    },
    foreignLanguages(): LanguageModel[] {
      return ((this.generalInformation as GeneralInformation).foreignLanguages || []).map(resumeAdapter.toLanguage)
    },
    skills(): SkillModel[] {
      return ((this.generalInformation as GeneralInformation).professionalSkills || []).map(resumeAdapter.toSkill)
    },
    /** Soft skills - the API only gives free-text `name`s (no exp/group). */
    personalSkills(): string[] {
      return ((this.generalInformation as GeneralInformation).personalSkills || []).map((s) => s.name).filter(Boolean)
    },
    groups(): string[] {
      return (this.generalInformation as GeneralInformation).professionalSkillsGroup || []
    },
  },
})
