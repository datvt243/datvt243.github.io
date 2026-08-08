import puppeteer from 'puppeteer-core'
import os from 'os'
// import chromium from 'npm i chrome-aws-lambda'
import type { ResumeAPIResponse, GeneralInformation } from '@/types'

import { pageRender } from '~/server/utils/createPDF'

// defineCachedEventHandler's on-disk cache does not round-trip binary
// Buffer bodies correctly in this Nitro version (see #29) - it serializes
// them as plain per-byte-indexed JSON objects instead of raw bytes. Cache
// the generated PDF in memory instead; resume data changes rarely, and
// this still bounds how often a full headless Chrome launch is triggered.
let cache: { buffer: Uint8Array; filename: string; generatedAt: number } | null = null
const CACHE_MAX_AGE_MS = 60 * 60 * 24 * 1000

export default defineEventHandler(async (event) => {
  if (cache && Date.now() - cache.generatedAt < CACHE_MAX_AGE_MS) {
    setResponseHeader(event, 'Content-Type', 'application/pdf')
    setResponseHeader(event, 'Content-Disposition', `attachment; filename="${cache.filename}.pdf"`)
    return cache.buffer
  }

  const { NODE_API, MY_EMAIL } = useRuntimeConfig().public

  const { success = false, data } = await $fetch<ResumeAPIResponse>(`${NODE_API}/api/me/${MY_EMAIL}`)

  if (!success || !data) {
    throw createError({ statusCode: 502, statusMessage: 'Unable to load resume data' })
  }

  if (data) {
    data.generalInformation = ((generalInformation: GeneralInformation[]) => {
      if (!generalInformation.length) return {}
      return generalInformation[0]
    })(data?.generalInformation || [])
  }

  const { email, html: contentHTML } = pageRender(data)

  // Khởi tạo Puppeteer và tạo PDF
  const { PUPPETEER_EXECUTABLE_PATH } = useRuntimeConfig()

  const getExecutablePath = (() => {
    if (PUPPETEER_EXECUTABLE_PATH) return PUPPETEER_EXECUTABLE_PATH

    // Local-dev fallback only; production must set PUPPETEER_EXECUTABLE_PATH.
    const platform = os.platform()
    let executablePath = ''

    if (platform === 'win32') {
      executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    } else if (platform === 'darwin') {
      executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    } else if (platform === 'linux') {
      executablePath = '/usr/bin/chromium-browser'
    }
    return executablePath
  })()

  const browser = await puppeteer.launch({
    executablePath: getExecutablePath, // Đường dẫn đến trình duyệt Chrome (nếu đã cài)
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Thêm các cờ nếu cần
  })
  const page = await browser.newPage()

  // Đặt nội dung HTML vào trang
  await page.setContent(contentHTML)

  // Tạo PDF
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  })

  await browser.close()

  const safeFilename = (email || 'resume').replace(/[^a-zA-Z0-9._-]/g, '_')

  cache = { buffer: pdfBuffer, filename: safeFilename, generatedAt: Date.now() }

  // Trả file PDF cho client
  setResponseHeader(event, 'Content-Type', 'application/pdf')
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="${safeFilename}.pdf"`)

  return pdfBuffer
})
