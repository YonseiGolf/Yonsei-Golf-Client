export const env = {
	apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, ''),
	kakaoKey: import.meta.env.VITE_KAKAO_REST_API_KEY ?? '',
	kakaoRedirectUri:
		import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}/oauth/kakao`,
}
