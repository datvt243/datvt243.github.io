/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

/**
 * Pulls out <li> item text from an HTML description (API descriptions are
 * usually <ul><li>...</li></ul> already). Falls back to the tag-stripped
 * text as a single item when there's no list to preserve.
 */
export function extractListItems(html?: string): string[] {
  const src = html || ''
  const items = [...src.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  )
  if (items.length) return items.filter(Boolean)
  const plain = src.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return plain ? [plain] : []
}
