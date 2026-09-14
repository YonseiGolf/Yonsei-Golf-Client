import { essayFields } from '@/components/application/ApplicationForm'
import AsyncState from '@/components/common/AsyncState'
import { confirmAction } from '@/components/common/ConfirmDialog'
import SelectField from '@/components/common/SelectField'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useAction } from '@/hooks/useAction'
import { useQuery } from '@/hooks/useQuery'
import { api } from '@/lib/api'
import { formatDateTime, isHttpUrl } from '@/lib/format'
import type { ApplicationDetail as Application } from '@/types/api'
import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import InterviewModal from './IntervieModal'
import { type ApplicationStatus, applicationStatuses, getApplicationStatus } from './status'
import './ApplicationDetail.css'

export default function ApplicationDetail() {
	const { id = '' } = useParams()
	const query = useQuery(`application:${id}`, (signal) =>
		api<Application>(`/admin/forms/${encodeURIComponent(id)}`, { signal }),
	)
	return (
		<>
			<AsyncState {...query} retry={query.reload} />
			{query.data && <Detail key={query.data.id} data={query.data} reload={query.reload} />}
		</>
	)
}
function Detail({ data, reload }: { data: Application; reload: () => void }) {
	const [showInterview, setShowInterview] = useState(false)
	const interviewTrigger = useRef<HTMLButtonElement>(null)
	const action = useAction()
	return (
		<div className="scope-ApplicationDetail">
			<div className="section-spacer" />
			<div className="form-header">
				<h1>연세 골프 지원서</h1>
			</div>
			<div className="default_info">
				<div className="section-title">지원자 정보</div>
				<div className="photo-upload-section">
					<div className="photo-container">
						{data.photo && (
							<div className="photo-display">
								<img className="apply-photo" src={data.photo} alt={`${data.name} 지원자 사진`} />
							</div>
						)}
					</div>
				</div>
				{(
					[
						['name', '이름'],
						['email', '이메일'],
						['phoneNumber', '전화번호'],
						['studentId', '학번'],
						['major', '전공'],
						['birthDate', '생년월일'],
						...essayFields,
					] as const
				).map(([key, label]) => (
					<div className="info-field" key={key}>
						<p>{label}</p>
						<div className="field-value preserve-lines">{data[key]}</div>
					</div>
				))}
				<div className="info-field">
					<p>현재 활동하는 다른 동아리나 학회</p>
					<div className="activities-table table-scroll">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>동아리/학회명</TableHead>
									<TableHead>시작일</TableHead>
									<TableHead>종료일</TableHead>
									<TableHead>역할</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.activities?.map((item, index) => (
									<TableRow key={`${item.clubName}:${item.startDate}:${index}`}>
										<TableCell>{item.clubName}</TableCell>
										<TableCell>{item.startDate}</TableCell>
										<TableCell>{item.endDate}</TableCell>
										<TableCell>{item.role}</TableCell>
									</TableRow>
								))}
								{!data.activities?.length && (
									<TableRow>
										<TableCell colSpan={4}>등록된 활동이 없습니다.</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>
				<div className="info-field">
					<p>스윙 영상</p>
					<div className="field-value">
						{isHttpUrl(data.swingVideo) ? (
							<a href={data.swingVideo} target="_blank" rel="noreferrer" className="video-link">
								스윙 영상 보기
							</a>
						) : (
							data.swingVideo
						)}
					</div>
				</div>
				<div className="admin-section">
					<div className="section-title">관리자 기능</div>
					<div className="info-field">
						<p>지원 시간</p>
						<div className="field-value">{formatDateTime(data.submitTime)}</div>
					</div>
					<div className="info-field">
						<p>지원자 선택 면접 가능 시간</p>
						<div className="available-interview-times">
							{data.availableInterviewTimes?.map((time) => (
								<div className="available-time-item" key={time.id}>
									{formatDateTime(time.interviewDateTime)}
								</div>
							))}
						</div>
						{!data.availableInterviewTimes?.length && <p>선택된 면접 가능 시간이 없습니다.</p>}
					</div>
					<div className="info-field">
						<p>배정된 면접 시간</p>
						<p>{formatDateTime(data.interviewTime)}</p>
						<Button
							ref={interviewTrigger}
							type="button"
							className="w-fit"
							onClick={() => setShowInterview(true)}
						>
							면접 시간 변경
						</Button>
					</div>
					<div className="info-field">
						<Label htmlFor="application-status">합격 여부</Label>
						<SelectField
							id="application-status"
							className="status-select"
							value={getApplicationStatus(data.documentPass, data.finalPass)}
							disabled={action.pending}
							onValueChange={(value) => {
								const status = applicationStatuses[value as ApplicationStatus]
								void action.run(async () => {
									if (
										await confirmAction(
											'합격 여부를 변경하시겠습니까?',
											`${data.name}: ${status.label}`,
										)
									) {
										await api(`/admin/forms/${data.id}/pass`, {
											method: 'PATCH',
											body: { documentPass: status.documentPass, finalPass: status.finalPass },
										})
										reload()
									}
								})
							}}
							options={Object.entries(applicationStatuses).map(([value, status]) => ({
								value,
								label: status.label,
							}))}
						/>
						<AsyncState error={action.error} />
					</div>
				</div>
			</div>
			{showInterview && (
				<InterviewModal
					initial={data.interviewTime}
					onReturnFocus={() => interviewTrigger.current?.focus()}
					onClose={() => setShowInterview(false)}
					onSave={async (time) => {
						await api(`/admin/forms/${data.id}/interviewTime`, { method: 'PATCH', body: { time } })
						setShowInterview(false)
						reload()
					}}
				/>
			)}
			<Link to="/admin/form">지원서 목록</Link>
		</div>
	)
}
