import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useRef } from 'react'
import { create } from 'zustand'

interface Confirmation {
	title: string
	description?: string
	resolve: (value: boolean) => void
	returnFocus: HTMLElement | null
}
const useConfirmation = create<{ current: Confirmation | null }>(() => ({ current: null }))
export function confirmAction(title: string, description?: string) {
	useConfirmation.getState().current?.resolve(false)
	const returnFocus =
		document.querySelector<HTMLElement>('[role="combobox"][aria-expanded="true"]') ??
		(document.activeElement instanceof HTMLElement ? document.activeElement : null)
	return new Promise<boolean>((resolve) =>
		useConfirmation.setState({ current: { title, description, resolve, returnFocus } }),
	)
}
export default function ConfirmDialog() {
	const current = useConfirmation((state) => state.current)
	const returnFocus = useRef<HTMLElement | null>(null)
	function close(value: boolean) {
		const pending = useConfirmation.getState().current
		if (!pending) return
		returnFocus.current = pending.returnFocus
		pending.resolve(value)
		useConfirmation.setState({ current: null })
	}
	return (
		<AlertDialog
			open={Boolean(current)}
			onOpenChange={(open) => {
				if (!open) close(false)
			}}
		>
			<AlertDialogContent
				onCloseAutoFocus={(event) => {
					event.preventDefault()
					requestAnimationFrame(() => {
						if (returnFocus.current?.isConnected) returnFocus.current.focus()
					})
				}}
			>
				<AlertDialogHeader>
					<AlertDialogTitle>{current?.title}</AlertDialogTitle>
					<AlertDialogDescription>
						{current?.description || '확인하면 요청을 실행합니다.'}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => close(false)}>취소</AlertDialogCancel>
					<AlertDialogAction onClick={() => close(true)}>확인</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
