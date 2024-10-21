<script setup lang="ts">
const store = useResumeStore()
const projects = computed(() => store.projects)
</script>

<template>
	<ResumeObjectLayout title="Dự Án" size="xl">
		<ul class="list space-y-12">
			<li v-for="(el, index) in projects" :key="el._id || index">
				<ResumeObjectItem
					:title="el.name"
					icon-position="fe:terminal"
					:position="el.position"
					:start-date="el.startDate"
					:end-date="el.endDate"
					:description="el.description"
					:is-current="el.isWorking"
				/>
			</li>
		</ul>
	</ResumeObjectLayout>
</template>
