import { getAvailability } from '@/components/applyinfo/api'
import AsyncState from '@/components/common/AsyncState'
import QnA from '@/components/qna/QnA'
import { useQuery } from '@/hooks/useQuery'
import ApplyTerm from './ApplyTerm'
import NotApplyTerm from './NotApplyTerm'
import './ApplicationPage.css'

export default function ApplicationPage() {
	const query = useQuery('availability', getAvailability)
	return (
		<div className="scope-ApplicationPage">
			<AsyncState {...query} retry={query.reload} />
			{query.data === true && <ApplyTerm />}
			{query.data === false && <NotApplyTerm />}
			<div className="white-container" />
			<QnA />
		</div>
	)
}
