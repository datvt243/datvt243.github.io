<script setup lang="ts">
const store = useResumeStore();
const projects = computed(() => store.projects);
</script>

<template>
    <section class="section-project">
        <UContainer>
            <BaseHeading text="Dự án" />
            <ul class="list space-y-12">
                <li v-for="(el, index) in projects" :key="el._id || index">
                    <BlockItem
                        :title="el.name"
                        prefix-position="Vị trí"
                        :position="el.position"
                        :start-date="el.startDate"
                        :end-date="el.endDate"
                        :description="el.description"
                        :is-current="el.isWorking"
                    />
                </li>
            </ul>
        </UContainer>
    </section>
</template>
