import AsyncState from '@/components/common/AsyncState'
import { confirmAction } from '@/components/common/ConfirmDialog'
import Pagination from '@/components/common/Pagination'
import { Button } from '@/components/ui/button'
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
import { formatDateTime } from '@/lib/format'
import type { ApplicationSummary, Page } from '@/types/api'
import { useState } from 'react'
import { Link } from 'react-router'
import './ApplicationTable.css'

export default function ApplicationTable({
	title,
	semester,
	documentPass,
	finalPass,
}: { title: string; semester: number; documentPass?: boolean; finalPass?: boolean }) {
	const [page, setPage] = useState(0)
	const [sent, setSent] = useState(false)
	const params = queryString({ semester, documentPass, finalPass, page, size: 10 })
	const query = useQuery(`forms${params}`, (signal) =>
		api<Page<ApplicationSummary>>(`/admin/forms${params}`, { signal }),
	)
	const action = useAction()
	return (
		<div className="scope-ApplicationTable">
			<section className="application-container" aria-label={title}>
				<h3>
					{title} {query.data?.totalElements ?? 0}개
				</h3>
				{documentPass !== undefined && (
					<Button
						type="button"
						disabled={action.pending}
						onClick={() =>
							void action.run(async () => {
								if (
									await confirmAction(
										`${title} 메일을 발송하시겠습니까?`,
										'전체 기수에서 해당 결과의 메일을 아직 받지 않은 지원자에게 발송합니다. 현재 목록의 기수로 제한되지 않습니다.',
									)
								) {
									await api('/admin/forms/results', {
										method: 'POST',
										body: { documentPass, finalPass: finalPass ?? null },
									})
									setSent(true)
								}
							})
						}
					>
						전체 기수 {title} 메일 보내기
					</Button>
				)}
				<AsyncState {...query} retry={query.reload} />
				<AsyncState error={action.error} />
				{sent && <output className="success-message">메일 발송 요청이 완료되었습니다.</output>}
				{query.data && (
					<>
						<div className="table-scroll">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>사진</TableHead>
										<TableHead>이름</TableHead>
										<TableHead>면접 시간</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{query.data.content.map((item) => (
										<TableRow key={item.id}>
											<TableCell>
												{item.photo && (
													<img
														src={item.photo}
														alt={`${item.name} 지원자`}
														style={{ maxWidth: 100 }}
													/>
												)}
											</TableCell>
											<TableCell>
												<Link to={`/application/${item.id}`}>{item.name}</Link>
											</TableCell>
											<TableCell>{formatDateTime(item.interviewTime)}</TableCell>
										</TableRow>
									))}
									{!query.data.content.length && (
										<TableRow>
											<TableCell colSpan={3}>해당 지원서가 없습니다.</TableCell>
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
