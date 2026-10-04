import { expect, test } from '@playwright/test'
import { fakeToken, fillApplication, isoRecruit, mockApi } from './fixtures'

test('public pages retain content, FAQ and navigation on desktop and mobile', async ({ page }) => {
	const mock = await mockApi(page)
	await page.goto('/')
	await expect(page.getByRole('heading', { name: 'YONSEI GOLF' })).toBeVisible()
	await page
		.getByRole('navigation', { name: '주 메뉴' })
		.getByRole('link', { name: '모집안내' })
		.click()
	await expect(page.getByRole('heading', { name: '모집 일정' })).toBeVisible()
	await expect(page.getByText('09월01일 ~ 09월15일')).toBeVisible()
	await page.getByText('Q. 골프를 처음 하는 사람도 지원 가능한가요?', { exact: true }).click()
	await expect(
		page.getByText('A. 골프에 대한 열정이 있고, 레슨 계획만 있으시다면 지원 가능합니다.'),
	).toBeVisible()
	await page.getByRole('tab', { name: '면접', exact: true }).click()
	await expect(page.getByText('Q. 연세 골프 면접은 언제 진행하나요?')).toBeVisible()
	await page.setViewportSize({ width: 390, height: 844 })
	await page.getByRole('button', { name: '메뉴 열기' }).click()
	await page.locator('#mobile-menu').getByRole('link', { name: 'Home', exact: true }).click()
	await expect(page.getByRole('button', { name: '메뉴 열기' })).toHaveAttribute(
		'aria-expanded',
		'false',
	)
	await page.getByRole('button', { name: '다음 활동' }).click()
	await expect(
		page.locator('.carousel-slide').getByRole('button', { name: '신입 환영 MT' }),
	).toBeVisible()
	expect(mock.errors).toEqual([])
	await page.evaluate(() => window.scrollTo(0, 0))
	await page.screenshot({
		path: 'test-results/home-mobile.png',
		fullPage: true,
		animations: 'disabled',
	})
})

test('closed recruitment only offers notification registration and rejects direct form access', async ({
	page,
}) => {
	const mock = await mockApi(page, { available: false })
	await page.goto('/apply/form')
	await expect(page.getByRole('heading', { name: '지금은 모집기간이 아닙니다.' })).toBeVisible()
	await page.getByRole('link', { name: '모집 알림 등록하기' }).click()
	await page.getByLabel('알림 받을 이메일').fill('waiting@example.com')
	await page.getByRole('button', { name: '알림 등록' }).click()
	await expect(page.getByText('알림이 성공적으로 등록되었습니다.')).toBeVisible()
	expect(mock.requests.find((request) => request.path === '/application/emailAlarm')?.body).toEqual(
		{ email: 'waiting@example.com', semester: 0 },
	)
})

for (const available of [false, true]) {
	test(`recruitment banner spans a wide viewport when available is ${available}`, async ({
		page,
	}) => {
		await mockApi(page, { available })
		await page.setViewportSize({ width: 1800, height: 900 })
		await page.goto('/apply')
		await expect(page.locator('main h1').first()).toBeVisible()
		const widths = await page.evaluate(() => ({
			viewport: document.documentElement.clientWidth,
			banner: document.querySelector('.term-container')?.getBoundingClientRect().width,
		}))
		expect(widths.banner).toBe(widths.viewport)
		if (!available) {
			const field = await page.getByLabel('알림 받을 이메일').boundingBox()
			const button = await page.getByRole('button', { name: '알림 등록' }).boundingBox()
			expect(field?.height).toBe(button?.height)
		}
	})
}

test('signup keeps the temporary token through a reload and sends typed fields', async ({
	page,
}) => {
	const mock = await mockApi(page, { signup: true })
	await page.goto('/oauth/kakao?code=new-user')
	await expect(page).toHaveURL(/\/signup$/)
	await page.reload()
	await page.getByLabel('이름', { exact: true }).fill('김연골')
	await page.getByLabel('전화번호').fill('01012345678')
	await page.getByLabel('학번', { exact: true }).fill('23')
	await page.getByLabel('학과', { exact: true }).fill('경영학과')
	await page.getByLabel('연세골프 기수').fill('15')
	await page.getByRole('button', { name: '회원가입', exact: true }).click()
	await expect(page).toHaveURL(/\/login$/)
	const request = mock.requests.find((request) => request.path === '/users/signUp')
	expect(request?.authorization).toBe('Bearer temporary-kakao-token')
	expect(request?.body).toMatchObject({ studentId: 23, semester: 15 })
	expect(mock.requests.filter((request) => request.path === '/oauth/kakao')).toHaveLength(1)
})

test('existing login restores admin access after reload and logout clears authorization', async ({
	page,
}) => {
	await mockApi(page, { admin: true })
	await page.goto('/oauth/kakao?code=existing-user')
	await expect(page).toHaveURL('/')
	await page.goto('/admin/users')
	await expect(page.getByRole('heading', { name: '어드민 페이지' })).toBeVisible()
	await page.reload()
	await expect(page.getByRole('heading', { name: '어드민 페이지' })).toBeVisible()
	await page.getByRole('button', { name: '로그아웃' }).click()
	await expect(
		page.getByRole('navigation', { name: '주 메뉴' }).getByRole('link', { name: '로그인' }),
	).toBeVisible()
	expect(await page.evaluate(() => sessionStorage.getItem('accessToken'))).toBeNull()
})

test('all administrator routes, including the legacy application URL, are guarded', async ({
	page,
}) => {
	const mock = await mockApi(page, { authenticated: true })
	const paths = [
		'/admin',
		'/admin/users',
		'/admin/form',
		'/application/9',
		'/admin/apply/form',
		'/admin/apply-alarm',
		'/admin/mail-templates',
		'/admin/board/template',
		'/admin/board/template/post',
		'/admin/board/template/2',
		'/admin/apply-period',
	]
	for (const path of paths) {
		await page.goto(path)
		await expect(page.getByRole('heading', { name: '권한이 없습니다' })).toBeVisible()
	}
	expect(mock.requests.filter((request) => request.path.startsWith('/admin/'))).toHaveLength(0)
	expect(mock.errors).toEqual([])
})

test('application uploads a photo, sends a confirmation mail and submits the server DTO once', async ({
	page,
}) => {
	const mock = await mockApi(page)
	await page.goto('/apply/form')
	await fillApplication(page)
	await page.getByRole('button', { name: '이메일 확인', exact: true }).click()
	await expect(page.getByRole('button', { name: '발송 완료' })).toBeDisabled()
	await page.getByRole('button', { name: '지원서 제출', exact: true }).click()
	await page.getByRole('alertdialog').getByRole('button', { name: '확인', exact: true }).click()
	await expect(page.getByRole('heading', { name: '지원서가 제출되었습니다.' })).toBeVisible()
	const requests = mock.requests.filter((request) => request.path === '/application')
	expect(requests).toHaveLength(1)
	expect(requests[0].body).toMatchObject({
		photoKey: 'store-image/photo.png',
		semester: 15,
		studentId: 2023123456,
		phoneNumber: '01012345678',
		availableInterviewTimeIds: [4],
		activityClubs: [],
	})
	expect(
		mock.requests.find((request) => request.path === '/upload/photo')?.authorization,
	).toBeUndefined()
	expect(mock.errors).toEqual([])
})

test('clicking anywhere on the photo box opens the file chooser', async ({ page }) => {
	await mockApi(page)
	await page.goto('/apply/form')
	for (const text of ['👤', '지원자 사진', '클릭하여 업로드 (10MB 이하)']) {
		const box = await page.getByText(text, { exact: true }).boundingBox()
		if (!box) throw new Error(`${text} is not visible`)
		const chooser = page.waitForEvent('filechooser', { timeout: 3000 })
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
		await chooser
	}
})

test('administrator preview uploads a photo and submits a test application for the chosen semester', async ({
	page,
}) => {
	const mock = await mockApi(page, { admin: true, available: false })
	await page.goto('/admin/apply/form')
	await page.getByLabel('테스트 제출 기수').click()
	await page.getByRole('option', { name: '14기', exact: true }).click()
	await expect(page.getByText('테스트 제출 모드입니다.', { exact: false })).toBeVisible()
	await fillApplication(page)
	await expect(page.getByRole('img', { name: '지원자 사진' })).toBeVisible()
	await page.getByRole('button', { name: '지원서 제출', exact: true }).click()
	await expect(page.getByRole('alertdialog')).toContainText('14기 테스트 지원서')
	await page.getByRole('alertdialog').getByRole('button', { name: '확인', exact: true }).click()
	await expect(page.getByRole('heading', { name: '테스트 지원서가 제출되었습니다.' })).toBeVisible()
	expect(mock.requests.some((request) => request.path === '/upload/photo')).toBe(true)
	expect(
		mock.requests.some((request) => request.path === '/application/recruit/2/interview-times'),
	).toBe(true)
	const requests = mock.requests.filter((request) => request.path === '/application')
	expect(requests).toHaveLength(1)
	expect(requests[0].body).toMatchObject({
		photoKey: 'store-image/photo.png',
		semester: 14,
		availableInterviewTimeIds: [4],
	})
	expect(mock.errors).toEqual([])
})

test('failed application submission keeps the form and displays the server error', async ({
	page,
}) => {
	await mockApi(page, { failSubmission: true })
	await page.goto('/apply/form')
	await fillApplication(page)
	await page.getByRole('button', { name: '지원서 제출', exact: true }).click()
	await page.getByRole('alertdialog').getByRole('button', { name: '확인', exact: true }).click()
	await expect(page.getByText('이미 제출한 지원서입니다.')).toBeVisible()
	await expect(page.getByLabel('이름', { exact: true })).toHaveValue('지원자')
	await expect(page).toHaveURL(/\/apply\/form$/)
})

test('board filters reset pagination and content is rendered as text', async ({ page }) => {
	await mockApi(page)
	await page.goto('/board')
	await page.getByRole('button', { name: '다음', exact: true }).click()
	await expect(page.getByText('2 / 2')).toBeVisible()
	await page.getByRole('tab', { name: '공지', exact: true }).click()
	await expect(page.getByText('등록된 게시글이 없습니다.')).toBeVisible()
	await expect(page.getByRole('button', { name: '다음', exact: true })).toBeDisabled()
	await page.goto('/board/1')
	await expect(page.getByText('<img src=x onerror=alert(1)>', { exact: false })).toBeVisible()
	await expect(page.locator('.detail-content img')).toHaveCount(0)
	await page.goto('/board/post')
	await expect(page).toHaveURL(/\/login$/)
})

test('board author can edit, comment and delete after confirmation', async ({ page }) => {
	const mock = await mockApi(page, { authenticated: true })
	await page.goto('/board/1')
	await page.getByRole('button', { name: '수정', exact: true }).click()
	await page.getByLabel('제목', { exact: true }).fill('수정한 제목')
	await page.getByRole('button', { name: '저장', exact: true }).click()
	await expect(page.getByRole('heading', { name: '수정한 제목' })).toBeVisible()
	await page.getByLabel('댓글', { exact: true }).fill('새 댓글')
	await page.getByRole('button', { name: '댓글 등록' }).click()
	await expect(page.getByText('새 댓글', { exact: true })).toBeVisible()
	await page.getByRole('button', { name: '삭제', exact: true }).click()
	await page.getByRole('alertdialog').getByRole('button', { name: '취소', exact: true }).click()
	expect(mock.requests.filter((request) => request.method === 'DELETE')).toHaveLength(0)
	await page.getByRole('button', { name: '삭제', exact: true }).click()
	await page.getByRole('alertdialog').getByRole('button', { name: '확인', exact: true }).click()
	await expect(page).toHaveURL(/\/board$/)
	expect(mock.errors).toEqual([])
})

test('administrator can change user class and submit a board using a template', async ({
	page,
}) => {
	const mock = await mockApi(page, { admin: true })
	await page.goto('/admin/users')
	await page.getByLabel('김연골 회원 구분').click()
	await page.getByRole('option', { name: 'OB', exact: true }).click()
	await page.getByRole('alertdialog').getByRole('button', { name: '확인', exact: true }).click()
	await expect(
		page.getByRole('region', { name: 'OB', exact: true }).getByText('김연골'),
	).toBeVisible()
	await page.goto('/board/post')
	await page.getByLabel('게시글 템플릿', { exact: true }).click()
	await page.getByRole('option', { name: '모집 공지 양식', exact: true }).click()
	await expect(page.getByLabel('제목', { exact: true })).toHaveValue('모집 공지 양식')
	await page.getByRole('button', { name: '게시글 등록', exact: true }).click()
	await expect(page).toHaveURL(/\/board$/)
	expect(
		mock.requests.find((request) => request.path === '/boards' && request.method === 'POST')?.body,
	).toEqual({ title: '모집 공지 양식', content: '지원 기간 안내입니다.', category: 'FREE' })
})

test('application management preserves nullable pass states, interview format and email scope', async ({
	page,
}) => {
	const mock = await mockApi(page, { admin: true })
	await page.goto('/admin/form')
	await page.getByLabel('지원 기수:').click()
	await page.getByRole('option', { name: '14기', exact: true }).click()
	await expect(
		page.getByRole('region', { name: '지원 접수' }).getByRole('link', { name: '지원자' }),
	).toBeVisible()
	expect(mock.requests.some((request) => request.path.includes('semester=14'))).toBe(true)
	const received = page.getByRole('region', { name: '지원 접수' })
	await expect(received.getByRole('columnheader', { name: '접수 메일' })).toBeVisible()
	await expect(received.getByRole('cell', { name: /발송됨\s*2026-09-14 10:00/ })).toBeVisible()
	const firstPass = page.getByRole('region', { name: '1차 합격' })
	await expect(firstPass.getByRole('columnheader', { name: '결과 메일' })).toBeVisible()
	await expect(firstPass.getByRole('cell', { name: '미발송' })).toBeVisible()
	await page.getByRole('button', { name: '전체 기수 1차 합격 메일 보내기' }).click()
	await expect(page.getByRole('alertdialog')).toContainText('전체 기수')
	await page.getByRole('alertdialog').getByRole('button', { name: '취소', exact: true }).click()
	expect(mock.requests.filter((request) => request.path === '/admin/forms/results')).toHaveLength(0)
	await page.goto('/application/9')
	await expect(page.getByLabel('합격 여부')).toHaveText('보류')
	await page.getByLabel('합격 여부').click()
	await page.getByRole('option', { name: '서류 합격', exact: true }).click()
	await page.getByRole('alertdialog').getByRole('button', { name: '확인', exact: true }).click()
	await expect(page.getByLabel('합격 여부')).toHaveText('서류 합격')
	expect(mock.requests.find((request) => request.path.endsWith('/pass'))?.body).toEqual({
		documentPass: true,
		finalPass: null,
	})
	await page.getByRole('button', { name: '면접 시간 변경', exact: true }).click()
	await page.getByRole('dialog').getByLabel('면접 일시').fill('2026-09-20T10:30')
	await page.getByRole('dialog').getByRole('button', { name: '면접 시간 변경' }).click()
	await expect(page.getByText('2026-09-20 10:30', { exact: true })).toBeVisible()
})

test('recruitment editing requires explicit years and interview times use ISO request values', async ({
	page,
}) => {
	const mock = await mockApi(page, { admin: true })
	await page.goto('/admin/apply-period')
	await page.getByRole('button', { name: '15기', exact: true }).click()
	await expect(page.getByText('저장된 일정: 09월01일')).toBeVisible()
	await expect(
		page.locator('.form-section').getByRole('button', { name: '수정', exact: true }),
	).toBeDisabled()
	for (const [key, value] of Object.entries(isoRecruit))
		if (typeof value === 'string') await page.locator(`#recruit-${key}`).fill(value)
	await page.getByLabel('새 면접 일시').fill('2026-09-21T11:00')
	await page.getByRole('button', { name: '+ 추가', exact: true }).click()
	await page.getByRole('alertdialog').getByRole('button', { name: '확인', exact: true }).click()
	await expect(page.getByText('2026-09-21 11:00', { exact: true })).toBeVisible()
	await page.locator('.form-section').getByRole('button', { name: '수정', exact: true }).click()
	await page.getByRole('alertdialog').getByRole('button', { name: '확인', exact: true }).click()
	await expect(page.locator('.form-section')).toHaveCount(0)
	expect(
		mock.requests.find(
			(request) => request.path === '/admin/recruit/3' && request.method === 'PATCH',
		)?.body,
	).toMatchObject({ startDate: '2026-09-01', semester: 15 })
	expect(
		mock.requests.find(
			(request) => request.path.endsWith('/interview-times') && request.method === 'POST',
		)?.body,
	).toEqual({ interviewDateTime: '2026-09-21T11:00:00' })
})

test('template creation route is not interpreted as an ID, and templates can be edited', async ({
	page,
}) => {
	const mock = await mockApi(page, { admin: true })
	await page.goto('/admin/board/template/post')
	await page.getByLabel('템플릿 제목').fill('새 템플릿')
	await page.getByLabel('템플릿 내용').fill('본문')
	await page.getByRole('button', { name: '템플릿 등록' }).click()
	await expect(page).toHaveURL(/\/admin\/board\/template$/)
	expect(mock.requests.some((request) => request.path === '/admin/boards/templates/post')).toBe(
		false,
	)
	await page.getByRole('link', { name: '모집 공지 양식' }).click()
	await page.getByRole('button', { name: '수정', exact: true }).click()
	await page.getByLabel('템플릿 내용').fill('수정한 본문')
	await page.getByRole('button', { name: '저장', exact: true }).click()
	await expect(page.getByText('수정한 본문', { exact: true })).toBeVisible()
	expect(mock.requests.find((request) => request.method === 'PATCH')?.body).toEqual({
		title: '모집 공지 양식',
		contents: '수정한 본문',
	})
})

test('alarm query parameters and administrator preview remain usable', async ({ page }) => {
	const mock = await mockApi(page, { admin: true })
	await page.goto('/admin/apply-alarm?semester=10')
	await expect(page.getByLabel('기수 선택:')).toHaveText('10기')
	await page.getByLabel('기수 선택:').click()
	await page.getByRole('option', { name: '기수 미지정 (0)', exact: true }).click()
	await expect(page).toHaveURL(/semester=0/)
	await page.getByRole('button', { name: '전체 미발송 대기자에게 메일 보내기' }).click()
	await expect(page.getByRole('alertdialog')).toContainText('전체 기수')
	await page.getByRole('alertdialog').getByRole('button', { name: '취소', exact: true }).click()
	await page.goto('/admin/apply/form')
	await expect(page.getByText('지원서 양식 미리보기입니다.', { exact: false })).toBeVisible()
	await expect(page.getByRole('button', { name: '지원서 제출' })).toBeDisabled()
	expect(
		mock.requests.filter(
			(request) => request.path === '/admin/email/apply-start-email' && request.method === 'POST',
		),
	).toHaveLength(0)
	expect(mock.errors).toEqual([])
	expect(await page.evaluate(() => sessionStorage.getItem('accessToken'))).toBe(fakeToken(true))
})

test('mail templates preview the applicant name, guard unsaved edits, save and reset', async ({
	page,
}) => {
	const mock = await mockApi(page, { admin: true })
	await page.goto('/admin/apply-alarm')
	await page.getByRole('link', { name: '보낼 문구 확인·수정' }).click()
	await expect(page).toHaveURL(/\/admin\/mail-templates\?type=RECRUITMENT_START$/)
	await expect(page.getByRole('heading', { name: '모집 시작 알림' })).toBeVisible()
	await expect(page.getByText('이름을 알 수 없어', { exact: false })).toBeVisible()
	const kinds = page.getByRole('navigation', { name: '메일 종류' })
	await kinds.getByRole('button', { name: '서류 합격' }).click()
	await expect(page.getByRole('heading', { name: '서류 합격' })).toBeVisible()
	const body = page.getByLabel('본문', { exact: true })
	await body.fill('축하드립니다 ')
	await page.getByRole('button', { name: '본문에 {{이름}} 넣기' }).click()
	await expect(body).toHaveValue('축하드립니다 {{이름}}')
	await expect(page.getByRole('region', { name: '미리보기' })).toContainText('축하드립니다 홍길동')
	await body.fill('{{이룸}}님 축하드립니다')
	await expect(page.getByText('이 메일에서 쓸 수 없는 변수입니다: {{이룸}}')).toBeVisible()
	await expect(page.getByRole('button', { name: '저장', exact: true })).toBeDisabled()
	await body.fill('{{이름}}님 서류 합격을 축하드립니다.\n면접은 문자로 안내드립니다.')
	await kinds.getByRole('button', { name: '최종 합격' }).click()
	await expect(page.getByRole('alertdialog')).toContainText('저장하지 않은 변경 내용')
	await page.getByRole('alertdialog').getByRole('button', { name: '취소', exact: true }).click()
	await expect(body).toHaveValue(
		'{{이름}}님 서류 합격을 축하드립니다.\n면접은 문자로 안내드립니다.',
	)
	await page.getByRole('button', { name: '저장', exact: true }).click()
	await page.getByRole('alertdialog').getByRole('button', { name: '확인', exact: true }).click()
	await expect(page.getByText('저장했습니다.', { exact: false })).toBeVisible()
	await expect(page.getByText('수정한 문구 사용 중')).toBeVisible()
	await expect(kinds.getByRole('button', { name: /서류 합격.*수정됨/ })).toBeVisible()
	expect(mock.requests.find((request) => request.method === 'PATCH')).toMatchObject({
		path: '/admin/email/templates/DOCUMENT_PASS',
		body: {
			subject: '연세골프 결과 메일입니다.',
			body: '{{이름}}님 서류 합격을 축하드립니다.\n면접은 문자로 안내드립니다.',
		},
	})
	await page.getByRole('button', { name: '기본 문구로 되돌리기' }).click()
	await page.getByRole('alertdialog').getByRole('button', { name: '확인', exact: true }).click()
	await expect(page.getByText('기본 문구 사용 중')).toBeVisible()
	await expect(body).toHaveValue('{{이름}}님 서류 합격 축하드립니다.')
	expect(mock.requests.find((request) => request.method === 'DELETE')?.path).toBe(
		'/admin/email/templates/DOCUMENT_PASS',
	)
	expect(mock.errors).toEqual([])
})
