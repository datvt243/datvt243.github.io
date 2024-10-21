<script setup lang="ts">
const store = useResumeStore()
const educations = computed(() => store.educations)
</script>

<template>
	<ResumeObjectLayout title="Học vấn" size="xl">
		<ul class="list space-y-12">
			<li v-for="(el, index) in educations" :key="el._id || index">
				<ResumeObjectItem
					:title="el.school"
					icon-position="fe:building"
					:position="el.major"
					:start-date="el.startDate"
					:end-date="el.endDate"
					:description="el.description"
					:is-current="el.isCurrent"
				/>
			</li>
		</ul>
	</ResumeObjectLayout>
</template>
