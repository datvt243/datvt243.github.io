import { describe, expect, it } from 'vitest'
import { pageRenderAts, type AtsLang } from '@/server/utils/createPDFAts'

const fileName = (cvFileName?: string, lang?: AtsLang) => pageRenderAts({ firstName: 'Võ Tấn', lastName: 'Đạt', cvFileName }, lang).fileName

describe('pageRenderAts fileName', () => {
  it('uses the owner cvFileName, tones removed and header-safe', () => {
    expect(fileName('Võ_Tấn_Đạt CV 2026')).toBe('Vo_Tan_Dat-CV-2026-VI')
    expect(fileName('a"b\r\nc/../d')).toBe('a-b-c-d-VI')
  })

  it('falls back to the full name when cvFileName is unset, blank or all symbols', () => {
    expect(fileName()).toBe('Vo-Tan-Dat-CV-VI')
    expect(fileName('   ')).toBe('Vo-Tan-Dat-CV-VI')
    expect(fileName('"/\\..')).toBe('Vo-Tan-Dat-CV-VI')
  })

  it('ends with the language, so VI and EN downloads differ', () => {
    expect(fileName('Vo_Tan_Dat CV', 'en')).toBe('Vo_Tan_Dat-CV-EN')
    expect(fileName(undefined, 'en')).toBe('Vo-Tan-Dat-CV-EN')
  })
})
