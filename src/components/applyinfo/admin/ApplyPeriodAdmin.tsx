import AsyncState from '@/components/common/AsyncState'
import { confirmAction } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import type { Recruit, RecruitDates } from '@/types/api'
import { useState } from 'react'
import { getRecruits } from '../api'
import InterviewTimes from './InterviewTimes'
import { dateFields, emptyDates, recruitDateError } from './recruit'
import './ApplyPeriodAdmin.css'

export default function ApplyPeriodAdmin() {
	const query = useQuery('recruit-periods', getRecruits)
	const [selected, setSelected] = useState<Recruit | 'new' | null>(null)
	return (
		<div className="scope-ApplyPeriodAdmin">
			<div className="apply-period-admin">
				<h2>지원 기간 관리</h2>
				<section className="list-section">
					<div className="list-header">
						<h3>모집 기간 목록</h3>
						<Button type="button" className="btn-add" onClick={() => setSelected('new')}>
							+ 새로 추가
						</Button>
					</div>
					<AsyncState {...query} retry={query.reload} />
					{query.data && (
						<div className="table-scroll">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>기수</TableHead>
										<TableHead>서류 접수 기간</TableHead>
										<TableHead>서류 발표</TableHead>
										<TableHead>면접 기간</TableHead>
										<TableHead>최종 발표</TableHead>
										<TableHead>OT</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{query.data.map((item) => (
										<TableRow
											key={item.id}
											className={selected !== 'new' && selected?.id === item.id ? 'selected' : ''}
										>
											<TableCell>
												<Button
													type="button"
													variant="outline"
													className="btn-edit"
													onClick={() => setSelected(item)}
												>
													{item.semester}기
												</Button>
											</TableCell>
											<TableCell>
												{item.startDate || '-'} ~ {item.endDate || '-'}
											</TableCell>
											<TableCell>{item.firstResultDate || '-'}</TableCell>
											<TableCell>
												{item.interviewStartDate || '-'} ~ {item.interviewEndDate || '-'}
											</TableCell>
											<TableCell>{item.finalResultDate || '-'}</TableCell>
											<TableCell>{item.orientationDate || '-'}</TableCell>
										</TableRow>
									))}
									{!query.data.length && (
										<TableRow>
											<TableCell colSpan={6}>등록된 모집 기간이 없습니다.</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</section>
				{selected && (
					<PeriodForm
						key={selected === 'new' ? 'new' : `period:${selected.id}`}
						initial={selected === 'new' ? undefined : selected}
						onClose={() => setSelected(null)}
						onSaved={() => {
							setSelected(null)
							query.reload()
						}}
					/>
				)}
				{selected && selected !== 'new' && (
					<InterviewTimes key={`times:${selected.id}`} recruit={selected} />
				)}
			</div>
		</div>
	)
}

function PeriodForm({
	initial,
	onClose,
	onSaved,
}: { initial?: Recruit; onClose: () => void; onSaved: () => void }) {
	const [semester, setSemester] = useState(initial?.semester.toString() ?? '')
	const [dates, setDates] = useState<RecruitDates>(() => {
		const values = { ...emptyDates }
		for (const [key] of dateFields) values[key] = initial?.[key] ?? ''
		return values
	})
	const action = useAction()
	const dateError = recruitDateError(dates)
	// The server requires every date, so saving waits until all seven are chosen.
	const complete = dateFields.every(([key]) => dates[key])
	const valid =
		Number.isSafeInteger(Number(semester)) && Number(semester) > 0 && complete && !dateError
	return (
		<section className="form-section">
			<h3>{initial ? '모집 기간 수정' : '새 모집 기간 등록'}</h3>
			{initial &&
				dateFields.some(([key]) => {
					const date = initial[key]
					return date && !/^\d{4}-/.test(date)
				}) && (
					<p>
						저장된 일정에 연도가 표시되지 않습니다. 날짜를 수정하려면 각 일정의 연도를 포함해 다시
						선택해 주세요.
					</p>
				)}
			<form
				className="form-container"
				onSubmit={(event) => {
					event.preventDefault()
					if (!valid) return
					void action.run(async () => {
						if (
							await confirmAction(
								initial ? '모집 기간을 수정하시겠습니까?' : '모집 기간을 등록하시겠습니까?',
								`${semester}기`,
							)
						) {
							await api(`/admin/recruit${initial ? `/${initial.id}` : ''}`, {
								method: initial ? 'PATCH' : 'POST',
								body: {
									semester: Number(semester),
									...Object.fromEntries(dateFields.map(([key]) => [key, dates[key]])),
								},
							})
							onSaved()
						}
					})
				}}
			>
				<div className="form-group">
					<Label htmlFor="recruit-semester">기수</Label>
					<Input
						id="recruit-semester"
						type="number"
						min={1}
						step={1}
						required
						value={semester}
						onChange={(event) => setSemester(event.target.value)}
					/>
				</div>
				{dateFields.map(([key, label]) => (
					<div className="form-group" key={key}>
						<Label htmlFor={`recruit-${key}`}>{label}</Label>
						<Input
							id={`recruit-${key}`}
							type="date"
							required
							value={/^\d{4}-\d{2}-\d{2}$/.test(dates[key]) ? dates[key] : ''}
							onChange={(event) => setDates({ ...dates, [key]: event.target.value })}
						/>
						{initial?.[key] && <small>저장된 일정: {initial[key]}</small>}
						{dates[key] && (
							<Button
								type="button"
								variant="outline"
								className="btn-cancel-small"
								onClick={() => setDates({ ...dates, [key]: '' })}
							>
								{label} 지우기
							</Button>
						)}
					</div>
				))}
				<AsyncState error={dateError || action.error} />
				<div className="button-group">
					<Button type="submit" className="btn-save" disabled={!valid || action.pending}>
						{initial ? '수정' : '등록'}
					</Button>
					{initial && (
						<Button
							type="button"
							variant="destructive"
							className="btn-delete"
							disabled={action.pending}
							onClick={() =>
								void action.run(async () => {
									if (
										await confirmAction(
											'모집 기간을 삭제하시겠습니까?',
											`${initial.semester}기 모집 기간을 삭제합니다.`,
										)
									) {
										await api(`/admin/recruit/${initial.id}`, { method: 'DELETE' })
										onSaved()
									}
								})
							}
						>
							삭제
						</Button>
					)}
					<Button
						type="button"
						variant="outline"
						className="btn-cancel"
						disabled={action.pending}
						onClick={onClose}
					>
						취소
					</Button>
				</div>
			</form>
		</section>
	)
}
