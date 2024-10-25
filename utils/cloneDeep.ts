/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

/**
 * @param obj - [TODO:description]
 * @returns Object | Array | string ...
 * */
export function cloneDeep(obj: any) {
	// Kiểm tra nếu obj không phải là đối tượng hoặc là null
	if (obj === null || typeof obj !== 'object') {
		return obj
	}

	// Tạo một bản sao mới, sử dụng Array.isArray để kiểm tra nếu obj là mảng
	const copy: any = Array.isArray(obj) ? [] : {}

	// Duyệt qua tất cả các thuộc tính của obj
	for (const key in obj) {
		// Đệ quy để sao chép các thuộc tính
		copy[key] = cloneDeep(obj[key])
	}

	return copy
}
