<script setup lang="ts">
/**
 * @file HR view: the same resume data as the editor tabs, laid out as a
 * conventional resume (headings, dates, plain text) for recruiters.
 */

import { groupSkills, skillIcon } from '@/utils/index'

const { t, te } = useI18n()
const store = useResumeStore()

const skillGroups = computed(() =>
  groupSkills(store.groups, store.skills, t('resume.hr.other')).map(({ label, skills }) => ({
    label,
    skills: skills.map((s) => ({ name: s.name, exp: s.yearsOfExperience, icon: skillIcon(s.name) })),
  })),
)

/** Same wording as the Dev view's career-break heading. */
function careerBreakTitle(type: string) {
  const key = `resume.careerBreakTypes.${type}`
  return type && te(key) ? `${t('resume.careerBreak')} — ${t(key)}` : t('resume.careerBreak')
}
</script>

<template>
  <div class="rounded-sm border border-theme-border bg-theme-panel p-5 md:p-8 font-sans text-theme-text space-y-8">
    <section v-if="store.experiences.length">
      <h2 class="hr-heading">{{ t('resume.hr.experience') }}</h2>
      <article v-for="(el, index) in store.experiences" :key="el.id || index" class="py-4 border-b border-theme-border-subtle last:border-b-0">
        <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <h3 class="hr-title flex items-start gap-2">
            <UIcon v-if="el.isCareerBreak" name="heroicons:pause-circle" class="hr-title-icon text-theme-muted" aria-hidden="true" />
            <UIcon v-else-if="el.isCurrent" name="heroicons:briefcase" class="hr-title-icon text-theme-accent" aria-hidden="true" />
            <UIcon v-else name="heroicons:briefcase" class="hr-title-icon text-theme-muted" aria-hidden="true" />
            <span>{{ el.isCareerBreak ? careerBreakTitle(el.careerBreakType) : el.position }}</span>
          </h3>
          <time class="text-sm text-theme-muted shrink-0">{{ el.dateRangeLabel }}</time>
        </div>
        <p v-if="!el.isCareerBreak && el.company" class="text-sm text-theme-text-soft">{{ el.company }}</p>
        <ul v-if="el.descriptionItems.length" class="mt-2 list-disc pl-5 space-y-1 text-sm leading-relaxed">
          <li v-for="(point, i) in el.descriptionItems" :key="i">{{ point }}</li>
        </ul>
        <p v-if="el.skills?.length" class="mt-2 text-sm text-theme-muted">{{ el.skills.join(', ') }}</p>
      </article>
    </section>

    <section v-if="skillGroups.length">
      <h2 class="hr-heading">{{ t('resume.hr.skills') }}</h2>
      <table class="mt-3 w-full border-collapse text-sm">
        <tbody>
          <tr v-for="group in skillGroups" :key="group.label" class="border-b border-theme-border-subtle last:border-b-0 even:bg-theme-panel-subtle/50">
            <th scope="row" class="w-1/3 sm:w-56 px-3 py-2.5 align-top text-left font-semibold text-theme-text-strong">{{ group.label }}</th>
            <td class="px-3 py-2.5">
              <ul class="flex flex-wrap gap-x-4 gap-y-1.5">
                <li v-for="s in group.skills" :key="s.name" class="inline-flex items-center gap-1.5">
                  <NuxtImg v-if="s.icon" :src="`svg/${s.icon}.svg`" width="16" height="16" class="w-4 h-4 object-contain" alt="" />
                  <span>{{ s.name }}</span>
                  <span v-if="s.exp" class="text-xs text-theme-muted whitespace-nowrap">{{ t('resume.hr.years', { n: s.exp }) }}</span>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <ul v-if="store.personalSkills.length" class="mt-4 list-disc pl-5 space-y-1 text-sm">
        <li v-for="(s, i) in store.personalSkills" :key="i">{{ s }}</li>
      </ul>
    </section>

    <section v-if="store.educations.length">
      <h2 class="hr-heading">{{ t('resume.hr.education') }}</h2>
      <article v-for="(el, index) in store.educations" :key="index" class="py-3">
        <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <h3 class="hr-title">{{ el.school }}</h3>
          <span class="text-sm text-theme-muted shrink-0">{{ el.startDateLabel }} – {{ el.endDateLabel }}</span>
        </div>
        <p v-if="el.major" class="text-sm text-theme-text-soft">{{ el.major }}</p>
        <p v-if="el.descriptionText && el.descriptionText !== el.major" class="mt-1 text-sm">{{ el.descriptionText }}</p>
      </article>
    </section>

    <section v-if="store.foreignLanguages.length">
      <h2 class="hr-heading">{{ t('resume.hr.languages') }}</h2>
      <ul class="mt-3 space-y-1 text-sm">
        <li v-for="(el, i) in store.foreignLanguages" :key="i" class="capitalize">{{ el.language }}<span v-if="el.level" class="text-theme-muted"> — {{ el.level }}</span></li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.hr-heading {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgb(var(--theme-accent));
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgb(var(--theme-accent));
}
.hr-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  color: rgb(var(--theme-text-strong));
}
/* Nudged to sit on the first text line, so a wrapped title keeps the icon at the top. */
.hr-title-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.1875rem;
}
</style>
