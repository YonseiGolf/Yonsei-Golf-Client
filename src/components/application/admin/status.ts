export const applicationStatuses = {
	pending: { label: '보류', documentPass: null, finalPass: null },
	documentPass: { label: '서류 합격', documentPass: true, finalPass: null },
	finalPass: { label: '최종 합격', documentPass: true, finalPass: true },
	documentFail: { label: '서류 탈락', documentPass: false, finalPass: null },
	finalFail: { label: '최종 탈락', documentPass: true, finalPass: false },
} as const
export type ApplicationStatus = keyof typeof applicationStatuses
export function getApplicationStatus(
	documentPass: boolean | null,
	finalPass: boolean | null,
): ApplicationStatus {
	if (documentPass === false) return 'documentFail'
	if (documentPass === true)
		return finalPass === true ? 'finalPass' : finalPass === false ? 'finalFail' : 'documentPass'
	return 'pending'
}
