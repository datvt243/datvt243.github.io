<script setup lang="ts">
import type { Experience } from '@/types/index';
const props = defineProps({
    modelValue: { type: Array as PropType<Experience[]>, default: () => [] },
});
</script>

<template>
    <div class="resume-wrapper mb-8">
        <BaseHeading text="Kinh nghiệm làm việc" />
        <ul class="list">
            <li v-for="(el, index) in props.modelValue" :key="el._id || index" class="mb-5 last:mb-0">
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
</template>
