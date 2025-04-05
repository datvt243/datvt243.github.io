
export const fetchWithRetry = async (url: string = '', opts: { retries: number, delay: number } = { retries: 3, delay: 1000 }) => {

	for (let i = 0; i < opts.retries; i++) {
		try {
			const res: any = await $fetch(url)
			return res
		} catch (e) {
			if (i === opts.retries) {
				throw e;
			}
			await new Promise(resolve => setTimeout(resolve, opts.delay));
		}
	}
}