import AsyncState from '@/components/common/AsyncState'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'
import { useAuthStore } from '@/store'
import { Navigate, useLocation } from 'react-router'
import './LoginPage.css'

export default function LoginPage() {
	const user = useAuthStore((state) => state.user)
	const location = useLocation()
	if (user) return <Navigate to="/" replace />
	const params = new URLSearchParams({
		client_id: env.kakaoKey,
		redirect_uri: env.kakaoRedirectUri,
		response_type: 'code',
	})
	return (
		<div className="scope-LoginPage">
			<div className="yonsei-golf">
				<img
					src="https://minio.birdie.men/yg-img-storage/store-image/yg-mark.pngPhLjHNx7Kt"
					alt="연세골프"
				/>
				<h1>Yonsei-Golf</h1>
				{location.state?.message && <output>{String(location.state.message)}</output>}
				<Button
					type="button"
					id="login-text"
					variant="secondary"
					className="min-h-12 max-w-full rounded-[20px] bg-[#ffeb3b] px-6 py-4 text-base font-bold text-[#191919] hover:bg-[#ffc107]"
					disabled={!env.kakaoKey}
					onClick={() => {
						window.location.href = `https://kauth.kakao.com/oauth/authorize?${params}`
					}}
				>
					<img
						src="https://minio.birdie.men/yg-img-storage/store-image/yg-mark.pngPhLjHNx7Kt"
						alt=""
						id="kako"
					/>
					카카오로 3초 만에 시작하기
				</Button>
				<AsyncState error={!env.kakaoKey ? '카카오 로그인 설정이 필요합니다.' : ''} />
			</div>
		</div>
	)
}
