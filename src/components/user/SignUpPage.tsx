import AsyncState from '@/components/common/AsyncState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAction } from '@/hooks/useAction'
import { formatPhoneNumber } from '@/lib/format'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { signUp } from './api'
import './SignUpPage.css'

export default function SignUpPage() {
	const [values, setValues] = useState({
		name: '',
		phoneNumber: '',
		studentId: '',
		major: '',
		semester: '',
	})
	const action = useAction()
	const navigate = useNavigate()
	if (!sessionStorage.getItem('signupToken')) return <Navigate to="/login" replace />
	const valid =
		values.name.trim() &&
		values.major.trim() &&
		/^\d{2}$/.test(values.studentId) &&
		/^\d{1,2}$/.test(values.semester) &&
		/^010-\d{4}-\d{4}$/.test(values.phoneNumber)
	return (
		<div className="scope-SignUpPage">
			<div className="register-container">
				<h2>회원가입</h2>
				<form
					onSubmit={(event) => {
						event.preventDefault()
						if (valid)
							void action.run(async () => {
								await signUp({
									...values,
									name: values.name.trim(),
									major: values.major.trim(),
									studentId: Number(values.studentId),
									semester: Number(values.semester),
								})
								navigate('/login', {
									replace: true,
									state: { message: '회원가입에 성공했습니다. 다시 로그인해 주세요.' },
								})
							})
					}}
				>
					{(
						[
							['name', '이름', '김연골', 10],
							['phoneNumber', '전화번호', '010-0000-0000', 13],
							['studentId', '학번', '16', 2],
							['major', '학과', '국어국문학과', 10],
							['semester', '연세골프 기수', '10', 2],
						] as const
					).map(([key, label, placeholder, length]) => (
						<div className="input-group" key={key}>
							<Label htmlFor={key}>{label}</Label>
							<Input
								id={key}
								value={values[key]}
								placeholder={placeholder}
								maxLength={length}
								required
								inputMode={
									['studentId', 'semester', 'phoneNumber'].includes(key) ? 'numeric' : 'text'
								}
								onChange={(event) =>
									setValues({
										...values,
										[key]:
											key === 'phoneNumber'
												? formatPhoneNumber(event.target.value)
												: event.target.value,
									})
								}
							/>
						</div>
					))}
					<AsyncState error={action.error} />
					<Button type="submit" disabled={!valid || action.pending}>
						{action.pending ? '가입 중…' : '회원가입'}
					</Button>
				</form>
			</div>
		</div>
	)
}
