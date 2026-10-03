import { expect, test } from '@playwright/test'
import { mockApi } from './fixtures'

for (const width of [320, 390, 768, 1440]) {
	test(`page layouts remain usable at ${width}px`, async ({ page }, testInfo) => {
		const mock = await mockApi(page, { admin: true })
		await page.setViewportSize({ width, height: 900 })
		const routes = [
			'/',
			'/recruit',
			'/apply',
			'/apply/form',
			'/board',
			'/board/1',
			'/board/post',
			'/admin/users',
			'/admin/form',
			'/application/9',
			'/admin/apply-alarm',
			'/admin/mail-templates',
			'/admin/board/template',
			'/admin/board/template/post',
			'/admin/board/template/2',
			'/admin/apply-period',
		]
		for (const route of routes) {
			await page.goto(route)
			await expect(page.locator('main h1, main h2').first()).toBeVisible()
			await expect(page.locator('main output.status-message')).toHaveCount(0)
			const size = await page.evaluate(() => ({
				viewport: window.innerWidth,
				content: document.documentElement.scrollWidth,
			}))
			expect
				.soft(size.content, `${route} should not overflow horizontally`)
				.toBeLessThanOrEqual(size.viewport + 1)
			if (
				[
					'/',
					'/apply/form',
					'/admin/users',
					'/admin/form',
					'/application/9',
					'/admin/apply-period',
				].includes(route)
			) {
				await page.screenshot({
					path: testInfo.outputPath(`${route.replaceAll('/', '-') || 'home'}.png`),
					fullPage: true,
					animations: 'disabled',
				})
			}
		}
		expect(mock.errors).toEqual([])
	})
}
