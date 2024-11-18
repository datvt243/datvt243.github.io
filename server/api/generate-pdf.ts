import puppeteer from 'puppeteer'
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
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
