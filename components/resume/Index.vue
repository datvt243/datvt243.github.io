<script setup lang="ts">
import type { Resume, Education, Experience, Information } from '@/types/resume-document';

const props = defineProps<{
    modelValue: Resume;
}>();

const information = computed<Information>(() => {
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
});
const educations = computed<Education[]>(() => {
    return props.modelValue?.educations || [];
});
const experiences = computed<Experience[]>(() => {
    return props.modelValue?.experiences || [];
});
</script>

<template>
    <div class="resume-wrapper">
        <ResumeInformation :model-value="information" />
        <ResumeExperiences :model-value="experiences" />
        <ResumeEducations :model-value="educations" />
    </div>
</template>
