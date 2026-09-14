import { decodeProfile } from '@/lib/token'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fail, member, ok, tokenFor } from './fixtures'

afterEach(() => vi.unstubAllGlobals())
describe('Kakao authentication', () => {
	it('decodes UTF-8 names and unpadded base64url payloads', () =>
		expect(decodeProfile(tokenFor())).toEqual(member))
	it('rejects temporary tokens as authenticated user profiles', () => {
		const temporary = `header.${Buffer.from(JSON.stringify({ userProfile: { id: 1 } })).toString('base64url')}.sig`
		expect(() => decodeProfile(temporary)).toThrow('로그인 정보')
		expect(() => decodeProfile('malformed')).toThrow('로그인 정보')
	})
	it('exchanges one authorization code only once even if mounted twice', async () => {
		vi.resetModules()
		const { completeKakaoLogin } = await import('@/components/user/api')
		const fetcher = vi
			.fn()
			.mockResolvedValueOnce(ok({ accessToken: 'temporary' }))
			.mockResolvedValueOnce(ok({ accessToken: tokenFor() }))
		vi.stubGlobal('fetch', fetcher)
		expect(
			await Promise.all([completeKakaoLogin('single-use'), completeKakaoLogin('single-use')]),
		).toEqual(['signed-in', 'signed-in'])
		expect(fetcher).toHaveBeenCalledTimes(2)
		expect(sessionStorage.getItem('accessToken')).toBe(tokenFor())
	})
	it('retains the Kakao token for signup without treating it as a login session', async () => {
		vi.resetModules()
		const { completeKakaoLogin } = await import('@/components/user/api')
		vi.stubGlobal(
			'fetch',
			vi
				.fn()
				.mockResolvedValueOnce(ok({ accessToken: 'temporary' }))
				.mockResolvedValueOnce(fail(401, 401, '가입이 필요합니다.')),
		)
		expect(await completeKakaoLogin('new-user')).toBe('signup')
		expect(sessionStorage.getItem('signupToken')).toBe('temporary')
		expect(sessionStorage.getItem('accessToken')).toBeNull()
	})
	it('does not redirect network or expired-token failures to signup', async () => {
		vi.resetModules()
		const { completeKakaoLogin } = await import('@/components/user/api')
		vi.stubGlobal(
			'fetch',
			vi
				.fn()
				.mockResolvedValueOnce(ok({ accessToken: 'temporary' }))
				.mockResolvedValueOnce(fail(401, 40101)),
		)
		await expect(completeKakaoLogin('expired')).rejects.toMatchObject({ code: 40101 })
		expect(sessionStorage.getItem('signupToken')).toBeNull()
	})
})
