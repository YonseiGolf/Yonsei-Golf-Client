import AsyncState from '@/components/common/AsyncState'
import { confirmAction } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAction } from '@/hooks/useAction'
import { useQuery } from '@/hooks/useQuery'
import type { MailTemplate, MailTemplateContent } from '@/types/api'
import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import {
	SAMPLE_NAME,
	getMailTemplates,
	mailTemplateError,
	mailTemplateInfo,
	previewMail,
	resetMailTemplate,
	saveMailTemplate,
} from './mail'
import './MailTemplates.css'

export default function MailTemplates() {
	const [params, setParams] = useSearchParams()
	const query = useQuery('mail-templates', getMailTemplates)
	const templates = query.data ?? []
	const selected = templates.find((item) => item.type === params.get('type')) ?? templates[0]
	// Kept after saving so the editor does not flash the old text until the list reloads.
	const [draft, setDraft] = useState<MailTemplateContent & { type: string }>()
	const [notice, setNotice] = useState('')
	const value = draft?.type === selected?.type ? draft : selected
	const dirty = Boolean(
		selected && value && (value.subject !== selected.subject || value.body !== selected.body),
	)
	return (
		<div className="scope-MailTemplates">
			<div className="mail-templates">
				<h2>메일 양식</h2>
				<p className="guide">
					지원자와 모집 알림 신청자에게 보내는 메일의 제목과 본문입니다. 저장한 양식은 다음 발송부터
					사용됩니다.
				</p>
				<AsyncState {...query} retry={query.reload} />
				{selected && value && (
					<>
						<nav aria-label="메일 종류">
							<ul className="template-list">
								{templates.map((item) => (
									<li key={item.type}>
										<Button
											type="button"
											variant={item.type === selected.type ? 'secondary' : 'outline'}
											aria-current={item.type === selected.type ? 'true' : undefined}
											onClick={async () => {
												if (item.type === selected.type) return
												if (
													dirty &&
													!(await confirmAction(
														'저장하지 않은 변경 내용이 있습니다.',
														'다른 메일로 이동하면 수정한 내용이 사라집니다.',
													))
												)
													return
												setDraft(undefined)
												setNotice('')
												setParams({ type: item.type })
											}}
										>
											{mailTemplateInfo[item.type]?.label ?? item.type}
											{item.customized && <span className="badge">수정됨</span>}
										</Button>
									</li>
								))}
							</ul>
						</nav>
						<TemplateForm
							template={selected}
							value={value}
							dirty={dirty}
							reloading={query.loading}
							notice={notice}
							onChange={(content) => {
								setDraft({ ...content, type: selected.type })
								setNotice('')
							}}
							onSaved={(message, discard) => {
								if (discard) setDraft(undefined)
								setNotice(message)
								query.reload()
							}}
						/>
					</>
				)}
			</div>
		</div>
	)
}

function TemplateForm({
	template,
	value,
	dirty,
	reloading,
	notice,
	onChange,
	onSaved,
}: {
	template: MailTemplate
	value: MailTemplateContent
	dirty: boolean
	reloading: boolean
	notice: string
	onChange: (value: MailTemplateContent) => void
	onSaved: (message: string, discardDraft: boolean) => void
}) {
	const action = useAction()
	const body = useRef<HTMLTextAreaElement>(null)
	const info = mailTemplateInfo[template.type]
	const error = mailTemplateError(value, template.placeholders)
	const busy = action.pending || reloading
	function insert(placeholder: string) {
		const start = body.current?.selectionStart ?? value.body.length
		const end = body.current?.selectionEnd ?? start
		onChange({
			...value,
			body: value.body.slice(0, start) + placeholder + value.body.slice(end),
		})
		requestAnimationFrame(() => {
			body.current?.focus()
			body.current?.setSelectionRange(start + placeholder.length, start + placeholder.length)
		})
	}
	return (
		<section className="form-section" aria-label={`${info?.label ?? template.type} 메일 양식`}>
			<div className="form-header">
				<h3>{info?.label ?? template.type}</h3>
				<span className="state">
					{template.customized ? '수정한 문구 사용 중' : '기본 문구 사용 중'}
				</span>
			</div>
			{info && <p className="when">{info.when}</p>}
			<form
				onSubmit={(event) => {
					event.preventDefault()
					if (error || !dirty) return
					void action.run(async () => {
						if (
							await confirmAction(
								`${info?.label ?? template.type} 메일 양식을 저장하시겠습니까?`,
								'다음 발송부터 저장한 문구가 사용됩니다.',
							)
						) {
							await saveMailTemplate(template.type, value)
							onSaved('저장했습니다. 다음 발송부터 이 문구가 사용됩니다.', false)
						}
					})
				}}
			>
				<div className="form-group">
					<Label htmlFor="mail-subject">제목</Label>
					<Input
						id="mail-subject"
						maxLength={255}
						required
						value={value.subject}
						onChange={(event) => onChange({ ...value, subject: event.target.value })}
					/>
				</div>
				<div className="form-group">
					<Label htmlFor="mail-body">본문</Label>
					<Textarea
						id="mail-body"
						ref={body}
						maxLength={10000}
						required
						rows={12}
						value={value.body}
						onChange={(event) => onChange({ ...value, body: event.target.value })}
					/>
					{template.placeholders.length ? (
						<div className="placeholders">
							<span>
								{template.placeholders.join(', ')} 자리에 받는 지원자의 이름이 들어갑니다.
							</span>
							{template.placeholders.map((placeholder) => (
								<Button
									key={placeholder}
									type="button"
									variant="outline"
									size="sm"
									onClick={() => insert(placeholder)}
								>
									본문에 {placeholder} 넣기
								</Button>
							))}
						</div>
					) : (
						<p className="placeholders">
							이 메일은 받는 사람의 이름을 알 수 없어 {'{{이름}}'} 같은 변수를 쓸 수 없습니다.
						</p>
					)}
				</div>
				<AsyncState error={error || action.error} />
				{notice && <output className="success-message">{notice}</output>}
				<div className="button-group">
					<Button type="submit" disabled={!dirty || Boolean(error) || busy}>
						저장
					</Button>
					<Button
						type="button"
						variant="outline"
						disabled={!dirty || busy}
						onClick={() => onChange({ subject: template.subject, body: template.body })}
					>
						변경 취소
					</Button>
					<Button
						type="button"
						variant="outline"
						disabled={!template.customized || busy}
						onClick={() =>
							void action.run(async () => {
								if (
									await confirmAction(
										'기본 문구로 되돌리시겠습니까?',
										'저장한 문구를 지우고 처음 제공된 문구로 발송합니다.',
									)
								) {
									await resetMailTemplate(template.type)
									onSaved('기본 문구로 되돌렸습니다.', true)
								}
							})
						}
					>
						기본 문구로 되돌리기
					</Button>
				</div>
			</form>
			<section className="preview" aria-label="미리보기">
				<h4>미리보기 {template.placeholders.length > 0 && `(이름: ${SAMPLE_NAME})`}</h4>
				<p className="preview-subject">{previewMail(value.subject, template.placeholders)}</p>
				<p className="preserve-lines">{previewMail(value.body, template.placeholders)}</p>
			</section>
		</section>
	)
}
