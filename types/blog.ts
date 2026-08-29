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
  tags?: string[]
  excerpt: string
  categoryIds?: string[]
}

/**
 * The real shape of the blog API's `data` field for a post list — a page
 * of posts plus pagination metadata, NOT a bare `Post[]` (see the trap in
 * `agent-hub/doctrine/domains/PROJECT.md`).
 */
export interface PaginatedPosts {
  data: Post[]
  total: number
  page: number
  perPage: number
}
