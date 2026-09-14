import AsyncState from '@/components/common/AsyncState'
import { errorMessage } from '@/lib/api'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { completeKakaoLogin } from './api'

export default function CallBack() {
	const [params] = useSearchParams()
	const code = params.get('code')
	const denied = params.get('error')
	const [error, setError] = useState('')
	const navigate = useNavigate()
	useEffect(() => {
		if (!code || denied) {
			setError('카카오 로그인이 취소되었거나 인가 코드가 없습니다.')
			return
		}
		let active = true
		void completeKakaoLogin(code).then(
			(result) => {
				if (active) navigate(result === 'signup' ? '/signup' : '/', { replace: true })
			},
			(cause: unknown) => {
				if (active) setError(errorMessage(cause))
			},
		)
		return () => {
			active = false
		}
	}, [code, denied, navigate])
	return (
		<div className="page-container">
			<AsyncState loading={!error} error={error} />
			{error && <Link to="/login">로그인 다시 시도</Link>}
		</div>
	)
}
