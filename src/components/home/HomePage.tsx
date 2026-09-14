import ClubActivityIntroduction from '@/components/home/ClubActivityIntroduction'
import ClubIntroduction from '@/components/home/ClubIntroduction'
import ContactInfo from '@/components/home/ContactInfo'
import MainInfo from '@/components/home/MainInfo'

export default function HomePage() {
	return (
		<div className="scope-HomePage">
			<div>
				<MainInfo />
				<ClubIntroduction />
				<ClubActivityIntroduction />
				<ContactInfo />
			</div>
		</div>
	)
}
