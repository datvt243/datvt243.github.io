<script setup lang="ts">
import type { ProfessionalSkill } from '@/types/resume-document';
interface ObjectRender {
    [key: string]: ProfessionalSkill[];
}

const props = defineProps({
    modelValue: { type: Array as PropType<ProfessionalSkill[]>, default: () => [] },
    groups: { type: Array as PropType<string[]>, default: () => [] },
});

const objectRender: ObjectRender = reactive({});
getObjectRender(props.modelValue, props.groups);

function getObjectRender(skills: ProfessionalSkill[], groups: string[]) {
    for (const gr of groups) {
        const _filter = skills.filter((s) => s.group === gr);
        _filter.length && (objectRender[gr] = _filter);
    }

    {
        const _filter = skills.filter((s) => !Object.hasOwn(s, 'group'));
        _filter.length && (objectRender['Other'] = _filter);
    }
}

watch(
    props,
    (val: typeof props) => {
        getObjectRender(val.modelValue, val.groups);
    },
    {
        deep: true,
    },
);

const SupSkills = defineComponent(
    (props: { modelValue: ProfessionalSkill }) => {
        const { name, exp } = props.modelValue;
        return () => {
            return h(
                'p',
                {
                    attrs: { 'data-exp': exp },
                },
                name,
            );
            /* return `<p data-exp="${props.modelValue.exp}">${props.modelValue.name}</p>`; */
        };
    },
    {
        props: {
            modelValue: { type: Object as PropType<ProfessionalSkill>, default: () => ({}) },
        },
    },
);
</script>

<template>
    <section class="resume-professional-skills bg-opacity-5 bg-white">
        <UContainer>
            <BaseHeading text="Kỹ năng <span class='hidden md:inline'>chuyên môn</span>" />
            <ul class="list items-center space-y-4">
                <li class="flex" v-for="[_key, _val] of Object.entries(objectRender)" :key="`${_key}`">
                    <span class="font-bold pr-2 capitalize">{{ _key }}: </span>
                    <ul class="flex flex-wrap">
                        <li v-for="(val, i) of _val" :key="`sub-skill-${i}`" class="pr-2">
                            <SupSkills :model-value="val" />
                        </li>
                    </ul>
                </li>
            </ul>
        </UContainer>
    </section>
</template>
