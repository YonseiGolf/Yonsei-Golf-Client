import { api, queryString, refreshSession } from '@/lib/api'
import { useAuthStore } from '@/store'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fail, member, ok, tokenFor } from './fixtures'

beforeEach(() => useAuthStore.getState().clearSession())
afterEach(() => vi.unstubAllGlobals())

describe('server API and session renewal', () => {
	it('does not restore a session cleared while a refresh request was pending', async () => {
		useAuthStore.getState().setSession(tokenFor())
		let finish: (value: Response) => void = () => {}
		vi.stubGlobal(
			'fetch',
			vi.fn(
				() =>
					new Promise<Response>((resolve) => {
						finish = resolve
					}),
			),
		)
		const pending = refreshSession()
		useAuthStore.getState().clearSession()
		finish(ok({ accessToken: tokenFor() }))
		await pending
		expect(useAuthStore.getState().user).toBeNull()
		expect(sessionStorage.getItem('accessToken')).toBeNull()
	})
	it('sends JSON, a bearer token and refresh-cookie credentials', async () => {
		const fetcher = vi.fn().mockResolvedValue(ok({ id: 1 }))
		vi.stubGlobal('fetch', fetcher)
		useAuthStore.getState().setSession(tokenFor())
		expect(await api('/boards', { method: 'POST', body: { title: '제목' } })).toEqual({ id: 1 })
		const options = fetcher.mock.calls[0][1]
		expect(options.headers.get('Authorization')).toBe(`Bearer ${tokenFor()}`)
		expect(options.credentials).toBe('include')
		expect(JSON.parse(options.body)).toEqual({ title: '제목' })
	})
	it('never attaches the user token to public requests', async () => {
		useAuthStore.getState().setSession(tokenFor())
		const fetcher = vi.fn().mockResolvedValue(ok(false))
		vi.stubGlobal('fetch', fetcher)
		expect(await api('/application/availability', { auth: false })).toBe(false)
		expect(fetcher.mock.calls[0][1].headers.has('Authorization')).toBe(false)
	})
	it('deduplicates parallel expired-token refreshes and retries both requests', async () => {
		const old = tokenFor()
		const fresh = tokenFor({ ...member, name: '갱신됨' })
		useAuthStore.getState().setSession(old)
		let finishRefresh: (value: Response) => void = () => {}
		const fetcher = vi.fn(async (path: string, options: RequestInit) => {
			if (path.endsWith('/users/signIn/refresh'))
				return new Promise<Response>((resolve) => {
					finishRefresh = resolve
				})
			if (new Headers(options.headers).get('Authorization') === `Bearer ${old}`)
				return fail(401, 40101)
			return ok({ refreshed: true })
		})
		vi.stubGlobal('fetch', fetcher)
		const results = Promise.all([api('/admin/users'), api('/admin/recruits')])
		await vi.waitFor(() =>
			expect(
				fetcher.mock.calls.filter(([url]) => url.endsWith('/users/signIn/refresh')),
			).toHaveLength(1),
		)
		finishRefresh(ok({ accessToken: fresh }))
		expect(await results).toEqual([{ refreshed: true }, { refreshed: true }])
		expect(useAuthStore.getState().user?.name).toBe('갱신됨')
		expect(fetcher).toHaveBeenCalledTimes(5)
	})
	it('does not refresh signup errors and preserves the temporary token', async () => {
		sessionStorage.setItem('signupToken', 'temporary')
		const fetcher = vi.fn().mockResolvedValue(fail(401, 401, '이미 가입된 회원'))
		vi.stubGlobal('fetch', fetcher)
		await expect(
			api('/users/signUp', { method: 'POST', auth: false, token: 'temporary' }),
		).rejects.toMatchObject({ status: 401, message: '이미 가입된 회원' })
		expect(fetcher).toHaveBeenCalledTimes(1)
		expect(sessionStorage.getItem('signupToken')).toBe('temporary')
	})
	it('stops after one renewal if the replacement token is also rejected', async () => {
		useAuthStore.getState().setSession(tokenFor())
		const fetcher = vi
			.fn()
			.mockImplementation((path: string) =>
				Promise.resolve(
					path.endsWith('/refresh')
						? ok({ accessToken: tokenFor({ ...member, name: '새 토큰' }) })
						: fail(401, 40101),
				),
			)
		vi.stubGlobal('fetch', fetcher)
		await expect(api('/admin/users')).rejects.toMatchObject({ status: 401 })
		expect(fetcher).toHaveBeenCalledTimes(3)
		expect(sessionStorage.getItem('accessToken')).toBeNull()
		expect(useAuthStore.getState().user).toBeNull()
	})
	it('clears an expired session when refresh fails', async () => {
		useAuthStore.getState().setSession(tokenFor())
		vi.stubGlobal(
			'fetch',
			vi
				.fn()
				.mockImplementation((path: string) =>
					Promise.resolve(path.endsWith('/refresh') ? fail(401, 40102) : fail(401, 40101)),
				),
		)
		await expect(api('/admin/users')).rejects.toMatchObject({ code: 40102 })
		expect(useAuthStore.getState().user).toBeNull()
	})
	it('surfaces non-JSON responses as errors instead of false success', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(new Response('<html>Error</html>', { status: 502 })),
		)
		await expect(api('/application')).rejects.toThrow('서버 응답을 읽을 수 없습니다.')
	})
	it('retains false and zero query values while omitting absent filters', () => {
		expect(
			queryString({
				semester: 0,
				documentPass: false,
				finalPass: null,
				category: '',
				page: undefined,
			}),
		).toBe('?semester=0&documentPass=false')
	})
})
