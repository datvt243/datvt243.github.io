<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const store = useResumeStore()
const foreignLanguages = computed(() => store.foreignLanguages)
</script>

<template>
	<ResumeObjectLayout title="ngoại ngữ" size="xl">
		<ul class="list space-y-12">
			<li v-for="(el, index) in foreignLanguages" :key="el.language || index">
				<ResumeObjectItem
					:title="el.language"
					:position="''"
					:start-date="0"
					:end-date="0"
					:description="''"
					:is-current="false"
				>
					<template #body>
						<p class="position text-slate-400 text-lg capitalize">
							<span>Level: </span><span>{{ el.level }}</span>
						</p>
					</template>
				</ResumeObjectItem>
			</li>
		</ul>
	</ResumeObjectLayout>
</template>
