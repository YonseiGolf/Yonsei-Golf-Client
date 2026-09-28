import AsyncState from '@/components/common/AsyncState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAction } from '@/hooks/useAction'
import type { BoardTemplate } from '@/types/api'
import { useState } from 'react'
import './PostTemplate.css'

export default function TemplateEditor({
	initial = { title: '', contents: '' },
	onSave,
	onCancel,
}: {
	initial?: Omit<BoardTemplate, 'id'>
	onSave: (value: Omit<BoardTemplate, 'id'>) => Promise<void>
	onCancel?: () => void
}) {
	const [value, setValue] = useState(initial)
	const action = useAction()
	const valid = value.title.trim() && value.contents.trim()
	return (
		<div className="scope-PostTemplate">
			<form
				onSubmit={(event) => {
					event.preventDefault()
					if (valid) void action.run(() => onSave({ title: value.title, contents: value.contents }))
				}}
			>
				<div className="template-body-container">
					<div className="title-input">
						<Input
							aria-label="템플릿 제목"
							type="text"
							maxLength={30}
							required
							value={value.title}
							className="input-title"
							placeholder="제목을 입력해 주세요."
							onChange={(event) => setValue({ ...value, title: event.target.value })}
						/>
					</div>
				</div>
				<Textarea
					aria-label="템플릿 내용"
					className="board-body-input"
					maxLength={1000}
					required
					value={value.contents}
					rows={12}
					placeholder="내용을 입력하세요."
					onChange={(event) => setValue({ ...value, contents: event.target.value })}
				/>
				<AsyncState error={action.error} />
				<div className="button-container">
					<Button type="submit" className="posting-button" disabled={!valid || action.pending}>
						{onCancel ? '저장' : '템플릿 등록'}
					</Button>
					{onCancel && (
						<Button type="button" variant="outline" disabled={action.pending} onClick={onCancel}>
							취소
						</Button>
					)}
				</div>
			</form>
		</div>
	)
}
