import puppeteer from 'puppeteer-core'
import os from 'os'
// import chromium from 'npm i chrome-aws-lambda'
import type { ResumeAPIResponse, GeneralInformation } from '@/types'

import { pageRender } from '~/server/utils/createPDF'

export default defineEventHandler(async (event) => {
	const { NODE_API, MY_EMAIL } = useRuntimeConfig().public

	const { success = false, data } = await $fetch<ResumeAPIResponse>(`${NODE_API}/api/me/${MY_EMAIL}`)

	if (data) {
		data.generalInformation = ((generalInformation: GeneralInformation[]) => {
			if (!generalInformation.length) return {}
			return generalInformation[0]
		})(data?.generalInformation || [])
	}

	const { email, html: contentHTML } = pageRender(data)

	// Khởi tạo Puppeteer và tạo PDF
	const getExecutablePath = (() => {
		// return '/usr/bin/google-chrome'

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

	// Trả file PDF cho client
	return new Response(pdfBuffer, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${email}.pdf"`,
		},
	})
})
