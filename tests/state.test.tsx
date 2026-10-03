import { mailTemplateError, previewMail } from '@/components/application/admin/mail'
import { getApplicationStatus } from '@/components/application/admin/status'
import { emptyDates, recruitDateError } from '@/components/applyinfo/admin/recruit'
import { useAction } from '@/hooks/useAction'
import { useQuery } from '@/hooks/useQuery'
import { formatDateTime, toDateTimeInput } from '@/lib/format'
import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

describe('administrative data', () => {
	it('does not prefill datetime inputs with yearless application response dates', () => {
		expect(toDateTimeInput('09월20일 10:30')).toBe('')
		expect(toDateTimeInput('2026-09-20 10:30')).toBe('2026-09-20T10:30')
	})
	it('drops only the seconds from server date-times', () => {
		expect(formatDateTime('2026년 09월 28일 10:05:00')).toBe('2026년 09월 28일 10:05')
		expect(formatDateTime('2026-09-28T10:05:00')).toBe('2026-09-28 10:05')
		expect(formatDateTime('2026-09-28 10:05')).toBe('2026-09-28 10:05')
		expect(formatDateTime('09월28일 10:05')).toBe('09월28일 10:05')
		expect(formatDateTime(null)).toBe('미정')
	})
	it('flags mail placeholders the server rejects and previews only the ones it fills', () => {
		const named = ['{{이름}}']
		expect(mailTemplateError({ subject: '{{이름}}님 결과', body: '{{이름}}님' }, named)).toBe('')
		expect(
			mailTemplateError({ subject: '결과', body: '{{이룸}} {{이룸}} {{ 이름 }}' }, named),
		).toBe('이 메일에서 쓸 수 없는 변수입니다: {{이룸}}, {{ 이름 }}')
		expect(mailTemplateError({ subject: '모집', body: '{{이름}}님' }, [])).toBe(
			'이 메일에서 쓸 수 없는 변수입니다: {{이름}}',
		)
		expect(mailTemplateError({ subject: ' ', body: '본문' }, named)).toBe('제목을 입력해 주세요.')
		expect(mailTemplateError({ subject: '제목', body: '\n' }, named)).toBe('본문을 입력해 주세요.')
		expect(previewMail('{{이름}}님, {{이름}}님', named)).toBe('홍길동님, 홍길동님')
		expect(previewMail('{{이름}}님', [])).toBe('{{이름}}님')
	})
	it.each([
		[null, null, 'pending'],
		[true, null, 'documentPass'],
		[true, true, 'finalPass'],
		[true, false, 'finalFail'],
		[false, null, 'documentFail'],
	] as const)('maps nullable pass flags %s/%s to %s', (documentPass, finalPass, expected) =>
		expect(getApplicationStatus(documentPass, finalPass)).toBe(expected),
	)
	it('does not invent a year for the server’s month/day-only dates', () => {
		expect(recruitDateError({ ...emptyDates, startDate: '09월14일' })).toContain('연도')
		expect(
			recruitDateError({ ...emptyDates, startDate: '2026-09-14', endDate: '2026-09-01' }),
		).toContain('빠를 수 없습니다')
		expect(
			recruitDateError({ ...emptyDates, startDate: '2026-12-30', endDate: '2027-01-04' }),
		).toBe('')
	})
})
it('ignores stale list responses after a filter change and aborts on unmount', async () => {
	const resolvers = new Map<string, (value: string) => void>()
	const signals: AbortSignal[] = []
	const { result, rerender, unmount } = renderHook(
		({ key }) =>
			useQuery(key, (signal) => {
				signals.push(signal)
				return new Promise<string>((resolve) => resolvers.set(key, resolve))
			}),
		{ initialProps: { key: 'first' } },
	)
	rerender({ key: 'second' })
	await act(async () => resolvers.get('second')?.('new data'))
	await waitFor(() => expect(result.current.data).toBe('new data'))
	await act(async () => resolvers.get('first')?.('stale data'))
	expect(result.current.data).toBe('new data')
	expect(signals[0].aborted).toBe(true)
	unmount()
	expect(signals[1].aborted).toBe(true)
})
it('prevents duplicate submissions even before React paints a disabled button', async () => {
	let finish: () => void = () => {}
	const action = vi.fn(
		() =>
			new Promise<void>((resolve) => {
				finish = resolve
			}),
	)
	const { result } = renderHook(useAction)
	let pending: Promise<void>
	act(() => {
		pending = result.current.run(action)
		void result.current.run(action)
	})
	expect(action).toHaveBeenCalledTimes(1)
	await act(async () => {
		finish()
		await pending
	})
	expect(result.current.pending).toBe(false)
})

it('keeps the current view mounted on refresh but clears data when the query key changes', async () => {
	const pending: ((value: string) => void)[] = []
	const { result, rerender } = renderHook(
		({ key }) => useQuery(key, () => new Promise<string>((resolve) => pending.push(resolve))),
		{ initialProps: { key: 'detail:9' } },
	)
	await act(async () => pending[0]('saved'))
	act(() => result.current.reload())
	expect(result.current.loading).toBe(true)
	expect(result.current.data).toBe('saved')
	await act(async () => pending[1]('updated'))
	expect(result.current.data).toBe('updated')
	rerender({ key: 'detail:10' })
	expect(result.current.data).toBeUndefined()
})
