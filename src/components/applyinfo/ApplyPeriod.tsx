import AsyncState from '@/components/common/AsyncState'
import { useQuery } from '@/hooks/useQuery'
import { getRecruit } from './api'
import './ApplyPeriod.css'

export default function ApplyPeriod() {
	const query = useQuery('recruit', getRecruit)
	const data = query.data
	return (
		<div className="scope-ApplyPeriod">
			<h1>모집 일정</h1>
			<AsyncState {...query} retry={query.reload} />
			{data ? (
				<div className="schedule-container">
					<div className="text-box">
						<p>
							<span className="apply-title">서류 접수</span>　{data.startDate} ~ {data.endDate}
						</p>
						<p>
							<span className="apply-title">서류 합격 발표</span>　{data.firstResultDate}
						</p>
						<p>
							<span className="apply-title">면접</span>　{data.interviewStartDate} ~{' '}
							{data.interviewEndDate}
						</p>
						<p>
							<span className="apply-title">최종 결과 발표</span>　{data.finalResultDate}
						</p>
						<p>
							<span className="apply-title">오리엔테이션</span>　{data.orientationDate}
						</p>
					</div>
				</div>
			) : (
				!query.loading && !query.error && <p>등록된 모집 일정이 없습니다.</p>
			)}
		</div>
	)
}
