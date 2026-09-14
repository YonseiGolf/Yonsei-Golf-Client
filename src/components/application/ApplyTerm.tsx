import { Button } from '@/components/ui/button'
import { Link } from 'react-router'
import './ApplyTerm.css'

export default function ApplyTerm() {
	return (
		<div className="scope-ApplyTerm">
			<div className="container">
				<h1>Welcome</h1>

				<h2>
					연세 골프는 당신을 환영합니다!
					<br />
					지금 바로 지원하세요
				</h2>

				<Button asChild size="lg">
					<Link to="/apply/form">지원하러 가기</Link>
				</Button>
			</div>
		</div>
	)
}
