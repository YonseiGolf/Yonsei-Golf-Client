import { api } from '@/lib/api'
import type { MailTemplate, MailTemplateContent, MailTemplateType } from '@/types/api'

export const mailTemplateInfo: Record<MailTemplateType, { label: string; when: string }> = {
	EMAIL_CONFIRMATION: {
		label: '이메일 확인',
		when: '지원자가 지원서 작성 중 이메일 확인을 누르면 발송됩니다.',
	},
	APPLICATION_RECEIPT: { label: '지원서 접수', when: '지원서를 제출하면 바로 발송됩니다.' },
	DOCUMENT_PASS: {
		label: '서류 합격',
		when: '지원서 관리의 1차 합격 메일 보내기로 발송됩니다.',
	},
	FINAL_PASS: { label: '최종 합격', when: '지원서 관리의 최종 합격 메일 보내기로 발송됩니다.' },
	FAIL: {
		label: '불합격',
		when: '지원서 관리의 서류 탈락·최종 탈락 메일 보내기에서 함께 사용됩니다.',
	},
	RECRUITMENT_START: {
		label: '모집 시작 알림',
		when: '지원 대기 명단의 메일 보내기로 발송됩니다.',
	},
}
export const SAMPLE_NAME = '홍길동'
const PLACEHOLDER = /\{\{[^{}]*\}\}/g

/** The server rejects these instead of mailing them as is. */
export function unknownPlaceholders(text: string, allowed: string[]) {
	return [...new Set(text.match(PLACEHOLDER))].filter((item) => !allowed.includes(item))
}
export function mailTemplateError({ subject, body }: MailTemplateContent, allowed: string[]) {
	if (!subject.trim()) return '제목을 입력해 주세요.'
	if (!body.trim()) return '본문을 입력해 주세요.'
	const unknown = unknownPlaceholders(`${subject}\n${body}`, allowed)
	return unknown.length ? `이 메일에서 쓸 수 없는 변수입니다: ${unknown.join(', ')}` : ''
}
/** Fills `{{이름}}` the way the server does, with a sample name. */
export function previewMail(text: string, allowed: string[]) {
	return allowed.includes('{{이름}}') ? text.replaceAll('{{이름}}', SAMPLE_NAME) : text
}

export const getMailTemplates = (signal?: AbortSignal) =>
	api<MailTemplate[]>('/admin/email/templates', { signal })
export const saveMailTemplate = (type: MailTemplateType, body: MailTemplateContent) =>
	api(`/admin/email/templates/${type}`, { method: 'PATCH', body })
export const resetMailTemplate = (type: MailTemplateType) =>
	api(`/admin/email/templates/${type}`, { method: 'DELETE' })
