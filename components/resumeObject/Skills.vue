<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

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

const expLabel = (val: ProfessionalSkill) => (val.exp ? `${val.exp}+ years` : undefined)
</script>

<template>
  <ul class="space-y-4">
    <li v-for="[_key, _val] of Object.entries(objectRender)" :key="`${_key}`" class="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span class="font-bold capitalize text-orange-400 shrink-0">{{ _key }}:</span>
      <span class="flex flex-wrap gap-2">
        <UTooltip v-for="(val, i) of _val" :key="`sub-skill-${i}`" :text="expLabel(val)">
          <UBadge :label="val.name" variant="outline" />
        </UTooltip>
      </span>
    </li>
  </ul>
</template>
