import AsyncState from '@/components/common/AsyncState'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAction } from '@/hooks/useAction'
import { formatDateTime, toDateTimeInput } from '@/lib/format'
import { useState } from 'react'

export default function InterviewModal({
	initial,
	onClose,
	onSave,
	onReturnFocus,
}: {
	initial: string | null
	onClose: () => void
	onSave: (time: string) => Promise<void>
	onReturnFocus: () => void
}) {
	const [time, setTime] = useState(toDateTimeInput(initial))
	const action = useAction()
	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open && !action.pending) onClose()
			}}
		>
			<DialogContent
				showCloseButton={false}
				onCloseAutoFocus={(event) => {
					event.preventDefault()
					onReturnFocus()
				}}
			>
				<DialogHeader>
					<DialogTitle>면접 시간 변경</DialogTitle>
					<DialogDescription>지원자에게 배정할 면접 시간을 입력해주세요.</DialogDescription>
				</DialogHeader>
				{initial && (
					<p className="text-sm">
						현재 배정: {formatDateTime(initial)}
						{!toDateTimeInput(initial) && ' · 연도를 포함한 날짜를 다시 선택해주세요.'}
					</p>
				)}
				<form
					className="space-y-5"
					onSubmit={(event) => {
						event.preventDefault()
						if (time) void action.run(() => onSave(`${time}:00`))
					}}
				>
					<div className="space-y-2">
						<Label htmlFor="assigned-interview-time">면접 일시</Label>
						<Input
							id="assigned-interview-time"
							type="datetime-local"
							required
							value={time}
							disabled={action.pending}
							onChange={(event) => setTime(event.target.value)}
						/>
					</div>
					<AsyncState error={action.error} />
					<DialogFooter>
						<Button variant="outline" disabled={action.pending} onClick={onClose}>
							닫기
						</Button>
						<Button type="submit" disabled={!time || action.pending}>
							면접 시간 변경
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
