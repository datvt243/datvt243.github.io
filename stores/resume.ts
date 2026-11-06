/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import type { Resume, GeneralInformation } from '@/types'
import type { EducationModel, ExperienceModel, HeroModel, LanguageModel, ProjectModel, SkillModel, SocialMediaModel } from '@/utils/ResumeAdapter'
import { toEducation, toExperience, toHero, toLanguage, toProject, toSkill, toSocialMedia } from '@/utils/ResumeAdapter'
import { compareProjects } from '@/utils/sortProjects'

export const useResumeStore = defineStore('resume', {
  state: () => ({
    resume: {} as Resume,
  }),
  actions: {
    async fetchData(lang: string): Promise<Resume> {
      // No implicit retry: each retry of a failed /api/resume is another call to the rate-limited upstream.
      const { resume } = await $fetch<{ success: boolean; resume: Resume }>('/api/resume', { query: { lang }, retry: 0 })
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
      return toHero(resume, this.generalInformation as GeneralInformation)
    },

    social({ resume: { socialMedia } }): SocialMediaModel {
      return toSocialMedia(socialMedia || {})
    },
    experiences({ resume: { experiences } }): ExperienceModel[] {
      return [...(experiences || [])].sort((a, b) => b.startDate - a.startDate).map(toExperience)
    },
    educations({ resume: { educations } }): EducationModel[] {
      return (educations || []).map(toEducation)
    },
    projects({ resume: { projects } }): ProjectModel[] {
      return [...(projects || [])].sort(compareProjects).map(toProject)
    },
    foreignLanguages(): LanguageModel[] {
      return ((this.generalInformation as GeneralInformation).foreignLanguages || []).map(toLanguage)
    },
    skills(): SkillModel[] {
      return ((this.generalInformation as GeneralInformation).professionalSkills || []).map(toSkill)
    },
    /** Soft skills - the API only gives free-text `name`s (no exp/group). */
    personalSkills(): string[] {
      return ((this.generalInformation as GeneralInformation).personalSkills || []).map((s) => s.name).filter(Boolean)
    },
    mainSkills(): string[] {
      return ((this.generalInformation as GeneralInformation).mainSkills || []).map((s) => s.name).filter(Boolean)
    },
    familiarSkills(): string[] {
      return ((this.generalInformation as GeneralInformation).familiarSkills || []).map((s) => s.name).filter(Boolean)
    },
    groups(): string[] {
      return (this.generalInformation as GeneralInformation).professionalSkillsGroup || []
    },
  },
})
