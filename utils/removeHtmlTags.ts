/**
 * @param input - string
 * @returns string
 * */
export function removeHtmlTags(input: string): string {
	if (typeof input !== 'string') return ''
	// Sử dụng RegEx để tìm và loại bỏ tất cả các thẻ HTML
	return input.replace(/<\/?[^>]+(>|$)/g, '')
}
