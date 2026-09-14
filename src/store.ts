import { decodeProfile } from '@/lib/token'
import type { UserProfile } from '@/types/api'
import { create } from 'zustand'

interface AuthState {
	user: UserProfile | null
	ready: boolean
	setSession: (token: string) => void
	clearSession: () => void
}
const legacyKeys = ['id', 'username', 'adminStatus', 'memberStatus', 'isLoggedIn']

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	ready: false,
	setSession: (token) => {
		const user = decodeProfile(token)
		sessionStorage.setItem('accessToken', token)
		sessionStorage.removeItem('signupToken')
		for (const key of legacyKeys) sessionStorage.removeItem(key)
		set({ user, ready: true })
	},
	clearSession: () => {
		for (const key of ['accessToken', 'signupToken', ...legacyKeys]) sessionStorage.removeItem(key)
		set({ user: null, ready: true })
	},
}))
