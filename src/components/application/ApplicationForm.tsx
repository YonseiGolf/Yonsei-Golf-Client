import {
	getAvailability,
	getInterviewTimes,
	getRecruit,
	getRecruits,
} from '@/components/applyinfo/api'
import AsyncState from '@/components/common/AsyncState'
import { confirmAction } from '@/components/common/ConfirmDialog'
import SelectField from '@/components/common/SelectField'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAction } from '@/hooks/useAction'
import { useQuery } from '@/hooks/useQuery'
import { formatDateTime, formatPhoneNumber, isHttpUrl, seoulDateTime } from '@/lib/format'
import type { ActivityClub } from '@/types/api'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ActivityClubs from './ActivityClubs'
import { IMAGE_TYPES, sendEmailConfirmation, submitApplication, uploadPhoto } from './api'
import './ApplicationForm.css'

export const essayFields = [
	[
		'selfIntroduction',
		'간략하게 자기소개 부탁드립니다. (군대 계획이나 교환학생 계획이 있다면 적어주세요)',
	],
	['applyReason', '연세 골프에 지원하게 된 동기를 작성해주세요'],
	['skillEvaluation', '현재 본인의 골프 실력을 객관적으로 평가해주세요.'],
	['golfMemory', '골프와 관련된 추억이 있으시다면 말씀해주세요'],
] as const

export default function ApplicationForm({ preview = false }: { preview?: boolean }) {
	const query = useQuery(`application-form:${preview}`, async (signal) => {
		const [recruit, available] = await Promise.all([getRecruit(signal), getAvailability(signal)])
		const times = recruit ? await getInterviewTimes(recruit.id, signal) : []
		return { recruit, available, times }
	})
	const recruits = useQuery('admin-recruits', getRecruits, preview)
	const [testRecruitId, setTestRecruitId] = useState<number>()
	const testRecruit = recruits.data?.find((item) => item.id === testRecruitId)
	const testTimes = useQuery(
		`test-interview-times:${testRecruitId}`,
		(signal) => getInterviewTimes(testRecruitId ?? 0, signal),
		testRecruitId !== undefined,
	)
	// A preview without a test semester is a dry run: nothing is uploaded, mailed or submitted.
	const dryRun = preview && !testRecruit
	const recruit = testRecruit ?? query.data?.recruit
	const times = (testRecruit ? testTimes.data : query.data?.times) ?? []
	const [values, setValues] = useState({
		name: '',
		email: '',
		phoneNumber: '',
		studentId: '',
		major: '',
		birthDate: '',
		selfIntroduction: '',
		applyReason: '',
		skillEvaluation: '',
		golfMemory: '',
		swingVideo: '',
	})
	const [clubs, setClubs] = useState<(ActivityClub & { key: string })[]>([])
	const [selectedTimes, setSelectedTimes] = useState<number[]>([])
	const [photo, setPhoto] = useState({ url: '', key: '' })
	const [confirmedEmail, setConfirmedEmail] = useState('')
	const [submitted, setSubmitted] = useState(false)
	const upload = useAction()
	const confirmation = useAction()
	const submission = useAction()
	useEffect(
		() => () => {
			if (photo.url) URL.revokeObjectURL(photo.url)
		},
		[photo.url],
	)

	function update(key: keyof typeof values, value: string) {
		setValues((current) => ({ ...current, [key]: value }))
	}
	if (query.loading || query.error) return <AsyncState {...query} retry={query.reload} />
	if (!preview && (!query.data?.available || !query.data.recruit))
		return (
			<div className="page-container">
				<h1>지금은 모집기간이 아닙니다.</h1>
				<Link to="/apply">모집 알림 등록하기</Link>
			</div>
		)
	if (submitted)
		return (
			<div className="page-container">
				<h1>{preview ? '테스트 지원서가 제출되었습니다.' : '지원서가 제출되었습니다.'}</h1>
				<p>
					{values.email}로 접수 메일을 보내드립니다. 10분 내로 메일을 받지 못했다면 인스타그램으로
					문의해 주세요.
				</p>
				{preview ? <Link to="/admin/form">지원서 관리로</Link> : <Link to="/">홈으로</Link>}
			</div>
		)
	const valid =
		Object.values(values).every((value) => value.trim()) &&
		/^\d{1,11}$/.test(values.studentId) &&
		values.phoneNumber.replace(/\D/g, '').length >= 10 &&
		photo.key &&
		isHttpUrl(values.swingVideo) &&
		!testTimes.loading &&
		!testTimes.error &&
		(!times.length || selectedTimes.length > 0)
	return (
		<div className="scope-ApplicationForm">
			<form
				onSubmit={(event) => {
					event.preventDefault()
					if (!valid || dryRun || upload.pending || !recruit) return
					const semester = recruit.semester
					void submission.run(async () => {
						if (
							!(await confirmAction(
								preview
									? `${semester}기 테스트 지원서를 제출하시겠습니까?`
									: '지원서를 제출하시겠습니까?',
								`결과가 발송될 이메일을 확인해 주세요: ${values.email.trim()}`,
							))
						)
							return
						await submitApplication({
							...values,
							name: values.name.trim(),
							email: values.email.trim(),
							photoKey: photo.key,
							studentId: Number(values.studentId),
							phoneNumber: values.phoneNumber.replace(/\D/g, ''),
							activityClubs: clubs.map(({ key: _key, ...club }) => club),
							semester,
							availableInterviewTimeIds: selectedTimes,
							submitTime: seoulDateTime(),
						})
						setSubmitted(true)
					})
				}}
			>
				<div className="section-spacer" />
				<div className="form-header">
					<h1>연세 골프 지원서</h1>
					<div className="notice-text">* 지원서는 임시저장되지 않습니다.</div>
					{preview && (
						<div className="test-submit">
							<div className="flex flex-wrap items-center gap-2.5">
								<Label htmlFor="test-semester">테스트 제출 기수</Label>
								<SelectField
									id="test-semester"
									value={String(testRecruitId ?? '')}
									disabled={recruits.loading || upload.pending || submission.pending}
									onValueChange={(value) => {
										setTestRecruitId(value ? Number(value) : undefined)
										setPhoto({ url: '', key: '' })
										setSelectedTimes([])
									}}
									options={[
										{ value: '', label: '제출 안 함 (미리보기)' },
										...(recruits.data ?? []).map((item) => ({
											value: String(item.id),
											label: `${item.semester}기`,
										})),
									]}
								/>
							</div>
							<AsyncState error={recruits.error || testTimes.error} />
							<output>
								{testRecruit
									? `테스트 제출 모드입니다. 사진이 실제로 업로드되고 ${testRecruit.semester}기 지원서로 저장되며, 입력한 이메일로 접수 메일이 발송됩니다. 저장된 지원서는 화면에서 삭제할 수 없습니다.`
									: '지원서 양식 미리보기입니다. 제출과 이메일 발송은 실행되지 않습니다.'}
							</output>
						</div>
					)}
				</div>
				<fieldset
					disabled={submission.pending}
					style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
				>
					<div className="default_info">
						<div className="section-title">지원자 정보</div>
						<div className="photo-upload-section">
							<div className="photo-container">
								<div className="file-upload-container">
									{!photo.url && (
										<>
											<Input
												type="file"
												aria-label="지원자 사진"
												accept={IMAGE_TYPES.join(',')}
												disabled={upload.pending}
												onChange={(event) => {
													const input = event.currentTarget
													const file = input.files?.[0]
													if (file)
														void upload.run(async () => {
															try {
																const key = dryRun ? 'preview' : await uploadPhoto(file)
																setPhoto({ url: URL.createObjectURL(file), key })
															} finally {
																input.value = ''
															}
														})
												}}
											/>
											<div className="upload-placeholder">
												<div className="upload-icon">👤</div>
												<div className="upload-text">지원자 사진</div>
												<div className="upload-hint">
													{upload.pending ? '업로드 중…' : '클릭하여 업로드 (10MB 이하)'}
												</div>
											</div>
										</>
									)}
								</div>
								{photo.url && (
									<div className="photo-display">
										<img className="apply-photo" src={photo.url} alt="지원자 사진" />
										<Button
											type="button"
											variant="destructive"
											size="icon-sm"
											className="photo-delete-btn size-8 rounded-full p-0"
											aria-label="사진 삭제"
											onClick={() => setPhoto({ url: '', key: '' })}
										>
											×
										</Button>
									</div>
								)}
							</div>
							<AsyncState error={upload.error} />
						</div>
						{(
							[
								['name', '이름', 'text', 10],
								['email', '이메일', 'email', 254],
								['phoneNumber', '전화번호', 'tel', 13],
								['studentId', '학번', 'text', 11],
								['major', '전공', 'text', 10],
								['birthDate', '생년월일', 'date', undefined],
							] as const
						).map(([key, label, type, maxLength]) => (
							<div className="info-field" key={key}>
								<Label htmlFor={`application-${key}`}>{label}</Label>
								<div
									className={
										key === 'email'
											? 'email-container grid grid-cols-[minmax(0,1fr)_auto] max-md:grid-cols-1'
											: undefined
									}
								>
									<Input
										id={`application-${key}`}
										type={type}
										required
										maxLength={maxLength}
										value={values[key]}
										placeholder={`${label}을 입력해주세요`}
										onChange={(event) =>
											update(
												key,
												key === 'phoneNumber'
													? formatPhoneNumber(event.target.value)
													: key === 'studentId'
														? event.target.value.replace(/\D/g, '')
														: event.target.value,
											)
										}
									/>
									{key === 'email' && (
										<Button
											type="button"
											variant="outline"
											className="email-confirm-btn w-fit"
											disabled={
												dryRun ||
												confirmation.pending ||
												!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) ||
												confirmedEmail === values.email.trim()
											}
											onClick={() =>
												void confirmation.run(async () => {
													const email = values.email.trim()
													await sendEmailConfirmation(email)
													setConfirmedEmail(email)
												})
											}
										>
											{confirmation.pending
												? '발송 중…'
												: confirmedEmail === values.email.trim() && confirmedEmail
													? '발송 완료'
													: '이메일 확인'}
										</Button>
									)}
								</div>
							</div>
						))}
						<AsyncState error={confirmation.error} />
						<div className="section-spacer" />
						{essayFields.map(([key, label]) => (
							<div className="info-field" key={key}>
								<Label htmlFor={key}>{label}</Label>
								<Textarea
									id={key}
									required
									rows={6}
									maxLength={500}
									placeholder="최대 500자까지 작성 가능합니다."
									value={values[key]}
									onChange={(event) => update(key, event.target.value)}
								/>
								<small>{values[key].length} / 500</small>
							</div>
						))}
						<ActivityClubs value={clubs} onChange={setClubs} />
						<div className="info-field">
							<Label htmlFor="swingVideo">
								본인의 스윙 영상이 담긴 url을 적어주세요 (유튜브, 인스타 등)
							</Label>
							<Input
								id="swingVideo"
								type="url"
								required
								maxLength={500}
								value={values.swingVideo}
								placeholder="비공개 영상이 아닌지 확인해주세요"
								onChange={(event) => update('swingVideo', event.target.value)}
							/>
						</div>
						{times.length > 0 && (
							<fieldset className="info-field" style={{ border: 0 }}>
								<legend>면접 가능 시간을 선택해주세요 (복수 선택 가능)</legend>
								<div className="interview-time-list">
									{times.map((time) => (
										<div className="interview-time-item" key={time.id}>
											<Label
												htmlFor={`interview-time-${time.id}`}
												className="checkbox-label flex cursor-pointer items-center gap-3"
											>
												<Checkbox
													id={`interview-time-${time.id}`}
													checked={selectedTimes.includes(time.id)}
													disabled={submission.pending}
													onCheckedChange={(checked) =>
														setSelectedTimes((ids) =>
															checked === true
																? [...ids, time.id]
																: ids.filter((id) => id !== time.id),
														)
													}
												/>
												<span className="checkbox-text">
													{formatDateTime(time.interviewDateTime)}
												</span>
											</Label>
										</div>
									))}
								</div>
								{selectedTimes.length === 0 && <p>최소 1개 이상의 면접 시간을 선택해주세요.</p>}
							</fieldset>
						)}
					</div>
				</fieldset>
				<div className="form-footer">
					<div className="notice-text">
						* 지원서 제출 전 이메일과 전화번호를 다시 한번 확인해주세요.
					</div>
					<div className="notice-text">* 결과는 이메일로 전송해드립니다.</div>
				</div>
				<AsyncState error={submission.error} />
				<Button
					className="apply-button mb-5 min-h-12 min-w-40 rounded-lg text-base"
					type="submit"
					disabled={dryRun || !valid || submission.pending || upload.pending}
				>
					{submission.pending ? '제출 중…' : '지원서 제출'}
				</Button>
			</form>
		</div>
	)
}
