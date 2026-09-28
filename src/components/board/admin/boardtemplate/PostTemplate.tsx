import { saveTemplate } from '@/components/board/api'
import { useNavigate } from 'react-router'
import TemplateEditor from './TemplateEditor'

export default function PostTemplate() {
	const navigate = useNavigate()
	return (
		<>
			<h2>템플릿 생성</h2>
			<TemplateEditor
				onSave={async (value) => {
					await saveTemplate(value)
					navigate('/admin/board/template')
				}}
			/>
		</>
	)
}
