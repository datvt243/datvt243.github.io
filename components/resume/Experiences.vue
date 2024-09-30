<script setup lang="ts">
const store = useResumeStore();
const experiences = computed(() => store.experiences);
</script>

<template>
    <section class="section-experiences">
        <UContainer>
            <BaseHeading text="Kinh nghiệm <span class='hidden md:inline'>làm việc</span>" />
            <ul class="list space-y-12">
                <li v-for="(el, index) in experiences" :key="el._id || index">
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
        </UContainer>
    </section>
</template>
