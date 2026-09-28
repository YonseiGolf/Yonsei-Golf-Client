import AsyncState from '@/components/common/AsyncState'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@/hooks/useQuery'
import { formatDateTime } from '@/lib/format'
import { useAuthStore } from '@/store'
import type { Category } from '@/types/api'
import { useState } from 'react'
import { Link } from 'react-router'
import { categories, getBoards } from './api'
import './BoardHome.css'

export default function BoardHome() {
	const [category, setCategory] = useState<Category | ''>('')
	const [page, setPage] = useState(0)
	const user = useAuthStore((state) => state.user)
	const query = useQuery(`boards:${page}:${category}`, (signal) =>
		getBoards(page, category, signal),
	)
	return (
		<div className="scope-BoardHome">
			<h1>게시판</h1>
			<Tabs
				value={category || 'all'}
				onValueChange={(value) => {
					setCategory(value === 'all' ? '' : (value as Category))
					setPage(0)
				}}
			>
				<TabsList aria-label="게시판 분류" className="mx-auto mb-6 h-11 max-w-full">
					{Object.entries({ '': '전체', ...categories }).map(([key, label]) => (
						<TabsTrigger
							key={key}
							value={key || 'all'}
							className="px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
						>
							{label}
						</TabsTrigger>
					))}
				</TabsList>
				<TabsContent value={category || 'all'}>
					<AsyncState {...query} retry={query.reload} />
					{query.data && (
						<>
							<div className="table-scroll">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>카테고리</TableHead>
											<TableHead>제목</TableHead>
											<TableHead>작성자</TableHead>
											<TableHead>작성일</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{query.data.content.map((post) => (
											<TableRow className="boardList" key={post.id}>
												<TableCell>{categories[post.category]}</TableCell>
												<TableCell>
													<Link to={`/board/${post.id}`}>{post.title}</Link>
												</TableCell>
												<TableCell>{post.writer}</TableCell>
												<TableCell>{formatDateTime(post.createdAt)}</TableCell>
											</TableRow>
										))}
										{!query.data.content.length && (
											<TableRow>
												<TableCell colSpan={4}>등록된 게시글이 없습니다.</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
							<Pagination page={page} totalPages={query.data.totalPages} onChange={setPage} />
						</>
					)}
				</TabsContent>
			</Tabs>
			<div className="createBoardContainer">
				<Button asChild>
					<Link to={user ? '/board/post' : '/login'}>
						<span className="postBoard">새 글 작성</span>
					</Link>
				</Button>
			</div>
		</div>
	)
}
