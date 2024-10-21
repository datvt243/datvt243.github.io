<script setup lang="ts">
const props = defineProps({
	title: { type: String, default: 'Object Title' },
	titleStyle: { type: String, default: '' },
	titleSize: { type: String, default: '' },
	titleColor: { type: String, default: 'text-sky-500' },
	size: { type: String as PropType<'' | 'sm' | 'lg' | 'xl' | 'xxl'>, default: '' },
})

const obj = {
	sm: { size: 'text-sm', padding: 'pl-8' },
	lg: { size: 'text-2xl', padding: 'pl-16' },
	xl: { size: 'text-4xl', padding: 'pl-24' },
	xxl: { size: 'text-6xl', padding: 'pl-32' },
}

const getSize = computed(() => {
	if (props.titleSize) return props.titleSize
	if (!props.size) return ''
	return `${obj[props.size].size}`
})
const getPadding = computed(() => {
	if (!props.size) return 'pl-8'

	return `${obj[props.size].padding}`
})
</script>

<template>
	<div class="object-layout my-12">
		<p :class="[getSize, 'capitalize font-bold']">
			<span :class="[titleStyle, titleColor]" class="tracking-wider font-jetbrains">{{ title }}</span>
			<span class="icon pl-4">&#123;</span>
		</p>
		<div class="object-content my-6" :class="getPadding">
			<slot></slot>
		</div>
		<p class="icon" :class="getSize">&#125;</p>
	</div>
</template>

<style scope>
.icon {
	font-style: italic;
}
.object-layout {
	position: relative;
}
.object-layout::before {
	content: '';
	position: absolute;
	top: 2em;
	left: 0em;
	height: calc(100% - 4em);
	width: 1px;
	background: white;
	opacity: 0.1;
}
</style>
