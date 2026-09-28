// Drops seconds from ISO (2026-09-28T10:00:00) and Korean (2026년 09월 28일 10:00:00) values.
const SECONDS = /(\d{2}:\d{2}):\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/
export const formatDateTime = (value: string | null | undefined) =>
	value ? value.replace('T', ' ').replace(SECONDS, '$1') : '미정'
export const toDateTimeInput = (value: string | null | undefined) =>
	value && /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(value)
		? value.replace(' ', 'T').slice(0, 16)
		: ''
export const formatPhoneNumber = (value: string) => {
	const digits = value.replace(/\D/g, '').slice(0, 11)
	return digits.length <= 3
		? digits
		: digits.length <= 7
			? `${digits.slice(0, 3)}-${digits.slice(3)}`
			: `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}
export const seoulDateTime = (date = new Date()) =>
	new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19)
export const isHttpUrl = (value: string) => {
	try {
		return ['https:', 'http:'].includes(new URL(value).protocol)
	} catch {
		return false
	}
}
