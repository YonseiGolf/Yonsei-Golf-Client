import AsyncState from '@/components/common/AsyncState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAction } from '@/hooks/useAction'
import { api } from '@/lib/api'
import { useState } from 'react'
import './NotApplyTerm.css'

export default function NotApplyTerm() {
	const [email, setEmail] = useState('')
	const [success, setSuccess] = useState(false)
	const action = useAction()
	return (
		<div className="scope-NotApplyTerm">
			<div className="term-container">
				<h1>
					지금은 모집기간이 아닙니다.
					<br />
					모집 기간이 되면 메일로 알려드립니다.
				</h1>
				<form
					className="email-form"
					onSubmit={(event) => {
						event.preventDefault()
						void action.run(async () => {
							await api('/application/emailAlarm', {
								method: 'POST',
								body: { email: email.trim(), semester: 0 },
								auth: false,
							})
							setSuccess(true)
						})
					}}
				>
					<div className="flex gap-2.5 max-sm:flex-col">
						<Input
							type="email"
							aria-label="알림 받을 이메일"
							className="h-12 bg-white px-4 text-base md:text-base"
							value={email}
							onChange={(event) => {
								setEmail(event.target.value)
								setSuccess(false)
							}}
							placeholder="메일을 입력해주세요"
							required
						/>
						<Button
							type="submit"
							size="lg"
							className="h-12 min-w-35 text-base"
							disabled={!email.trim() || action.pending || success}
						>
							알림 등록
						</Button>
					</div>
					<AsyncState error={action.error} />
					{success && (
						<output className="success-message">알림이 성공적으로 등록되었습니다.</output>
					)}
				</form>
			</div>
		</div>
	)
}
