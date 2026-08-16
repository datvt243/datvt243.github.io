/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { CodeLine } from '@/types/codeLine'

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
export function buildJsonArrayLines(items: Record<string, string>[]): CodeLine[] {
  const punct = (s: string) => `<span class="text-theme-code-punct">${s}</span>`
  const key = (s: string) => `<span class="text-theme-code-key">"${escapeHtml(s)}"</span>`
  const value = (s: string) => `<span class="text-theme-code-string">"${escapeHtml(s)}"</span>`

  const lines: CodeLine[] = [{ html: punct('[') }]
  items.forEach((item, itemIndex) => {
    const entries = Object.entries(item)
    lines.push({ html: punct('{'), indent: 2 })
    entries.forEach(([k, v], i) => {
      const comma = i < entries.length - 1 ? punct(',') : ''
      lines.push({ html: `${key(k)}${punct(':')} ${value(v)}${comma}`, indent: 4 })
    })
    lines.push({ html: `${punct('}')}${itemIndex < items.length - 1 ? punct(',') : ''}`, indent: 2 })
  })
  lines.push({ html: punct(']') })
  return lines
}
