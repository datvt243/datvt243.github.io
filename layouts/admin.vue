<script setup lang="ts"></script>

<template>
	<div class="flex h-screen overflow-hidden bg-slate-900">
		<!-- sidebar -->
		<AdminPartialSidebar />
		<!-- Contert -->
		<div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
			<AdminPartialHeader />
			<main>
				<slot></slot>
			</main>
		</div>
	</div>
</template>
