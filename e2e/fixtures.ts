import type { Page } from '@playwright/test'

export const isoRecruit = {
	id: 3,
	semester: 15,
	startDate: '2026-09-01',
	endDate: '2026-09-15',
	firstResultDate: '2026-09-16',
	interviewStartDate: '2026-09-20',
	interviewEndDate: '2026-09-21',
	finalResultDate: '2026-09-22',
	orientationDate: '2026-09-24',
}
export const legacyRecruit = {
	...isoRecruit,
	...Object.fromEntries(
		Object.entries(isoRecruit)
			.filter(([, value]) => typeof value === 'string')
			.map(([key, value]) => [
				key,
				`${String(value).slice(5, 7)}월${String(value).slice(8, 10)}일`,
			]),
	),
}
export const fakeToken = (admin = false) =>
	`header.${Buffer.from(JSON.stringify({ userProfile: { id: 7, name: '김연골', adminStatus: admin, memberStatus: true }, exp: 9999999999 })).toString('base64url')}.signature`

export async function mockApi(
	page: Page,
	options: {
		authenticated?: boolean
		admin?: boolean
		signup?: boolean
		available?: boolean
		failSubmission?: boolean
	} = {},
) {
	const requests: {
		path: string
		method: string
		body: Record<string, unknown> | null
		authorization?: string
	}[] = []
	const errors: string[] = []
	page.on('pageerror', (error) => errors.push(error.message))
	page.on('console', (message) => {
		if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:'))
			errors.push(message.text())
	})
	let board = {
		id: 1,
		writerId: 7,
		writer: '김연골',
		category: 'FREE',
		title: '정기 활동 안내',
		content: '첫째 줄\n<img src=x onerror=alert(1)>',
		createdAt: '2026-09-14 10:00',
		replies: {
			replies: [
				{
					id: 2,
					writerId: 7,
					writer: '김연골',
					content: '함께해요',
					createdAt: '2026-09-14 10:10',
				},
			],
		},
	}
	let template = { id: 2, title: '모집 공지 양식', contents: '지원 기간 안내입니다.' }
	let userClass = 'YB'
	let recruits = [legacyRecruit, { ...legacyRecruit, id: 2, semester: 14 }]
	let times = [{ id: 4, interviewDateTime: '2026-09-20 10:00' }]
	let application = {
		id: 9,
		semester: 15,
		name: '지원자',
		photo: null,
		birthDate: '2003-01-01',
		studentId: 2023123456,
		email: 'applicant@example.com',
		major: '경영학과',
		phoneNumber: '01012345678',
		selfIntroduction: '자기소개\n두 번째 줄',
		applyReason: '지원 동기',
		skillEvaluation: '초보',
		golfMemory: '첫 라운딩',
		activities: [],
		swingVideo: 'https://www.youtube.com/watch?v=example',
		submitTime: '2026-09-14 10:00',
		documentPass: null as boolean | null,
		finalPass: null as boolean | null,
		interviewTime: null as string | null,
		availableInterviewTimes: times,
	}
	await page.route('**/upload/photo', (route) => {
		requests.push({
			path: '/upload/photo',
			method: route.request().method(),
			body: null,
			authorization: route.request().headers().authorization,
		})
		return route.fulfill({ status: 200 })
	})
	await page.route('**/api/**', async (route) => {
		const request = route.request()
		const url = new URL(request.url())
		const path = url.pathname.replace(/^\/api/, '')
		const method = request.method()
		const body = request.postData() ? (request.postDataJSON() as Record<string, unknown>) : null
		requests.push({
			path: `${path}${url.search}`,
			method,
			body,
			authorization: request.headers().authorization,
		})
		const ok = (data: unknown = null) =>
			route.fulfill({ json: { status: 'success', code: 200, message: '성공', data } })
		const fail = (message: string, status = 400, code = status) =>
			route.fulfill({ status, json: { status: 'fail', code, message } })
		const paged = (content: unknown[], totalPages = 1) => ({
			content,
			totalElements: content.length,
			totalPages: content.length ? totalPages : 0,
			number: Number(url.searchParams.get('page') || 0),
		})
		if (path === '/users/signIn/refresh')
			return options.authenticated || options.admin
				? ok({ accessToken: fakeToken(options.admin) })
				: fail('로그인이 필요합니다.', 401, 40102)
		if (path === '/users/loggedIn' || path === '/users/logout' || path === '/users/signUp')
			return ok()
		if (path === '/oauth/kakao') return ok({ accessToken: 'temporary-kakao-token' })
		if (path === '/users/signIn')
			return options.signup
				? fail('회원가입이 필요합니다.', 401)
				: ok({ accessToken: fakeToken(options.admin) })
		if (path === '/application/availability') return ok(options.available ?? true)
		if (path === '/application/recruit' || (path === '/admin/recruit' && method === 'GET'))
			return ok(recruits[0])
		if (path === '/admin/recruits') return ok(recruits)
		if (/^\/(application|admin)\/recruit\/\d+\/interview-times$/.test(path)) {
			if (method === 'GET') return ok(times)
			times.push({
				id: 5,
				interviewDateTime: String(body?.interviewDateTime).replace('T', ' ').slice(0, 16),
			})
			return ok()
		}
		if (/^\/admin\/interview-times\/\d+$/.test(path)) {
			if (method === 'DELETE')
				times = times.filter((item) => item.id !== Number(path.split('/').at(-1)))
			else
				times = times.map((item) =>
					item.id === Number(path.split('/').at(-1))
						? {
								...item,
								interviewDateTime: String(body?.interviewDateTime).replace('T', ' ').slice(0, 16),
							}
						: item,
				)
			return ok()
		}
		if (/^\/admin\/recruit(?:\/\d+)?$/.test(path)) {
			if (method === 'DELETE')
				recruits = recruits.filter((item) => item.id !== Number(path.split('/').at(-1)))
			else if (method === 'POST') recruits = [{ ...isoRecruit, ...body, id: 10 }, ...recruits]
			else
				recruits = recruits.map((item) =>
					item.id === Number(path.split('/').at(-1)) ? { ...item, ...body } : item,
				)
			return ok()
		}
		if (path === '/apply/forms/image/presigned-url')
			return ok({
				uploadUrl: 'http://localhost:4173/upload/photo',
				imageKey: 'store-image/photo.png',
				uploadHeaders: { 'Content-Type': 'image/png' },
			})
		if (path === '/application')
			return options.failSubmission ? fail('이미 제출한 지원서입니다.') : ok()
		if (path === '/application/emailAlarm' || path === '/application/email-confirmation')
			return ok()
		if (path === '/boards')
			return method === 'GET'
				? ok(paged(url.searchParams.get('category') === 'NOTICE' ? [] : [board], 2))
				: ok()
		if (path === '/boards/1') {
			if (method === 'PATCH') board = { ...board, ...body }
			return method === 'GET' ? ok(board) : ok()
		}
		if (path === '/boards/1/replies') {
			board.replies.replies.push({
				id: 3,
				writerId: 7,
				writer: '김연골',
				content: String(body?.content),
				createdAt: '2026-09-14 10:30',
			})
			return ok()
		}
		if (path.startsWith('/replies/')) {
			board.replies.replies = board.replies.replies.filter(
				(item) => item.id !== Number(path.split('/').at(-1)),
			)
			return ok()
		}
		if (path === '/admin/boards/templates')
			return method === 'GET' ? ok({ templates: [template] }) : ok()
		if (path === '/admin/boards/templates/2') {
			if (method === 'PATCH') template = { ...template, ...body }
			return method === 'GET' ? ok(template) : ok()
		}
		if (path === '/admin/users')
			return ok(
				paged(
					url.searchParams.get('userClass') === userClass
						? [
								{
									id: 7,
									name: '김연골',
									phoneNumber: '01012345678',
									studentId: 23,
									major: '경영학과',
									semester: 15,
									userClass,
									role: 'USER',
								},
							]
						: [],
				),
			)
		if (path === '/admin/users/7') {
			userClass = String(body?.userClass)
			return ok()
		}
		if (path === '/admin/forms')
			return ok(
				paged([
					{
						id: 9,
						name: '지원자',
						photo: null,
						interviewTime: application.interviewTime,
						documentPass: false,
						finalPass: false,
					},
				]),
			)
		if (path === '/admin/forms/9') return ok(application)
		if (path === '/admin/forms/9/pass') {
			application = { ...application, ...body }
			return ok()
		}
		if (path === '/admin/forms/9/interviewTime') {
			application.interviewTime = String(body?.time)
			return ok()
		}
		if (path === '/admin/forms/results') return ok()
		if (path === '/admin/email/apply-start-email')
			return method === 'GET'
				? ok({
						emailAlarms: [
							{
								id: 1,
								email: 'waiting@example.com',
								semester: Number(url.searchParams.get('semester')),
							},
						],
					})
				: ok()
		return fail(`미정의 mock API: ${method} ${path}`, 501)
	})
	return { requests, errors }
}

export async function fillApplication(page: Page) {
	await page.getByLabel('지원자 사진', { exact: true }).setInputFiles({
		name: 'photo.png',
		mimeType: 'image/png',
		buffer: Buffer.from(
			'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jZl0AAAAASUVORK5CYII=',
			'base64',
		),
	})
	await page.getByLabel('이름', { exact: true }).fill('지원자')
	await page.getByLabel('이메일', { exact: true }).fill('applicant@example.com')
	await page.getByLabel('전화번호', { exact: true }).fill('01012345678')
	await page.getByLabel('학번', { exact: true }).fill('2023123456')
	await page.getByLabel('전공', { exact: true }).fill('경영학과')
	await page.getByLabel('생년월일', { exact: true }).fill('2003-01-01')
	for (const id of ['selfIntroduction', 'applyReason', 'skillEvaluation', 'golfMemory'])
		await page.locator(`#${id}`).fill('골프를 함께 즐기고 싶습니다.')
	await page.locator('#swingVideo').fill('https://www.youtube.com/watch?v=example')
	await page.getByRole('checkbox', { name: '2026-09-20 10:00' }).check()
}
