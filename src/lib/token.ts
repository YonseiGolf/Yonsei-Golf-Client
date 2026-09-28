import type { UserProfile } from '@/types/api'

export function decodeProfile(token: string): UserProfile {
	const part = token.split('.')[1]
	if (!part) throw new Error('로그인 정보가 올바르지 않습니다.')
	const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
	const bytes = Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')), (c) =>
		c.charCodeAt(0),
	)
	const payload = JSON.parse(new TextDecoder().decode(bytes))
	const user = payload.userProfile
	if (
		!user ||
		typeof user.id !== 'number' ||
		typeof user.name !== 'string' ||
		typeof user.adminStatus !== 'boolean' ||
		typeof user.memberStatus !== 'boolean'
	) {
		throw new Error('로그인 정보가 올바르지 않습니다.')
	}
	// Decoding supplies UI state only. The server verifies the JWT and permissions.
	return {
		id: user.id,
		name: user.name,
		adminStatus: user.adminStatus,
		memberStatus: user.memberStatus,
	}
}
