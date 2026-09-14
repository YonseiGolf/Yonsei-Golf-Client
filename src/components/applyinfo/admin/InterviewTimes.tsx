import AsyncState from '@/components/common/AsyncState'
import { confirmAction } from '@/components/common/ConfirmDialog'
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
import { useAction } from '@/hooks/useAction'
import { useQuery } from '@/hooks/useQuery'
import { api } from '@/lib/api'
import { formatDateTime } from '@/lib/format'
import type { InterviewTime, Recruit } from '@/types/api'
import { useState } from 'react'

export default function InterviewTimes({ recruit }: { recruit: Recruit }) {
	const query = useQuery(`admin-times:${recruit.id}`, (signal) =>
		api<InterviewTime[]>(`/admin/recruit/${recruit.id}/interview-times`, { signal }),
	)
	const [time, setTime] = useState('')
	const [editing, setEditing] = useState<{ id: number; value: string } | null>(null)
	const action = useAction()
	return (
		<section className="interview-section">
			<h3>면접 시간 관리 ({recruit.semester}기)</h3>
			<form
				className="interview-add-form"
				onSubmit={(event) => {
					event.preventDefault()
					if (!time) return
					void action.run(async () => {
						if (await confirmAction('면접 시간을 추가하시겠습니까?', formatDateTime(time))) {
							await api(`/admin/recruit/${recruit.id}/interview-times`, {
								method: 'POST',
								body: { interviewDateTime: `${time}:00` },
							})
							setTime('')
							query.reload()
						}
					})
				}}
			>
				<div className="interview-input-row">
					<Input
						type="datetime-local"
						aria-label="새 면접 일시"
						className="interview-input"
						required
						value={time}
						onChange={(event) => setTime(event.target.value)}
					/>
					<Button type="submit" className="btn-add-interview" disabled={!time || action.pending}>
						+ 추가
					</Button>
				</div>
			</form>
			<AsyncState {...query} retry={query.reload} />
			<AsyncState error={action.error} />
			{query.data && (
				<div className="interview-list">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>면접 일시</TableHead>
								<TableHead>수정</TableHead>
								<TableHead>삭제</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{query.data.map((item) => (
								<TableRow key={item.id}>
									<TableCell>
										{editing?.id === item.id ? (
											<Input
												aria-label="수정할 면접 일시"
												className="interview-edit-input"
												type="datetime-local"
												value={editing.value}
												onChange={(event) => setEditing({ id: item.id, value: event.target.value })}
											/>
										) : (
											formatDateTime(item.interviewDateTime)
										)}
									</TableCell>
									<TableCell>
										{editing?.id === item.id ? (
											<Button
												type="button"
												className="btn-save-small"
												disabled={!editing.value || action.pending}
												onClick={() =>
													void action.run(async () => {
														if (
															await confirmAction(
																'면접 시간을 수정하시겠습니까?',
																formatDateTime(editing.value),
															)
														) {
															await api(`/admin/interview-times/${item.id}`, {
																method: 'PATCH',
																body: { interviewDateTime: `${editing.value}:00` },
															})
															setEditing(null)
															query.reload()
														}
													})
												}
											>
												저장
											</Button>
										) : (
											<Button
												type="button"
												variant="outline"
												className="btn-edit"
												disabled={action.pending}
												onClick={() =>
													setEditing({
														id: item.id,
														value: item.interviewDateTime.replace(' ', 'T').slice(0, 16),
													})
												}
											>
												수정
											</Button>
										)}
									</TableCell>
									<TableCell>
										{editing?.id === item.id ? (
											<Button
												type="button"
												variant="outline"
												className="btn-cancel-small"
												disabled={action.pending}
												onClick={() => setEditing(null)}
											>
												취소
											</Button>
										) : (
											<Button
												type="button"
												variant="destructive"
												className="btn-delete-small"
												disabled={action.pending}
												onClick={() =>
													void action.run(async () => {
														if (
															await confirmAction(
																'면접 시간을 삭제하시겠습니까?',
																formatDateTime(item.interviewDateTime),
															)
														) {
															await api(`/admin/interview-times/${item.id}`, { method: 'DELETE' })
															query.reload()
														}
													})
												}
											>
												삭제
											</Button>
										)}
									</TableCell>
								</TableRow>
							))}
							{!query.data.length && (
								<TableRow>
									<TableCell colSpan={3}>등록된 면접 시간이 없습니다.</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			)}
		</section>
	)
}
