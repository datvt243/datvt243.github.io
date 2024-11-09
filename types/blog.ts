/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

export interface Post {
	_id: string
	title: string
	slug: string
	isPublic: boolean
	content: string
	authorId: string
	createdAt: string
	updatedAt?: string
	tags?: string[],
	excerpt: string,
	categoryIds?: string[]
}
