<script setup lang="ts">
import type { Experience } from '@/types/index';
/* const props = defineProps({
    modelValue: { type: Array as PropType<Experience[]>, default: () => [] },
}); */

const store = useResumeStore();
const experiences = computed(() => store.experiences);
</script>

<template>
    <section class="section-experiences">
        <div class="container-block">
            <BaseHeading text="Kinh nghiệm làm việc" />
            <ul class="list">
                <li v-for="(el, index) in experiences" :key="el._id || index" class="mb-5 last:mb-0">
                    <BlockItem
                        :title="el.position"
                        prefix-position="Công ty"
                        :position="el.company"
                        :start-date="el.startDate"
                        :end-date="el.endDate"
                        :description="el.description"
                        :is-current="el.isCurrent"
                    />
                </li>
            </ul>
        </div>
    </section>
</template>
