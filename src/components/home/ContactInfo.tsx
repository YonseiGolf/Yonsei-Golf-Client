import { Button } from '@/components/ui/button'
import { Link } from 'react-router'
import './ContactInfo.css'

export default function ContactInfo() {
	return (
		<div className="scope-ContactInfo">
			<div className="white-container" />
			<div className="contact-card">
				<h1>지금 바로 함께 해요</h1>
				<div className="contact-detail">상세 문의사항</div>
				<p>
					INSTAGRAM :
					<a href="https://www.instagram.com/yonsei__golf" target="_blank" rel="noreferrer">
						@yonsei__golf
					</a>
				</p>
				<div className="buttons">
					<Button asChild variant="outline" size="lg">
						<Link to="/recruit">모집안내</Link>
					</Button>
					&nbsp;&nbsp;
					<Button asChild size="lg">
						<Link to="/apply">지원하기</Link>
					</Button>
				</div>
			</div>
			<div className="white-container" />
		</div>
	)
}
