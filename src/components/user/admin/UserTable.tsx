import AsyncState from '@/components/common/AsyncState'
import { confirmAction } from '@/components/common/ConfirmDialog'
import Pagination from '@/components/common/Pagination'
import SelectField from '@/components/common/SelectField'
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
import type { Page, User, UserClass } from '@/types/api'
import { useState } from 'react'
import './UserTable.css'

export const userClasses = [
	['YB', 'YB'],
	['OB', 'OB'],
	['NONE', '회원 대기'],
	['DORMANT', '휴면 회원'],
	['BLACK_LIST', '블랙리스트'],
] as const
export default function UserTable({
	userClass,
	title,
	revision,
	onChange,
}: { userClass: UserClass; title: string; revision: number; onChange: () => void }) {
	const [page, setPage] = useState(0)
	const query = useQuery(`users:${userClass}:${page}:${revision}`, (signal) =>
		api<Page<User>>(`/admin/users${queryString({ userClass, page, size: 10 })}`, { signal }),
	)
	const action = useAction()
	return (
		<div className="scope-UserTable">
			<section className="user-container" aria-label={title}>
				<h3>
					{title}　{query.data?.totalElements ?? 0}명
				</h3>
				<AsyncState {...query} retry={query.reload} />
				<AsyncState error={action.error} />
				{query.data && (
					<>
						<div className="table-scroll">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>이름</TableHead>
										<TableHead>전화번호</TableHead>
										<TableHead>학번</TableHead>
										<TableHead>학과</TableHead>
										<TableHead>기수</TableHead>
										<TableHead>회원 구분</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{query.data.content.map((user) => (
										<TableRow key={user.id}>
											<TableCell>{user.name}</TableCell>
											<TableCell>{user.phoneNumber}</TableCell>
											<TableCell>{user.studentId}</TableCell>
											<TableCell>{user.major}</TableCell>
											<TableCell>{user.semester}</TableCell>
											<TableCell>
												<SelectField
													aria-label={`${user.name} 회원 구분`}
													value={user.userClass}
													disabled={action.pending}
													onValueChange={(value) => {
														const next = value as UserClass
														void action.run(async () => {
															if (
																await confirmAction(
																	'회원 구분을 변경하시겠습니까?',
																	`${user.name}: ${user.userClass} → ${next}`,
																)
															) {
																await api(`/admin/users/${user.id}`, {
																	method: 'PATCH',
																	body: { userClass: next },
																})
																setPage(0)
																onChange()
															}
														})
													}}
													options={userClasses.map(([value, label]) => ({ value, label }))}
												/>
											</TableCell>
										</TableRow>
									))}
									{!query.data.content.length && (
										<TableRow>
											<TableCell colSpan={6}>해당 회원이 없습니다.</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
						<Pagination page={page} totalPages={query.data.totalPages} onChange={setPage} />
					</>
				)}
			</section>
		</div>
	)
}
