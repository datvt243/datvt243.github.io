/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { customRef } from 'vue'

export function debouncedRef<T>(value: T, delay: number = 200) {
	let timer: any = null
	return customRef((track, trigger) => {
		return {
			get() {
				track()
				return value
			},
			set(newVal) {
				if (timer !== null) {
					clearTimeout(timer)
				}
				timer = setTimeout(function () {
					value = newVal
					trigger()
				}, delay)
			},
		}
	})
}
