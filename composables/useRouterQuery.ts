interface QueryParams {
	category: string
	page: number
	perPage: number
}


export function useRouterQuery() {
	const category = ref(''),
		page = ref(1),
		perPage = ref(20);

	const route = useRoute();

	const cate = route.query.category;

	return {
		category,
		page,
		perPage
	};
}