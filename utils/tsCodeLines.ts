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

/** Turns an arbitrary label into a valid-looking TS identifier (PascalCase, no symbols/spaces). */
function toIdentifier(label: string): string {
  const id = label
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
  return id ? (/^[0-9]/.test(id) ? `_${id}` : id) : 'Group'
}

const kw = (s: string) => `<span class="text-theme-code-keyword">${s}</span>`
const type = (s: string) => `<span class="text-theme-code-type">${escapeHtml(s)}</span>`
const str = (s: string) => `<span class="text-theme-code-string">'${escapeHtml(s)}'</span>`
const punct = (s: string) => `<span class="text-theme-code-punct">${s}</span>`
const comment = (s: string) => `<span class="text-theme-code-comment italic">// ${escapeHtml(s)}</span>`
/** icon is a filename (no extension) under public/svg/, only passed when a real logo exists for that skill. */
const skillIcon = (icon: string) => `<img src="/svg/${icon}.svg" class="line-icon" alt="" />`

export interface SkillGroupInput {
  label: string
  skills: { name: string; exp?: number; icon?: string }[]
}

/**
 * Renders grouped skills as a TS `enum` (group names) + a `const`
 * Record<enum, string[]> object (skills per group, with a trailing
 * `// N+ years` comment when known), for EditorCodeBlock's `lines` prop.
 */
export function buildSkillsTsLines(groups: SkillGroupInput[]): CodeLine[] {
  const ids = groups.map((g) => toIdentifier(g.label))
  const lines: CodeLine[] = []

  lines.push({ html: `${kw('enum')} ${type('SkillGroup')} ${punct('{')}` })
  groups.forEach((g, i) => {
    lines.push({ html: `${type(ids[i])} ${punct('=')} ${str(g.label)}${punct(',')}`, indent: 2 })
  })
  lines.push({ html: punct('}') })
  lines.push({ html: '' })

  lines.push({
    html: `${kw('const')} skills${punct(':')} ${type('Record')}${punct('<')}${type('SkillGroup')}${punct(', ')}${type(
      'string[]',
    )}${punct('>')} ${punct('=')} ${punct('{')}`,
  })
  groups.forEach((g, i) => {
    lines.push({ html: `${punct('[')}${type('SkillGroup')}${punct('.')}${type(ids[i])}${punct(']:')} ${punct('[')}`, indent: 2 })
    g.skills.forEach((s) => {
      const trailingComment = s.exp ? ` ${comment(`${s.exp}+ years`)}` : ''
      const icon = s.icon ? `${skillIcon(s.icon)} ` : ''
      lines.push({ html: `${icon}${str(s.name)}${punct(',')}${trailingComment}`, indent: 4 })
    })
    lines.push({ html: punct('],'), indent: 2 })
  })
  lines.push({ html: punct('}') })

  return lines
}
