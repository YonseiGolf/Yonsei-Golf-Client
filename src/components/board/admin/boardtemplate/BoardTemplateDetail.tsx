import { deleteTemplate, getTemplate, saveTemplate } from '@/components/board/api'
import AsyncState from '@/components/common/AsyncState'
import { confirmAction } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/useAction'
import { useQuery } from '@/hooks/useQuery'
import type { BoardTemplate } from '@/types/api'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import TemplateEditor from './TemplateEditor'
import './BoardTemplateDetail.css'

export default function BoardTemplateDetail() {
	const { templateId = '' } = useParams()
	const query = useQuery(`template:${templateId}`, (signal) => getTemplate(templateId, signal))
	return (
		<>
			<AsyncState {...query} retry={query.reload} />
			{query.data && <Detail key={query.data.id} template={query.data} reload={query.reload} />}
		</>
	)
}
function Detail({ template, reload }: { template: BoardTemplate; reload: () => void }) {
	const [editing, setEditing] = useState(false)
	const action = useAction()
	const navigate = useNavigate()
	if (editing)
		return (
			<TemplateEditor
				initial={template}
				onCancel={() => setEditing(false)}
				onSave={async (value) => {
					await saveTemplate(value, template.id)
					setEditing(false)
					reload()
				}}
			/>
		)
	return (
		<div className="scope-BoardTemplateDetail">
			<h2>게시글 템플릿 본문</h2>
			<div className="board-container">
				<h1 className="detail-title">{template.title}</h1>
				<div className="post-header">
					<div className="post-actions">
						<Button
							type="button"
							variant="outline"
							className="edit-delete-post"
							onClick={() => setEditing(true)}
						>
							수정
						</Button>
						<Button
							type="button"
							variant="destructive"
							className="edit-delete-post"
							disabled={action.pending}
							onClick={() =>
								void action.run(async () => {
									if (await confirmAction('템플릿을 삭제하시겠습니까?')) {
										await deleteTemplate(template.id)
										navigate('/admin/board/template')
									}
								})
							}
						>
							삭제
						</Button>
					</div>
				</div>
				<hr />
				<p className="detail-content preserve-lines">{template.contents}</p>
				<hr />
				<AsyncState error={action.error} />
				<Link to="/admin/board/template">목록</Link>
			</div>
		</div>
	)
}
