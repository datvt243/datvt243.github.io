<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */
</script>

<template>
	<article class="flex flex-col space-y-2 xl:space-y-0 animate-pulse">
		<USkeleton class="h-2 bg-gray-400 w-80 mb-3" />
		<div class="space-y-3">
			<div>
				<USkeleton class="h-6 bg-gray-400 w-80 mb-4" />
				<div class="flex space-x-3">
					<USkeleton class="h-4 bg-pink w-20 opacity-50" />
					<USkeleton class="h-4 bg-pink w-20 opacity-50" />
					<USkeleton class="h-4 bg-pink w-20 opacity-50" />
				</div>
			</div>
			<div class="flex-1 space-y-4 py-1">
				<USkeleton class="h-4 bg-gray-400" />
				<div class="grid grid-cols-3 gap-4">
					<USkeleton class="h-4 bg-gray-400" />
					<USkeleton class="h-4 bg-gray-400" />
					<USkeleton class="h-4 bg-gray-400" />
				</div>
				<USkeleton class="h-4 bg-gray-400" />
			</div>
		</div>
	</article>
</template>
