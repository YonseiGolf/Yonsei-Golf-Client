import { ApiError, api, refreshSession } from '@/lib/api'
import { useAuthStore } from '@/store'
import type { SignUpRequest, TokenResponse } from '@/types/api'

let initialization: Promise<void> | undefined
export function initializeAuth() {
	if (!initialization)
		initialization = (async () => {
			if (window.location.pathname === '/oauth/kakao' || sessionStorage.getItem('signupToken')) {
				useAuthStore.setState({ ready: true })
				return
			}
			try {
				const token = sessionStorage.getItem('accessToken')
				if (token) {
					await api('/users/loggedIn', { method: 'POST', signal: AbortSignal.timeout(10000) })
					useAuthStore.getState().setSession(sessionStorage.getItem('accessToken') || token)
				} else await refreshSession()
			} catch {
				useAuthStore.getState().clearSession()
			}
		})()
	return initialization
}

const exchanges = new Map<string, Promise<'signed-in' | 'signup'>>()
export function completeKakaoLogin(code: string) {
	let exchange = exchanges.get(code)
	if (!exchange) {
		exchange = (async (): Promise<'signed-in' | 'signup'> => {
			const { accessToken: temporaryToken } = await api<TokenResponse>('/oauth/kakao', {
				method: 'POST',
				body: { kakaoCode: code },
				auth: false,
			})
			try {
				const result = await api<TokenResponse>('/users/signIn', {
					method: 'POST',
					auth: false,
					token: temporaryToken,
				})
				useAuthStore.getState().setSession(result.accessToken)
				return 'signed-in'
			} catch (error) {
				if (error instanceof ApiError && error.status === 401 && error.code === 401) {
					useAuthStore.getState().clearSession()
					sessionStorage.setItem('signupToken', temporaryToken)
					return 'signup'
				}
				throw error
			}
		})()
		exchanges.set(code, exchange)
	}
	return exchange
}

export async function signUp(body: SignUpRequest) {
	const token = sessionStorage.getItem('signupToken')
	if (!token) throw new Error('카카오 로그인을 먼저 진행해 주세요.')
	await api('/users/signUp', { method: 'POST', body, auth: false, token })
	useAuthStore.getState().clearSession()
}

export async function logout() {
	await api('/users/logout', { method: 'POST' })
	useAuthStore.getState().clearSession()
}
