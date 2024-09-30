<script setup lang="ts">
import type { Education } from '@/types/index';
/* const props = defineProps({
    modelValue: { type: Array as PropType<Education[]>, default: () => [] },
}); */
const store = useResumeStore();
const educations = computed(() => store.educations);
</script>

<template>
    <section class="section-educations bg-opacity-5 bg-green-700">
        <UContainer>
            <BaseHeading text="Học vấn" />
            <ul class="list">
                <li v-for="(el, index) in educations" :key="el._id || index">
                    <BlockItem
                        :title="el.school"
                        :position="el.major"
                        :start-date="el.startDate"
                        :end-date="el.endDate"
                        :description="el.description"
                        :is-current="el.isCurrent"
                    />
                </li>
            </ul>
        </UContainer>
    </section>
</template>
