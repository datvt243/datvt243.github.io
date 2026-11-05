import { describe, expect, it } from 'vitest'
import { pageRenderAts } from '@/server/utils/createPDFAts'

const fileName = (cvFileName?: string) => pageRenderAts({ firstName: 'Võ Tấn', lastName: 'Đạt', cvFileName }).fileName

describe('pageRenderAts fileName', () => {
  it('uses the owner cvFileName, tones removed and header-safe', () => {
    expect(fileName('Võ_Tấn_Đạt CV 2026')).toBe('Vo_Tan_Dat-CV-2026')
    expect(fileName('a"b\r\nc/../d')).toBe('a-b-c-d')
  })

  it('falls back to the full name when cvFileName is unset, blank or all symbols', () => {
    expect(fileName()).toBe('Vo-Tan-Dat-CV')
    expect(fileName('   ')).toBe('Vo-Tan-Dat-CV')
    expect(fileName('"/\\..')).toBe('Vo-Tan-Dat-CV')
  })
})
