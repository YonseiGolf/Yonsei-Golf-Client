import { getTemplates } from '@/components/board/api'
import AsyncState from '@/components/common/AsyncState'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useQuery } from '@/hooks/useQuery'
import { Link } from 'react-router'
import './BoardTemplateHome.css'

export default function BoardTemplateHome() {
	const query = useQuery('templates', getTemplates)
	return (
		<div className="scope-BoardTemplateHome">
			<h1>게시판 양식</h1>
			<AsyncState {...query} retry={query.reload} />
			{query.data && (
				<div className="table-container mx-auto w-[80%] max-md:w-[calc(100%-2rem)]">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>제목</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{query.data.templates.map((template) => (
								<TableRow key={template.id}>
									<TableCell>
										<Link to={`/admin/board/template/${template.id}`}>{template.title}</Link>
									</TableCell>
								</TableRow>
							))}
							{!query.data.templates.length && (
								<TableRow>
									<TableCell>등록된 템플릿이 없습니다.</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			)}
			<div className="button-out-container">
				<div className="button-container" id="postTemplateButton">
					<Button asChild>
						<Link to="/admin/board/template/post">템플릿 추가</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
