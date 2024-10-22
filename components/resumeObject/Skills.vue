<script setup lang="ts">
import type { ProfessionalSkill } from '@/types/resume-document'
interface ObjectRender {
	[key: string]: ProfessionalSkill[]
}
const { skills, groups } = useResumeStore()

const objectRender: ObjectRender = reactive({})
getObjectRender(skills, groups)

function getObjectRender(skills: ProfessionalSkill[], groups: string[]) {
	for (const gr of groups) {
		const _filter = skills.filter((s) => s.group === gr)
		_filter.length && (objectRender[gr] = _filter)
	}

	{
		const _filter = skills.filter((s) => !Object.hasOwn(s, 'group'))
		_filter.length && (objectRender['Other'] = _filter)
	}
}

const SupSkills = defineComponent(
	(props: { modelValue: ProfessionalSkill }) => {
		const { name, exp } = props.modelValue
		return () => {
			return h(
				'p',
				{
					attrs: { 'data-exp': exp },
				},
				name,
			)
			/* return `<p data-exp="${props.modelValue.exp}">${props.modelValue.name}</p>`; */
		}
	},
	{
		props: {
			modelValue: { type: Object as PropType<ProfessionalSkill>, default: () => ({}) },
		},
	},
)
</script>

<template>
	<ResumeObjectLayout title="Kỹ năng chuyên môn" size="xl">
		<ul class="list items-center space-y-4 my-2 md:my-3">
			<li class="block md:flex" v-for="[_key, _val] of Object.entries(objectRender)" :key="`${_key}`">
				<span class="font-bold pr-2 capitalize text-pink-500">{{ _key }}: </span>
				<ul class="flex flex-wrap">
					<li v-for="(val, i) of _val" :key="`sub-skill-${i}`" class="pr-2">
						<SupSkills :model-value="val" />
					</li>
				</ul>
			</li>
		</ul>
	</ResumeObjectLayout>
	
</template>
