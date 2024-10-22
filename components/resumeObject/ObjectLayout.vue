<script setup lang="ts">
type Size = 'sm' | 'lg' | 'xl' | 'xxl';
const props = defineProps({
	title: { type: String, default: 'Object Title' },
	titleStyle: { type: String, default: '' },
	titleSize: { type: String, default: '' },
	titleColor: { type: String, default: 'text-sky-500' },
	size: { type: String as PropType<'' | Size>, default: '' },
})

const obj = {
	sm: { size: 'text-sm', padding: 'pl-3 md:pl-6 lg:pl-7 xl:pl-8' },
	lg: { size: 'text-xl', padding: 'pl-3 md:pl-12 lg:pl-14 xl:pl-16' },
	xl: { size: 'text-3xl md:text-xl lg:text-4xl', padding: 'pl-3 md:pl-14 lg:pl-20 xl:pl-24' },
	xxl: { size: 'text-md md:text-2xl lg:text-6xl', padding: 'pl-3 md:pl-16 lg:pl-30 xl:pl-32' },
}

const getSize = computed(() => {
	if (props.titleSize) return props.titleSize
	if (!props.size) return ''
	const key: Size = props.size;
	return `${obj[key].size}`
})
const getPadding = computed(() => {
	if (!props.size) return 'pl-8'
	const key: Size = props.size;
	return `${obj[key].padding}`
})
</script>

<template>
	<div class="object-layout my-4 md:my-8 lg:my-12">
		<p :class="[getSize, 'capitalize font-bold']">
			<span :class="[titleStyle, titleColor]" class="tracking-wider font-jetbrains uppercase">{{ title }}</span>
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
