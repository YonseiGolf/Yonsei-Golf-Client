import { getRecruits } from '@/components/applyinfo/api'
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
import { api, queryString } from '@/lib/api'
import type { EmailAlarm } from '@/types/api'
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import './ApplyAlarm.css'

export default function ApplyAlarm() {
	const [params, setParams] = useSearchParams()
	const raw = Number(params.get('semester') || 0)
	const semester = Number.isSafeInteger(raw) && raw >= 0 ? raw : 0
	const recruits = useQuery('alarm-recruits', getRecruits)
	const semesters = [
		...new Set([0, 10, semester, ...(recruits.data?.map((recruit) => recruit.semester) ?? [])]),
	].sort((a, b) => b - a)
	const query = useQuery(`alarms:${semester}`, (signal) =>
		api<{ emailAlarms: EmailAlarm[] }>(
			`/admin/email/apply-start-email${queryString({ semester })}`,
			{ signal },
		),
	)
	const [sent, setSent] = useState(false)
	const action = useAction()
	return (
		<div className="scope-ApplyAlarm">
			<div className="application-container">
				<h3>
					지원 대기 목록
					<br />
					{query.data?.emailAlarms.length ?? 0}개
				</h3>
				<div className="semester-selector flex items-center justify-center gap-3">
					<Label htmlFor="alarm-semester">기수 선택:</Label>
					<SelectField
						id="alarm-semester"
						value={String(semester)}
						onValueChange={(value) => {
							setParams({ semester: value })
							setSent(false)
						}}
						options={semesters.map((value) => ({
							value: String(value),
							label: value === 0 ? '기수 미지정 (0)' : `${value}기`,
						}))}
					/>
				</div>
				<p>메일은 전체 기수의 미발송 대기자에게 발송됩니다.</p>
				<Button
					type="button"
					disabled={action.pending}
					onClick={() =>
						void action.run(async () => {
							if (
								await confirmAction(
									'모집 시작 메일을 발송하시겠습니까?',
									'현재 조회 중인 기수와 관계없이 전체 기수의 미발송 대기자에게 메일이 발송됩니다.',
								)
							) {
								await api('/admin/email/apply-start-email', { method: 'POST' })
								setSent(true)
								query.reload()
							}
						})
					}
				>
					전체 미발송 대기자에게 메일 보내기
				</Button>
				<AsyncState {...query} retry={query.reload} />
				<AsyncState error={recruits.error} retry={recruits.reload} />
				<AsyncState error={action.error} />
				{sent && <output className="success-message">메일 발송 요청이 완료되었습니다.</output>}
				{query.data && (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>이메일 명단</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{query.data.emailAlarms.map((item) => (
								<TableRow key={item.id}>
									<TableCell>{item.email}</TableCell>
								</TableRow>
							))}
							{!query.data.emailAlarms.length && (
								<TableRow>
									<TableCell>등록된 대기자가 없습니다.</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	)
}
