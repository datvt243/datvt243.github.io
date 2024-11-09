<template>
	<div class="wrapper-app">
		<NuxtLoadingIndicator :height="10" />
		<div class="flex flex-col min-h-screen">
			<TemplateHeader />
			<NuxtLayout>
				<NuxtPage />
			</NuxtLayout>
			<TemplateFooter />
		</div>
	</div>
</template>
<script setup lang="ts">
</script>