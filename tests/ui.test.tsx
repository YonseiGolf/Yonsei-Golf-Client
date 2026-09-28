import SelectField from '@/components/common/SelectField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

describe('shadcn form primitives', () => {
	it('defaults to a non-submitting button, while explicit submit still works', () => {
		const submitted = vi.fn((event) => event.preventDefault())
		render(
			<form onSubmit={submitted}>
				<Button>취소</Button>
				<Button type="submit">저장</Button>
			</form>,
		)
		fireEvent.click(screen.getByRole('button', { name: '취소' }))
		expect(submitted).not.toHaveBeenCalled()
		fireEvent.click(screen.getByRole('button', { name: '저장' }))
		expect(submitted).toHaveBeenCalledTimes(1)
	})
	it('composes a link without a nested button or invalid type attribute', () => {
		render(
			<Button asChild variant="outline">
				<a href="/apply">지원하기</a>
			</Button>,
		)
		const link = screen.getByRole('link', { name: '지원하기' })
		expect(link.getAttribute('href')).toBe('/apply')
		expect(link.getAttribute('type')).toBeNull()
		expect(link.getAttribute('data-slot')).toBe('button')
		expect(screen.queryByRole('button')).toBeNull()
	})
	it('preserves labels, refs, native constraints and invalid state', () => {
		const input = createRef<HTMLInputElement>()
		render(
			<>
				<Label htmlFor="email">이메일</Label>
				<Input id="email" type="email" required ref={input} aria-invalid maxLength={80} />
				<Label htmlFor="essay">자기소개</Label>
				<Textarea id="essay" maxLength={500} disabled />
			</>,
		)
		expect(screen.getByLabelText('이메일')).toBe(input.current)
		expect(input.current?.required).toBe(true)
		expect(input.current?.maxLength).toBe(80)
		expect(input.current?.getAttribute('aria-invalid')).toBe('true')
		expect((screen.getByLabelText('자기소개') as HTMLTextAreaElement).disabled).toBe(true)
	})
	it('disables an empty select and still exposes its accessible name', () => {
		render(
			<>
				<Label htmlFor="semester">기수</Label>
				<SelectField
					id="semester"
					value=""
					options={[]}
					onValueChange={vi.fn()}
					placeholder="등록된 기수 없음"
				/>
			</>,
		)
		const trigger = screen.getByRole('combobox', { name: '기수' }) as HTMLButtonElement
		expect(trigger.disabled).toBe(true)
		expect(trigger.textContent).toBe('등록된 기수 없음')
	})
	it('represents an empty-string option without confusing it with a placeholder', () => {
		render(
			<SelectField
				aria-label="분류"
				value=""
				options={[
					{ value: '', label: '전체' },
					{ value: 'FREE', label: '자유게시판' },
				]}
				onValueChange={vi.fn()}
				placeholder="선택해주세요"
			/>,
		)
		expect(screen.getByRole('combobox', { name: '분류' }).textContent).toBe('전체')
	})
})
