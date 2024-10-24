interface Parames {
	user: string
	token: string
	type: 'repos' | 'user'
}
export async function useGithubAPI<T>(opts: Parames) {
	const { user, type, token } = toRefs(opts)
	const Headers = {
		Authorization: `token ${token.value}`,
	}
	//const data = ref<T | null>(null)

	let URL = `https://api.github.com/users/${user.value}`
	type.value == 'repos' && (URL += `/${type.value}`)

	async function fetchData() {
		const { data, status } = await useAsyncData(`github-${user.value}-${type.value}`, () =>
			$fetch(URL, {
				headers: Headers,
			}),
		)
		/* const { data, status } = await useAsyncData<T>(URL, {
			headers: {
				Authorization: `token ${token}`,
			},
		}) */
		return { data, status }
	}

	const _val = await fetchData()

	return {
		data: _val.data as T,
		status: _val.status,
	}
}
