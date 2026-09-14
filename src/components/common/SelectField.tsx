import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { ComponentProps } from 'react'

interface Option {
	value: string
	label: string
	disabled?: boolean
}
type Props = Pick<
	ComponentProps<typeof SelectTrigger>,
	| 'id'
	| 'aria-label'
	| 'aria-labelledby'
	| 'aria-describedby'
	| 'aria-invalid'
	| 'className'
	| 'disabled'
> & {
	value: string
	options: readonly Option[]
	onValueChange: (value: string) => void
	placeholder?: string
}

// Radix reserves an empty item value for clearing. Prefix every domain value to
// preserve empty-string options without colliding with a real option's value.
const encode = (value: string) => `option:${value}`
export default function SelectField({
	value,
	options,
	onValueChange,
	placeholder = '선택해주세요',
	disabled,
	...props
}: Props) {
	const selected = options.some((option) => option.value === value) ? encode(value) : ''
	return (
		<Select
			value={selected}
			disabled={disabled || !options.length}
			onValueChange={(next) => onValueChange(next.slice('option:'.length))}
		>
			<SelectTrigger {...props}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{options.map((option) => (
						<SelectItem key={option.value} value={encode(option.value)} disabled={option.disabled}>
							{option.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
