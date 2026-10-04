import puppeteer from 'puppeteer-core'
import os from 'os'
import chromium from '@sparticuz/chromium'
import type { ResumeAPIResponse, GeneralInformation } from '@/types'

import { pageRender } from '~/server/utils/createPDF'
import { pageRenderAts, type AtsLang } from '~/server/utils/createPDFAts'

/**
 * defineCachedEventHandler's on-disk cache does not round-trip binary
 * Buffer bodies correctly in this Nitro version (see #29) - it serializes
 * them as plain per-byte-indexed JSON objects instead of raw bytes. Cache
 * the generated PDF in memory instead; resume data changes rarely, and
 * this still bounds how often a full headless Chrome launch is triggered.
 * Keyed per template+lang (issue #206) so a cached classic body is never
 * served for an ATS request or vice versa.
 */
const cache = new Map<string, { buffer: Uint8Array; filename: string; generatedAt: number }>()
const CACHE_MAX_AGE_MS = 60 * 60 * 24 * 1000

/**
 * Vercel's serverless functions run on Amazon Linux with no system Chrome
 * installed at any fixed path - PUPPETEER_EXECUTABLE_PATH alone can't work
 * there (there's nothing for it to point to). @sparticuz/chromium ships a
 * Linux-x64 Chromium binary built specifically for Lambda-style serverless
 * hosts, extracted to /tmp on first use per container. It's Linux-only, so
 * local dev (macOS/Windows) still falls back to the OS-detected/explicit
 * PUPPETEER_EXECUTABLE_PATH path below.
 */
async function resolveLaunchOptions(): Promise<{ executablePath: string; args: string[] }> {
  if (process.env.VERCEL) {
    return { executablePath: await chromium.executablePath(), args: chromium.args }
  }

  const { PUPPETEER_EXECUTABLE_PATH } = useRuntimeConfig()
  if (PUPPETEER_EXECUTABLE_PATH) {
    return { executablePath: PUPPETEER_EXECUTABLE_PATH, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
  }

  const platform = os.platform()
  let executablePath = ''
  if (platform === 'win32') {
    executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  } else if (platform === 'darwin') {
    executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  } else if (platform === 'linux') {
    executablePath = '/usr/bin/chromium-browser'
  }
  return { executablePath, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const template = query.template === 'ats' ? 'ats' : 'classic'
  const lang: AtsLang = query.lang === 'en' ? 'en' : 'vi'
  const cacheKey = template === 'ats' ? `ats-${lang}` : 'classic'

  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.generatedAt < CACHE_MAX_AGE_MS) {
    setResponseHeader(event, 'Content-Type', 'application/pdf')
    setResponseHeader(event, 'Content-Disposition', `attachment; filename="${cached.filename}.pdf"`)
    return cached.buffer
  }

  const { NODE_API, MY_EMAIL } = useRuntimeConfig().public

  const { success = false, data } = await $fetch<ResumeAPIResponse>(`${NODE_API}/api/me/${MY_EMAIL}`)

  if (!success || !data) {
    throw createError({ statusCode: 502, statusMessage: 'Unable to load resume data' })
  }

  if (data) {
    /**
     * The API returns this as an object or an array of one - the old
     * array-only check turned the real object shape into {}, silently
     * dropping skills/languages from the PDF.
     */
    const generalInformation = data.generalInformation
    data.generalInformation = Array.isArray(generalInformation)
      ? generalInformation[0] || ({} as GeneralInformation)
      : generalInformation || ({} as GeneralInformation)
  }

  const { email, html: contentHTML } = template === 'ats' ? pageRenderAts(data, lang) : pageRender(data)

  const { executablePath, args } = await resolveLaunchOptions()

  const browser = await puppeteer.launch({ executablePath, args })
  const page = await browser.newPage()

  await page.setContent(contentHTML)

  const pdfBuffer = await page.pdf(
    template === 'ats'
      ? { format: 'A4', printBackground: false, margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }, tagged: true }
      : { format: 'A4', printBackground: true },
  )

  await browser.close()

  const safeFilename = (email || 'resume').replace(/[^a-zA-Z0-9._-]/g, '_') + (template === 'ats' ? '-ats' : '')

  cache.set(cacheKey, { buffer: pdfBuffer, filename: safeFilename, generatedAt: Date.now() })

  setResponseHeader(event, 'Content-Type', 'application/pdf')
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="${safeFilename}.pdf"`)

  return pdfBuffer
})
