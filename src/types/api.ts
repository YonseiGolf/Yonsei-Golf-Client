export interface ApiResponse<T> {
	status: string
	code: number
	message: string
	data: T
}
export interface Page<T> {
	content: T[]
	totalElements: number
	totalPages: number
	number: number
}
export interface UserProfile {
	id: number
	name: string
	adminStatus: boolean
	memberStatus: boolean
}
export interface TokenResponse {
	accessToken: string
}
export type UserClass = 'YB' | 'OB' | 'NONE' | 'DORMANT' | 'BLACK_LIST'
export interface User {
	id: number
	name: string
	phoneNumber: string
	studentId: number
	major: string
	semester: number
	userClass: UserClass
	role: string
}
export interface SignUpRequest {
	name: string
	phoneNumber: string
	studentId: number
	major: string
	semester: number
}
export type Category = 'NOTICE' | 'FREE'
export interface Board {
	id: number
	category: Category
	title: string
	writer: string
	createdAt: string
}
export interface Reply {
	id: number
	writerId: number
	writer: string
	content: string
	createdAt: string
}
export interface BoardDetail extends Board {
	writerId: number
	content: string
	replies: { replies: Reply[] }
}
export interface BoardRequest {
	category: Category
	title: string
	content: string
}
export interface BoardTemplate {
	id: number
	title: string
	contents: string
}
export interface RecruitDates {
	startDate: string
	endDate: string
	firstResultDate: string
	interviewStartDate: string
	interviewEndDate: string
	finalResultDate: string
	orientationDate: string
}
export interface Recruit extends Record<keyof RecruitDates, string | null> {
	id: number
	semester: number
}
export interface InterviewTime {
	id: number
	interviewDateTime: string
}
export interface ActivityClub {
	clubName: string
	startDate: string
	endDate: string
	role: string
}
export interface ApplicationRequest {
	name: string
	photoKey: string
	birthDate: string
	studentId: number
	major: string
	email: string
	phoneNumber: string
	selfIntroduction: string
	applyReason: string
	skillEvaluation: string
	golfMemory: string
	activityClubs: ActivityClub[]
	swingVideo: string
	submitTime: string
	semester: number
	availableInterviewTimeIds: number[]
}
export interface ApplicationSummary {
	id: number
	photo: string | null
	name: string
	interviewTime: string | null
	documentPass: boolean
	finalPass: boolean
	/** When the mail for the current decisions (the receipt while undecided) was sent. */
	mailSentAt: string | null
}
export interface ApplicationDetail
	extends Omit<ApplicationRequest, 'photoKey' | 'activityClubs' | 'availableInterviewTimeIds'> {
	id: number
	photo: string | null
	activities: ActivityClub[]
	documentPass: boolean | null
	finalPass: boolean | null
	interviewTime: string | null
	availableInterviewTimes: InterviewTime[]
}
export interface ImageUpload {
	uploadUrl: string
	imageKey: string
	uploadHeaders: Record<string, string>
}
export interface EmailAlarm {
	id: number
	email: string
	semester: number
}
export type MailTemplateType =
	| 'EMAIL_CONFIRMATION'
	| 'APPLICATION_RECEIPT'
	| 'DOCUMENT_PASS'
	| 'DOCUMENT_FAIL'
	| 'FINAL_PASS'
	| 'FINAL_FAIL'
	| 'RECRUITMENT_START'
export interface MailTemplateContent {
	subject: string
	body: string
}
export interface MailTemplate extends MailTemplateContent {
	type: MailTemplateType
	placeholders: string[]
	customized: boolean
}
