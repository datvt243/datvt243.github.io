<script setup lang="ts">
const store = useResumeStore()
const experiences = computed(() => store.experiences)
</script>

<template>
	<ResumeObjectLayout title="Kinh nghiệm làm việc" size="xl">
		<ul class="list space-y-12">
			<li v-for="(el, index) in experiences" :key="el._id || index">
				<ResumeObjectItem
					:title="el.position"
					icon-position="fe:building"
					:position="el.company"
					:start-date="el.startDate"
					:end-date="el.endDate"
					:description="el.description"
					:is-current="el.isCurrent"
				/>
			</li>
		</ul>
	</ResumeObjectLayout>
</template>
