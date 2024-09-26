<script setup lang="ts">
import type { Education } from '@/types/index';
const props = defineProps({
    modelValue: { type: Array as PropType<Education[]>, default: () => [] },
});
</script>

<template>
    <div class="resume-wrapper mb-8">
        <BaseHeading text="Học vấn" />
        <ul class="list">
            <li v-for="(el, index) in props.modelValue" :key="el._id || index">
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
    </div>
</template>
