export const fetchWithRetry = async <T = unknown>(url: string = '', opts: { retries: number; delay: number } = { retries: 3, delay: 1000 }) => {
  for (let i = 0; i < opts.retries; i++) {
    try {
      const res = await $fetch<T>(url)
      return res
    } catch (e) {
      if (i === opts.retries - 1) {
        throw e
      }
      await new Promise((resolve) => setTimeout(resolve, opts.delay))
    }
  }
}
