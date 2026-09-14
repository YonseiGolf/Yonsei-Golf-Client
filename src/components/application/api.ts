import { api } from '@/lib/api'
import type { ApplicationRequest, ImageUpload } from '@/types/api'

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export async function uploadPhoto(file: File) {
	if (!IMAGE_TYPES.includes(file.type))
		throw new Error('JPG, PNG, WEBP, GIF 파일만 업로드할 수 있습니다.')
	if (file.size === 0 || file.size > MAX_IMAGE_SIZE)
		throw new Error('0바이트보다 크고 10MB 이하인 이미지를 선택해 주세요.')
	const upload = await api<ImageUpload>('/apply/forms/image/presigned-url', {
		method: 'POST',
		auth: false,
		body: { fileName: file.name, contentType: file.type, fileSize: file.size },
	})
	if (!upload.uploadUrl || !upload.imageKey) throw new Error('이미지 업로드 정보가 없습니다.')
	const response = await fetch(upload.uploadUrl, {
		method: 'PUT',
		headers: upload.uploadHeaders || { 'Content-Type': file.type },
		body: file,
		credentials: 'omit',
	})
	if (!response.ok) throw new Error(`사진 업로드에 실패했습니다. (${response.status})`)
	return upload.imageKey
}
export const submitApplication = (body: ApplicationRequest) =>
	api('/application', { method: 'POST', auth: false, body })
export const sendEmailConfirmation = (email: string) =>
	api('/application/email-confirmation', { method: 'POST', auth: false, body: { email } })
