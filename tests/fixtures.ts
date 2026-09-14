import type { UserProfile } from '@/types/api'

export const member: UserProfile = {
	id: 7,
	name: '김연골😀',
	adminStatus: false,
	memberStatus: true,
}
export const tokenFor = (profile: UserProfile = member) =>
	`header.${Buffer.from(JSON.stringify({ userProfile: profile, exp: 9999999999 })).toString('base64url')}.signature`
export const ok = (data: unknown = null) =>
	new Response(JSON.stringify({ status: 'success', code: 200, message: '성공', data }), {
		status: 200,
	})
export const fail = (status: number, code = status, message = '실패') =>
	new Response(JSON.stringify({ status: 'fail', code, message }), { status })
