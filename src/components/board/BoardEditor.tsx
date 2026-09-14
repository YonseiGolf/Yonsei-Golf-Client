import AsyncState from '@/components/common/AsyncState'
import SelectField from '@/components/common/SelectField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAction } from '@/hooks/useAction'
import { useQuery } from '@/hooks/useQuery'
import { useAuthStore } from '@/store'
import type { BoardRequest, Category } from '@/types/api'
import { useState } from 'react'
import { categories, getTemplate, getTemplates } from './api'

export default function BoardEditor({
	initial = { category: 'FREE', title: '', content: '' },
	onSave,
	onCancel,
	submitLabel = '게시글 등록',
	templates = false,
}: {
	initial?: BoardRequest
	onSave: (value: BoardRequest) => Promise<void>
	onCancel?: () => void
	submitLabel?: string
	templates?: boolean
}) {
	const [value, setValue] = useState(initial)
	const [selectedTemplate, setSelectedTemplate] = useState('')
	const isAdmin = useAuthStore((state) => Boolean(state.user?.adminStatus))
	const query = useQuery('board-templates', getTemplates, templates && isAdmin)
	const action = useAction()
	const templateAction = useAction()
	const valid = value.title.trim().length > 0 && value.content.trim().length > 0
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault()
				if (valid) void action.run(() => onSave(value))
			}}
		>
			<div className="board-body-container">
				<div className="select-category-title">
					<SelectField
						aria-label="카테고리"
						value={value.category}
						className="select-category"
						onValueChange={(category) => setValue({ ...value, category: category as Category })}
						options={Object.entries(categories)
							.filter(([key]) => key !== 'NOTICE' || isAdmin || initial.category === 'NOTICE')
							.map(([value, label]) => ({ value, label }))}
					/>
					<Input
						aria-label="제목"
						value={value.title}
						required
						maxLength={30}
						placeholder="제목을 입력해 주세요."
						className="input-title"
						onChange={(event) => setValue({ ...value, title: event.target.value })}
					/>
				</div>
				{templates && isAdmin && (
					<div className="select-template">
						<SelectField
							aria-label="게시글 템플릿"
							className="select-template-option"
							disabled={templateAction.pending || query.loading}
							value={selectedTemplate}
							onValueChange={(id) => {
								setSelectedTemplate(id)
								if (!id) return
								void templateAction.run(async () => {
									const data = await getTemplate(id)
									setValue((current) => ({
										...current,
										title: data.title.slice(0, 30),
										content: data.contents.slice(0, 1000),
									}))
								})
							}}
							options={[
								{ value: '', label: '템플릿 없음' },
								...(query.data?.templates.map((template) => ({
									value: String(template.id),
									label: template.title,
								})) ?? []),
							]}
						/>
						<AsyncState
							error={query.error || templateAction.error}
							retry={query.error ? query.reload : undefined}
						/>
					</div>
				)}
			</div>
			<Textarea
				aria-label="내용"
				className="board-body-input"
				required
				maxLength={1000}
				rows={12}
				placeholder="내용을 입력하세요."
				value={value.content}
				onChange={(event) => setValue({ ...value, content: event.target.value })}
			/>
			<AsyncState error={action.error} />
			<div className="button-container">
				<Button
					type="submit"
					className="posting-button"
					disabled={!valid || action.pending || templateAction.pending}
				>
					{action.pending ? '저장 중…' : submitLabel}
				</Button>
				{onCancel && (
					<Button type="button" variant="outline" disabled={action.pending} onClick={onCancel}>
						취소
					</Button>
				)}
			</div>
		</form>
	)
}
