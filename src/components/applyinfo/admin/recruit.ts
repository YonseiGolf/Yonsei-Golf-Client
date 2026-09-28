import type { RecruitDates } from '@/types/api'

export const dateFields = [
	['startDate', '서류 접수 시작일'],
	['endDate', '서류 접수 종료일'],
	['firstResultDate', '서류 합격 발표일'],
	['interviewStartDate', '면접 시작일'],
	['interviewEndDate', '면접 종료일'],
	['finalResultDate', '최종 결과 발표일'],
	['orientationDate', '오리엔테이션 날짜'],
] as const
export const emptyDates: RecruitDates = {
	startDate: '',
	endDate: '',
	firstResultDate: '',
	interviewStartDate: '',
	interviewEndDate: '',
	finalResultDate: '',
	orientationDate: '',
}
export function recruitDateError(dates: RecruitDates) {
	const entered = dateFields.filter(([key]) => dates[key])
	for (const [key, label] of entered) {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(dates[key]))
			return `${label}의 연도를 포함한 날짜를 다시 선택해 주세요.`
	}
	for (let i = 1; i < entered.length; i++) {
		const [previousKey, previousLabel] = entered[i - 1]
		const [key, label] = entered[i]
		if (dates[key] < dates[previousKey]) return `${label}은 ${previousLabel}보다 빠를 수 없습니다.`
	}
	return ''
}
