import { env } from '@/lib/env'
import { useAuthStore } from '@/store'
import type { ApiResponse, TokenResponse } from '@/types/api'

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public code: number = status,
	) {
		super(message)
		this.name = 'ApiError'
	}
}
type Options = Omit<RequestInit, 'body'> & { body?: unknown; auth?: boolean; token?: string }
let refreshPromise: Promise<void> | undefined

export async function refreshSession() {
	if (!refreshPromise) {
		const startingToken = sessionStorage.getItem('accessToken')
		refreshPromise = api<TokenResponse>('/users/signIn/refresh', {
			method: 'POST',
			auth: false,
			signal: AbortSignal.timeout(10000),
		})
			.then(({ accessToken }) => {
				if (sessionStorage.getItem('accessToken') === startingToken)
					useAuthStore.getState().setSession(accessToken)
			})
			.catch((error: unknown) => {
				if (sessionStorage.getItem('accessToken') === startingToken)
					useAuthStore.getState().clearSession()
				throw error
			})
			.finally(() => {
				refreshPromise = undefined
			})
	}
	return refreshPromise
}

export async function api<T = void>(path: string, options: Options = {}, retry = true): Promise<T> {
	const { body, auth = true, token, ...init } = options
	const headers = new Headers(init.headers)
	if (body !== undefined) headers.set('Content-Type', 'application/json')
	const accessToken = token ?? (auth ? sessionStorage.getItem('accessToken') : null)
	if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
	const response = await fetch(`${env.apiBaseUrl}${path}`, {
		...init,
		headers,
		credentials: 'include',
		body: body === undefined ? undefined : JSON.stringify(body),
	})
	const text = await response.text()
	let result: ApiResponse<T> | undefined
	if (text) {
		try {
			result = JSON.parse(text) as ApiResponse<T>
		} catch {
			throw new ApiError('서버 응답을 읽을 수 없습니다.', response.status)
		}
	}
	if (!response.ok || result?.status === 'fail') {
		if (auth && !token && accessToken && retry && response.status === 401) {
			// Requests that failed before a parallel refresh completed reuse its new token.
			if (sessionStorage.getItem('accessToken') === accessToken) await refreshSession()
			return api<T>(path, options, false)
		}
		if (auth && !token && response.status === 401 && !retry) useAuthStore.getState().clearSession()
		throw new ApiError(
			result?.message || `요청에 실패했습니다. (${response.status})`,
			response.status,
			result?.code,
		)
	}
	if (response.status === 204) return undefined as T
	if (!result || result.status !== 'success')
		throw new ApiError('서버 응답 형식이 올바르지 않습니다.', response.status)
	return result.data
}

export function queryString(values: Record<string, string | number | boolean | null | undefined>) {
	const params = new URLSearchParams()
	for (const [key, value] of Object.entries(values))
		if (value !== undefined && value !== null && value !== '') params.set(key, String(value))
	return params.toString() ? `?${params}` : ''
}

export const errorMessage = (error: unknown) =>
	error instanceof Error ? error.message : '요청에 실패했습니다. 다시 시도해 주세요.'
