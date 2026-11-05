import { describe, expect, it } from 'vitest'
import { pageRenderAts } from '@/server/utils/createPDFAts'
import type { Project } from '@/types/resume-document'

const project = (name: string, startDate: number, type?: Project['type']) => ({ name, startDate, type }) as Project

const pdfOrder = (projects: Project[]) => [...pageRenderAts({ projects }).html.matchAll(/<p class="entry-title">(.*?)<\/p>/g)].map((m) => m[1])

describe('PDF project order', () => {
  it('lists company projects first, newest first within each group, no type counted as personal', () => {
    expect(
      pdfOrder([
        project('personal-old', 1),
        project('untyped-new', 5),
        project('company-old', 2, 'company'),
        project('personal-mid', 3, 'personal'),
        project('company-new', 4, 'company'),
      ]),
    ).toEqual(['company-new', 'company-old', 'untyped-new', 'personal-mid', 'personal-old'])
  })
})
