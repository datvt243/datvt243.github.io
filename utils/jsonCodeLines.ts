/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Turns an array of flat key/value records into syntax-highlighted,
 * line-numbered JSON lines, ready for EditorCodeBlock's `lines` prop.
 */
export function buildJsonArrayLines(items: Record<string, string>[]): string[] {
  const punct = (s: string) => `<span class="text-slate-500">${s}</span>`
  const key = (s: string) => `<span class="text-blue-300">"${escapeHtml(s)}"</span>`
  const value = (s: string) => `<span class="text-orange-300">"${escapeHtml(s)}"</span>`

  const lines: string[] = [punct('[')]
  items.forEach((item, itemIndex) => {
    const entries = Object.entries(item)
    lines.push(`&nbsp;&nbsp;${punct('{')}`)
    entries.forEach(([k, v], i) => {
      const comma = i < entries.length - 1 ? punct(',') : ''
      lines.push(`&nbsp;&nbsp;&nbsp;&nbsp;${key(k)}${punct(':')} ${value(v)}${comma}`)
    })
    lines.push(`&nbsp;&nbsp;${punct('}')}${itemIndex < items.length - 1 ? punct(',') : ''}`)
  })
  lines.push(punct(']'))
  return lines
}
