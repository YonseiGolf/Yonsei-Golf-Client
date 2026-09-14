import { Button } from '@/components/ui/button'
import { useState } from 'react'
import './ClubActivityIntroduction.css'

const activities = [
	{
		image: 'freshmen-mt.jpegUsgBCksEbD',
		title: '정규 활동',
		description: '매주 목요일 신촌역 부근에서\n정기활동을 진행해요',
	},
	{
		image: 'freshmen-mt.jpegUsgBCksEbD',
		title: '신입 환영 MT',
		description: '신입 부원들과 기존 부원들과의 조화를 위해\n신입 환영 MT를 진행해요',
	},
	{
		image: 'yb-rounding.jpegm2v2OBd1a3',
		title: '단체 라운딩',
		description: '매 학기 경기권에서 라운딩을 진행해요',
	},
	{
		image: 'ob-rounding.jpegfy6Y06Pp3R',
		title: 'OB 라운딩',
		description: 'YB 활동이 끝나더라도\nOB 부원과 라운딩을 함께해요',
	},
]

export default function ClubActivityIntroduction() {
	const [slide, setSlide] = useState(0)
	const [active, setActive] = useState<string[]>([])
	function card(index: number, mobile = false) {
		const item = activities[index]
		return (
			<Button
				type="button"
				variant="ghost"
				className={`${mobile ? 'mobile-card' : 'card'} hover-card min-h-[200px] w-full whitespace-normal rounded-[10px] border border-slate-400 bg-transparent p-0 text-base text-white hover:bg-transparent hover:text-white`}
				key={item.title}
				aria-label={item.title}
				aria-pressed={active.includes(item.title)}
				onClick={() =>
					setActive((values) =>
						values.includes(item.title)
							? values.filter((value) => value !== item.title)
							: [...values, item.title],
					)
				}
			>
				<img
					src={`https://minio.up-api.kr/yg-img-storage/store-image/${item.image}`}
					alt={item.title}
					className="introduction-image"
					loading="lazy"
				/>
				<span className={`hover-content ${active.includes(item.title) ? 'active' : ''}`}>
					<span className="main-title">
						{item.title}
						<br />
						<br />
					</span>
					<span className="main-body">{item.description}</span>
				</span>
			</Button>
		)
	}
	return (
		<div className="scope-ClubActivityIntroduction">
			<div className="blue-container">
				<h2 id="title">연골 동아리는 이런 활동을 해요</h2>
				<div className="desktop-cards">{activities.map((_, index) => card(index))}</div>
				<div className="mobile-carousel" aria-label="동아리 활동">
					<div className="carousel-container">
						<Button
							type="button"
							variant="secondary"
							size="icon"
							className="carousel-arrow left-arrow size-10 rounded-full bg-white/80 p-0 text-2xl text-primary hover:bg-white"
							aria-label="이전 활동"
							onClick={() => setSlide((slide + 3) % 4)}
						>
							‹
						</Button>
						<div className="carousel-slide">{card(slide, true)}</div>
						<Button
							type="button"
							variant="secondary"
							size="icon"
							className="carousel-arrow right-arrow size-10 rounded-full bg-white/80 p-0 text-2xl text-primary hover:bg-white"
							aria-label="다음 활동"
							onClick={() => setSlide((slide + 1) % 4)}
						>
							›
						</Button>
					</div>
					<div className="carousel-dots">
						{activities.map((item, index) => (
							<Button
								type="button"
								key={item.title}
								variant="ghost"
								size="icon-sm"
								className="size-8 rounded-full p-0 hover:bg-white/10"
								aria-label={`${item.title} 보기`}
								aria-current={index === slide ? 'true' : undefined}
								onClick={() => setSlide(index)}
							>
								<span
									aria-hidden="true"
									className={`size-3 rounded-full ${index === slide ? 'bg-white' : 'bg-white/50'}`}
								/>
							</Button>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
