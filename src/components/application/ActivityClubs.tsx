import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import type { ActivityClub } from '@/types/api'
import { useState } from 'react'

const empty: ActivityClub = { clubName: '', startDate: '', endDate: '', role: '' }
export default function ActivityClubs({
	value,
	onChange,
}: {
	value: (ActivityClub & { key: string })[]
	onChange: (value: (ActivityClub & { key: string })[]) => void
}) {
	const [draft, setDraft] = useState(empty)
	const [error, setError] = useState('')
	function add() {
		if (Object.values(draft).some((value) => !value.trim())) {
			setError('활동의 모든 항목을 입력해 주세요.')
			return
		}
		if (draft.endDate < draft.startDate) {
			setError('종료일은 시작일 이후여야 합니다.')
			return
		}
		onChange([...value, { ...draft, key: crypto.randomUUID() }])
		setDraft(empty)
		setError('')
	}
	return (
		<div className="info-field">
			<p>현재 활동하는 다른 동아리나 학회가 있다면 적어주세요</p>
			<div className="activity-form">
				<div className="activity-input-row">
					{(
						[
							['clubName', '동아리/학회명', 'text'],
							['startDate', '활동 시작일', 'date'],
							['endDate', '활동 종료일', 'date'],
							['role', '역할', 'text'],
						] as const
					).map(([key, label, type]) => (
						<Input
							key={key}
							type={type}
							aria-label={label}
							placeholder={label}
							className="activity-input"
							value={draft[key]}
							onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
						/>
					))}
					<Button type="button" className="add-activity-btn" onClick={add}>
						추가
					</Button>
				</div>
				{error && <p role="alert">{error}</p>}
			</div>
			<div className="activities-container">
				{value.length ? (
					<div className="activities-table table-scroll">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>동아리/학회명</TableHead>
									<TableHead>시작일</TableHead>
									<TableHead>종료일</TableHead>
									<TableHead>역할</TableHead>
									<TableHead>삭제</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{value.map((item) => (
									<TableRow key={item.key}>
										<TableCell>{item.clubName}</TableCell>
										<TableCell>{item.startDate}</TableCell>
										<TableCell>{item.endDate}</TableCell>
										<TableCell>{item.role}</TableCell>
										<TableCell>
											<Button
												type="button"
												variant="destructive"
												size="icon-sm"
												className="remove-activity-btn"
												aria-label={`${item.clubName} 삭제`}
												onClick={() =>
													onChange(value.filter((activity) => activity.key !== item.key))
												}
											>
												×
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<div className="no-activities">
						<p>등록된 활동이 없습니다.</p>
					</div>
				)}
			</div>
		</div>
	)
}
