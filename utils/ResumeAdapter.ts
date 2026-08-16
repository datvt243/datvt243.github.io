import type { Education, Experience, ForeignLanguage, GeneralInformation, Information, Project, ProfessionalSkill, SocialMedia } from '@/types'
import { EducationModel, ExperienceModel, HeroModel, LanguageModel, ProjectModel, SkillModel, SocialMediaModel } from '@/models'

/**
 * Adapter pattern: converts raw external-API shapes (`@/types`) into the
 * app's Prototype-pattern data models (`@/models`). One class, one method
 * per entity, each cloning its own pre-built prototype instance (see
 * `@/models/BaseModel`) rather than constructing a fresh one.
 *
 * Methods are instance arrow-function fields (not `static`), for two
 * reasons: (1) `@typescript-eslint/no-extraneous-class` in this repo's
 * lint config forbids a class made of only static members; (2) arrow
 * fields bind `this` at construction time, so they stay safe to pass as
 * bare callbacks (`experiences.map(resumeAdapter.toExperience)` in
 * `stores/resume.ts`) without needing to avoid `this` inside them - a
 * regular method torn off its instance would lose that binding.
 * `resumeAdapter` below is the one instance every caller shares.
 *
 * Deliberately NOT re-exported from `utils/index.ts`'s barrel: this file
 * imports `@/models`, and models import shared helpers back through the
 * `@/utils` barrel - re-exporting this here would create a
 * `utils/index.ts` <-> `models/index.ts` circular import. Import it
 * directly (`@/utils/ResumeAdapter`) where needed instead.
 */
export class ResumeAdapter {
  private readonly experiencePrototype = new ExperienceModel()
  private readonly educationPrototype = new EducationModel()
  private readonly skillPrototype = new SkillModel()
  private readonly languagePrototype = new LanguageModel()
  private readonly projectPrototype = new ProjectModel()
  private readonly heroPrototype = new HeroModel()
  private readonly socialMediaPrototype = new SocialMediaModel()

  toExperience = (raw: Partial<Experience>): ExperienceModel => {
    return Object.assign(this.experiencePrototype.clone(), {
      id: raw._id ?? '',
      company: raw.company ?? '',
      position: raw.position ?? '',
      startDate: typeof raw.startDate === 'number' ? new Date(raw.startDate) : null,
      endDate: typeof raw.endDate === 'number' ? new Date(raw.endDate) : null,
      isCurrent: Boolean(raw.isCurrent),
      description: raw.description ?? '',
      skills: raw.skills ?? [],
    })
  }

  toEducation = (raw: Partial<Education>): EducationModel => {
    return Object.assign(this.educationPrototype.clone(), {
      id: raw._id ?? '',
      school: raw.school ?? '',
      major: raw.major ?? '',
      startDate: typeof raw.startDate === 'number' ? new Date(raw.startDate) : null,
      endDate: typeof raw.endDate === 'number' ? new Date(raw.endDate) : null,
      isCurrent: Boolean(raw.isCurrent),
      description: raw.description ?? '',
    })
  }

  /**
   * The raw API sometimes omits `group` from the object entirely (not
   * just `undefined`) rather than always including it - normalized here
   * into the model's `'Other'` default so consumers never need an
   * `Object.hasOwn` check.
   */
  toSkill = (raw: Partial<ProfessionalSkill>): SkillModel => {
    return Object.assign(this.skillPrototype.clone(), {
      name: raw.name ?? '',
      yearsOfExperience: raw.exp ?? 0,
      group: raw.group ?? 'Other',
    })
  }

  toLanguage = (raw: Partial<ForeignLanguage>): LanguageModel => {
    return Object.assign(this.languagePrototype.clone(), {
      language: raw.language ?? '',
      level: raw.level ?? '',
    })
  }

  toProject = (raw: Partial<Project>): ProjectModel => {
    return Object.assign(this.projectPrototype.clone(), {
      id: raw._id ?? '',
      name: raw.name ?? '',
      description: raw.description ?? '',
      position: raw.position ?? '',
      technology: raw.technology ?? [],
      images: (raw.images ?? []).filter((src): src is string => typeof src === 'string'),
      link: raw.link ?? '',
      isWorking: Boolean(raw.isWorking),
      startDate: typeof raw.startDate === 'number' ? new Date(raw.startDate) : null,
      endDate: typeof raw.endDate === 'number' ? new Date(raw.endDate) : null,
    })
  }

  toHero = (information: Partial<Information>, generalInformation: Partial<GeneralInformation>): HeroModel => {
    return Object.assign(this.heroPrototype.clone(), {
      firstName: information.firstName ?? '',
      lastName: information.lastName ?? '',
      positionDesired: generalInformation.positionDesired || 'A frontend developer',
      introduction: information.introduction ?? '',
      email: information.email ?? '',
    })
  }

  toSocialMedia = (raw: Partial<SocialMedia>): SocialMediaModel => {
    return Object.assign(this.socialMediaPrototype.clone(), {
      github: raw.github ?? '',
      linkedin: raw.linkedin ?? '',
      website: raw.website ?? '',
    })
  }
}

export const resumeAdapter = new ResumeAdapter()
