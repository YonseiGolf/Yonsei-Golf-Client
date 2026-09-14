import ApplyPeriod from '@/components/applyinfo/ApplyPeriod'
import ApplyQualification from '@/components/applyinfo/ApplyQualification'
import QnA from '@/components/qna/QnA'

export default function ApplyInfo() {
	return (
		<div className="scope-ApplyInfo">
			<div>
				<ApplyQualification />
				<br />
				<ApplyPeriod />
				<br />
				<QnA />
			</div>
		</div>
	)
}
