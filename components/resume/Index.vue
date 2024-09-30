<script setup lang="ts">
import type { Resume, Education, Experience, Information, ProfessionalSkill } from '@/types/resume-document';

const props = defineProps<{
    modelValue: Resume;
}>();

/* const information = computed<Information>(() => {
    const {
        email = '',
        position = '',
        gender = false,
        birthday = 0,
        address = '',
        phone = '',
        introduction = '',
        firstName = '',
        lastName = '',
        marital = false,
        socialMedia = {
            github: '',
            linkedin: '',
            website: '',
        },
    } = props.modelValue;
    return {
        email,
        position,
        gender,
        birthday,
        address,
        phone,
        introduction,
        firstName,
        lastName,
        marital,
        socialMedia,
    };
}); */
const educations = computed<Education[]>(() => {
    return props.modelValue?.educations || [];
});
const experiences = computed<Experience[]>(() => {
    return props.modelValue?.experiences || [];
});
const skills = computed(() => {
    return props.modelValue.generalInformation.professionalSkills;
});
const groups = computed(() => {
    return props.modelValue.generalInformation.professionalSkillsGroup;
});
</script>

<template>
    <div class="resume-wrapper">
        <ResumeHero />
        <ResumeAboutMe />
        <ResumeSkills :model-value="skills" :groups="groups" />
        <ResumeExperiences />
        <ResumeProjects />
        <ResumeEducations />
        <ResumeLanguages />
    </div>
</template>
