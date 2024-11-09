<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const { AppHeading, menuPrimary = [] } = useAppConfig()
const route = useRoute()

const isOpen = ref(false)
</script>

<template>
	<header class="bg-opacity-5 bg-pink border-b-2 border-green-500">
		<UContainer :ui="{ constrained: 'py-2 md:py-4 lg:py-6' }">
			<nav class="rounded-lg">
				<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
					<NuxtLink to="/" class="flex items-center space-x-3">
						<NuxtImg src="logo.png" :title="AppHeading" width="30" />
						<span
							class="text-green-500 hover:text-pink transition-colors self-center text-xl font-bold tracking-wide whitespace-nowrap uppercase"
						>
							{{ AppHeading }}
						</span>
					</NuxtLink>
					<div class="col-right flex items-center justify-end">
						<div class="flex items-center lg:order-2">


							<div class="inline-flex items-center p-2 ml-1 rounded-lg lg:hidden">
								<UButton
									icon="fe:bar"
									size="sm"
									color="primary"
									variant="solid"
									label=""
									@click="isOpen = true"
								/>

								<USlideover v-model="isOpen">
									<div class="p-4 flex-1">
										<UButton
											color="gray"
											variant="ghost"
											size="sm"
											icon="fe:close"
											class="flex lg:hidden absolute end-5 top-5 z-10"
											square
											padded
											@click="isOpen = false"
										/>
										<ul class="space-y-y pt-14">
											<li v-for="(route, index) in menuPrimary" :key="`route-${index}`">
												<NuxtLink
													:to="route.link"
													class="block uppercase tracking-widest text-center py-2 px-2 text-white font-semibold rounded hover:text-pink transition-colors"
												>
													<span>{{ route.page }}</span>
												</NuxtLink>
											</li>
										</ul>
									</div>
								</USlideover>
							</div>
						</div>
						<div
							class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1 mr-4"
							id="mobile-menu-2"
						>
							<ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-4 lg:mt-0">
								<li v-for="(route, index) in menuPrimary" :key="`route-${index}`">
									<NuxtLink
										:to="route.link"
										class="inline-block uppercase tracking-widest py-2 px-2 text-white font-semibold rounded hover:text-pink transition-colors"
									>
										<span>{{ route.page }}</span>
									</NuxtLink>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</nav>
		</UContainer>
	</header>
</template>
