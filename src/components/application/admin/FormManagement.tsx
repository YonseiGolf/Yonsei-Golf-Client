import { getRecruits } from '@/components/applyinfo/api'
import AsyncState from '@/components/common/AsyncState'
import SelectField from '@/components/common/SelectField'
import { Label } from '@/components/ui/label'
import { useQuery } from '@/hooks/useQuery'
import { useState } from 'react'
import ApplicationTable from './ApplicationTable'
import './FormManagement.css'

export default function FormManagement() {
	const recruits = useQuery('admin-recruits', getRecruits)
	const [selected, setSelected] = useState<number>()
	const semesters = [...new Set(recruits.data?.map((item) => item.semester))].sort((a, b) => b - a)
	const semester = selected ?? semesters[0]
	return (
		<div className="scope-FormManagement">
			<div className="header-section">
				<h2>지원서 관리</h2>
				<div className="filter-section">
					<Label htmlFor="semester-select">지원 기수:</Label>
					<SelectField
						id="semester-select"
						value={String(semester ?? '')}
						onValueChange={(value) => setSelected(Number(value))}
						placeholder="등록된 기수 없음"
						options={semesters.map((item) => ({ value: String(item), label: `${item}기` }))}
					/>
				</div>
			</div>
			<AsyncState {...recruits} retry={recruits.reload} />
			{!recruits.loading && !recruits.error && !semesters.length && (
				<p>등록된 모집 기수가 없습니다.</p>
			)}
			{semester !== undefined && (
				<>
					<p className="status-message">
						목록은 선택한 기수만 표시합니다. 결과 메일은 전체 기수에서 해당 결과의 미발송 지원자에게
						발송됩니다.
					</p>
					<div className="application-tables" key={semester}>
						<ApplicationTable semester={semester} title="지원 접수" />
						<ApplicationTable semester={semester} title="1차 합격" documentPass={true} />
						<ApplicationTable
							semester={semester}
							title="최종 합격"
							documentPass={true}
							finalPass={true}
						/>
						<ApplicationTable semester={semester} title="서류 탈락" documentPass={false} />
						<ApplicationTable
							semester={semester}
							title="최종 탈락"
							documentPass={true}
							finalPass={false}
						/>
					</div>
				</>
			)}
		</div>
	)
}
