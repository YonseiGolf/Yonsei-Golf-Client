import { expect, test } from '@playwright/test'
import { mockApi } from './fixtures'

test('FAQ tabs and accordions work with the keyboard and retain expanded answers', async ({
	page,
}) => {
	const mock = await mockApi(page)
	await page.goto('/recruit')
	const firstTab = page.getByRole('tab', { name: '지원자격', exact: true })
	await firstTab.focus()
	await firstTab.press('ArrowRight')
	await expect(page.getByRole('tab', { name: '면접', exact: true })).toBeFocused()
	await expect(page.getByRole('tab', { name: '면접', exact: true })).toHaveAttribute(
		'aria-selected',
		'true',
	)
	await page.keyboard.press('Home')
	const question = page.getByRole('button', {
		name: 'Q. 골프를 처음 하는 사람도 지원 가능한가요?',
		exact: true,
	})
	await question.focus()
	await question.press('Enter')
	await expect(question).toHaveAttribute('aria-expanded', 'true')
	await page.getByRole('tab', { name: '활동', exact: true }).click()
	await firstTab.click()
	await expect(question).toHaveAttribute('aria-expanded', 'true')
	await page.setViewportSize({ width: 390, height: 844 })
	await page.evaluate(() => window.scrollTo(0, 0))
	await page.screenshot({
		path: 'test-results/shadcn-faq-mobile.png',
		fullPage: true,
		animations: 'disabled',
	})
	expect(mock.errors).toEqual([])
})

test('mobile Sheet traps focus, closes on Escape and returns focus to its trigger', async ({
	page,
}) => {
	const mock = await mockApi(page)
	await page.setViewportSize({ width: 390, height: 844 })
	await page.goto('/')
	const trigger = page.getByRole('button', { name: '메뉴 열기' })
	await trigger.focus()
	await trigger.press('Enter')
	const sheet = page.getByRole('dialog', { name: '연세골프 메뉴' })
	await expect(sheet).toBeVisible()
	for (let index = 0; index < 8; index++) {
		await page.keyboard.press('Tab')
		await expect(sheet.locator(':focus')).toHaveCount(1)
	}
	await page.screenshot({ path: 'test-results/shadcn-menu-mobile.png', animations: 'disabled' })
	await page.keyboard.press('Escape')
	await expect(sheet).not.toBeVisible()
	await expect(trigger).toBeFocused()
	await trigger.press('Enter')
	await page.setViewportSize({ width: 1440, height: 900 })
	await expect(sheet).not.toBeVisible()
	await expect(page.locator('body')).not.toHaveAttribute('data-scroll-locked')
	expect(mock.errors).toEqual([])
})

test('keyboard selection followed by AlertDialog cancellation leaves the user unchanged', async ({
	page,
}) => {
	const mock = await mockApi(page, { admin: true })
	await page.goto('/admin/users')
	const select = page.getByRole('combobox', { name: '김연골 회원 구분' })
	await select.focus()
	await select.press('Enter')
	await expect(page.getByRole('option', { name: 'YB', exact: true })).toBeFocused()
	await page.keyboard.press('End')
	await expect(page.getByRole('option', { name: '블랙리스트', exact: true })).toBeFocused()
	await page.keyboard.press('Enter')
	const confirmation = page.getByRole('alertdialog')
	await expect(confirmation).toContainText('BLACK_LIST')
	await expect(confirmation.getByRole('button', { name: '취소', exact: true })).toBeFocused()
	await page.keyboard.press('Escape')
	await expect(confirmation).not.toBeVisible()
	await expect(select).toHaveText('YB')
	await expect(select).toBeFocused()
	expect(mock.requests.filter((request) => request.method === 'PATCH')).toHaveLength(0)
	expect(mock.errors).toEqual([])
})

test('interview Dialog returns focus and does not close while a save is pending', async ({
	page,
}) => {
	const mock = await mockApi(page, { admin: true })
	await page.goto('/application/9')
	const trigger = page.getByRole('button', { name: '면접 시간 변경', exact: true })
	await trigger.click()
	let dialog = page.getByRole('dialog', { name: '면접 시간 변경' })
	await expect(dialog.getByLabel('면접 일시')).toBeFocused()
	await page.keyboard.press('Escape')
	await expect(dialog).not.toBeVisible()
	await expect(trigger).toBeFocused()
	await trigger.click()
	dialog = page.getByRole('dialog', { name: '면접 시간 변경' })
	await dialog.getByLabel('면접 일시').fill('2026-09-21T14:30')
	let finish: (() => Promise<void>) | undefined
	await page.route('**/api/admin/forms/9/interviewTime', (route) => {
		finish = () =>
			route.fulfill({ json: { status: 'success', code: 200, message: '성공', data: null } })
	})
	await dialog.getByRole('button', { name: '면접 시간 변경' }).click()
	await expect.poll(() => Boolean(finish)).toBe(true)
	await page.keyboard.press('Escape')
	await expect(dialog).toBeVisible()
	await expect(dialog.getByRole('button', { name: '닫기', exact: true })).toBeDisabled()
	await finish?.()
	await expect(dialog).not.toBeVisible()
	await expect(trigger).toBeFocused()
	expect(mock.errors).toEqual([])
})

test('customized primitives retain the marketing cards and Kakao brand color', async ({ page }) => {
	const mock = await mockApi(page)
	await page.goto('/')
	const cards = page.locator('.desktop-cards [data-slot="button"]')
	await expect(cards).toHaveCount(4)
	for (const card of await cards.all()) {
		const size = await card.boundingBox()
		expect(size?.height).toBeGreaterThanOrEqual(200)
	}
	await page.goto('/login')
	const kakao = page.getByRole('button', { name: '카카오로 3초 만에 시작하기' })
	await expect(kakao).toHaveCSS('background-color', 'rgb(255, 235, 59)')
	await page.screenshot({
		path: 'test-results/shadcn-login.png',
		fullPage: true,
		animations: 'disabled',
	})
	expect(mock.errors).toEqual([])
})

test('choosing a template with Enter does not implicitly submit the board form', async ({
	page,
}) => {
	const mock = await mockApi(page, { admin: true })
	await page.goto('/board/post')
	await page.getByLabel('제목', { exact: true }).fill('직접 입력한 제목')
	await page.getByLabel('내용', { exact: true }).fill('직접 입력한 본문')
	const select = page.getByRole('combobox', { name: '게시글 템플릿' })
	await select.focus()
	await select.press('Enter')
	await expect(page.getByRole('option', { name: '템플릿 없음', exact: true })).toBeFocused()
	await page.keyboard.press('End')
	await expect(page.getByRole('option', { name: '모집 공지 양식', exact: true })).toBeFocused()
	await page.keyboard.press('Enter')
	await expect(page.getByLabel('제목', { exact: true })).toHaveValue('모집 공지 양식')
	await expect(select).toBeFocused()
	await expect(page).toHaveURL(/\/board\/post$/)
	expect(
		mock.requests.filter((request) => request.path === '/boards' && request.method === 'POST'),
	).toHaveLength(0)
	expect(mock.errors).toEqual([])
})
