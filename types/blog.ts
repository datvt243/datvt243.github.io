/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

export interface Post {
  _id: string
  title: string
  slug: string
  // Declared on the type but the real API never actually returns it
  // (confirmed live 2026-09-06 while adding runtime validation, issue
  // #141) and nothing in the app reads `post.isPublic` — kept optional
  // to match reality instead of a field that was never really there.
  isPublic?: boolean
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
