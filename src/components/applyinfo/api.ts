import { api } from '@/lib/api'
import type { InterviewTime, Recruit } from '@/types/api'
export const getRecruit = (signal?: AbortSignal) =>
	api<Recruit | null>('/application/recruit', { auth: false, signal })
export const getAvailability = (signal?: AbortSignal) =>
	api<boolean>('/application/availability', { auth: false, signal })
export const getRecruits = (signal?: AbortSignal) => api<Recruit[]>('/admin/recruits', { signal })
export const getInterviewTimes = (recruitId: number, signal?: AbortSignal) =>
	api<InterviewTime[]>(`/application/recruit/${recruitId}/interview-times`, { auth: false, signal })
